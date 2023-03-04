# https-bypass-sni-undici

This library ships a fetch function with no ssl check by using `undici`

# example

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
