function getOwnerFromPath(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  return parts[0] || "";
}
export default {
  async fetch(request, env, ctx) {
    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method Not Allowed", {
        status: 405,
        headers: {
          Allow: "GET, HEAD",
        },
      });
    }
    const url = new URL(request.url);
    const owner = getOwnerFromPath(url.pathname);
    if (owner !== "zhmgczh") {
      return new Response("Forbidden: owner not allowed", { status: 403 });
    }
    const targetUrl =
      "https://raw.githubusercontent.com" + url.pathname + url.search;
    const newHeaders = new Headers(request.headers);
    newHeaders.set("Host", "raw.githubusercontent.com");
    newHeaders.delete("Referer");
    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: newHeaders,
      redirect: "follow",
      cf: {
        cacheEverything: true,
        cacheTtl: 86400,
      },
    });
    try {
      const response = await fetch(modifiedRequest);
      const newResponse = new Response(response.body, response);
      const origin = request.headers.get("Origin");
      const allowedOrigin =
        origin === "https://www.zh-tw.top" ||
        origin === "https://static.zh-tw.top"
          ? origin
          : "null";
      newResponse.headers.set("Access-Control-Allow-Origin", allowedOrigin);
      newResponse.headers.set("Vary", "Origin");
      newResponse.headers.set(
        "Cache-Control",
        "public, max-age=86400, stale-while-revalidate=604800, stale-if-error=604800",
      );
      return newResponse;
    } catch (e) {
      return new Response("Proxy Error: " + e.message, { status: 500 });
    }
  },
};
