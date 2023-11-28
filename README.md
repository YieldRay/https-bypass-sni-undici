# https-bypass-sni-undici

This library ships a `fetch` function by using `undici`

# Example

default DoH server is <https://1.1.1.1/dns-query>

```js
import fetchX from "https-bypass-sni-undici";
const res = await fetchX("https://i.pximg.net");
const html = await res.text();
console.log(html);
// echo:
// <html>
// <body>
// imgaz.pixiv.net
// </body>
// </html>
```

# Advanced

```js
// customize DoH server or skip DoH resolve by providing an IP
import fetchX from "https-bypass-sni-undici";
const res = await fetchX("https://i.pximg.net", {
    ip: "210.140.139.133",
    dohServer: "https://1.1.1.1/dns-query",
});
```

```js
// replace default DoH server
import { createFetch } from "https-bypass-sni-undici";
const fetchX = createFetch("https://1.1.1.1/dns-query");
```
