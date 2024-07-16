import { isIP } from "node:net";
import { TLSSocket } from "node:tls";
import { fetch, Agent, Client, RequestInfo, RequestInit, buildConnector, Request } from "undici";
import { dohResolve } from "./doh";

export function createFetch(dohServer?: string) {
    const OPT_NO_CHECK = {
        servername: "", //? the server should not check servername, otherwise it does not work
        rejectUnauthorized: false,
        checkServerIdentity: () => undefined,
    };

    const connector = buildConnector(OPT_NO_CHECK);

    return async function (
        input: RequestInfo,
        init?: RequestInit & { ip?: string; domain?: string; dohServer?: string }
    ) {
        const { url } = new Request(input, init);
        const domain = init?.domain || new URL(url).hostname;
        const ip = init?.ip || (isIP(domain) ? domain : (await dohResolve(domain, dohServer ?? init?.dohServer))[0]);

        return fetch(input, {
            ...init,
            dispatcher: new Agent({
                connect: OPT_NO_CHECK,
                factory: (origin: URL, opts: Object) => {
                    return new Client(origin.toString().replace(domain, ip), {
                        ...opts,
                        connect(opts, cb) {
                            connector(opts, (err: any, socket: any) => {
                                if (err) {
                                    cb(err, null);
                                } else {
                                    const s = socket as TLSSocket & { servername: string };
                                    s.servername = domain;
                                    cb(null, socket);
                                }
                            });
                        },
                    });
                },
            }),
        });
    };
}

export const fetchX = createFetch();
