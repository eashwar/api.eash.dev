const port = 30081;

function getResponseString(path: string): string | undefined {
    switch(path) {
        case "/":
            return "hello world from deno! welcome to eash-api.";
        case "/health":
            return "Healthy"
        case "/ping": {
            const potentialResponses : string[] = ["hello there!", "hiya!", "pong", "meowdy!", "hey there :3"];
            return potentialResponses[Math.floor(Math.random() * potentialResponses.length)];
        }
        default:
            return undefined;
    }
}

Deno.serve({
    port: port
}, async (req) => {
    const url : URL = new URL(req.url);

    const responseString = getResponseString(url.pathname);

    if (responseString === undefined)
    {
        return new Response("not found", {
            status: 404,
            headers: {
                "content-type": "text/plain; charset=utf8"
            }
        });
    }

    return new Response(responseString, {
        status: 200,
        headers: {
            "content-type": "text/plain; charset=utf-8"
        }
    });
});