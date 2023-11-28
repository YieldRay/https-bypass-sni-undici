import { fetch } from "undici";

export async function doh(server: string, domain: string, type = "A") {
    const url = new URL(server);
    url.searchParams.set("name", domain);
    url.searchParams.set("type", type);
    const res = await fetch(url, {
        headers: {
            "content-type": "application/dns-message",
            accept: "application/dns-json",
        },
    });
    if (!res.ok)
        throw new Error(
            `fetch is not OK. Make sure you are using a DoH server with json support. ${res.status} ${res.statusText}`
        );
    const txt = await res.text();
    try {
        return JSON.parse(txt);
    } catch {
        throw new Error(`Make sure you are using a DoH server with json support. response: ${txt}`);
    }
}

/**
 * [warn]: do nothing if server is not provided or blank string
 * doh server should support application/dns-message and returns application/dns-json
 * use cloudflare by default
 */
export async function dohResolve(domain: string, server: string = "https://1.1.1.1/dns-query") {
    if (!server) return domain;
    const resp = await doh(server, domain);
    if (resp.Status !== 0) throw new Error(`Error code ${resp.Status} from DoH server`);
    return resp.Answer.filter((a: any) => a.type === 1).map((a: any) => a.data) as string[];
}
