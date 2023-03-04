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
    if (!res.ok) throw new Error(`fetch is not OK. make sure you are using a DoH server with json support`);
    const txt = await res.text();
    try {
        return JSON.parse(txt);
    } catch {
        throw new Error(`make sure you are using a DoH server with json support. response: ${txt}`);
    }
}

export async function dohResolve(domain: string, server = "https://1.0.0.1/dns-query") {
    const resp = await doh(server, domain);
    if (resp.Status !== 0) throw new Error(`Error code ${resp.Status} from DoH server`);
    return resp.Answer.filter((a: any) => a.type === 1).map((a: any) => a.data) as string[];
}
