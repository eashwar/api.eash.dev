import { Webhooks, createNodeMiddleware } from "npm:@octokit/webhooks";
import express, { NextFunction, Request, Response } from "npm:express@4.21.2";
import swaggerUi from "npm:swagger-ui-express@5.0.1";

const webhookSecret = Deno.env.get("EASH_API_WEBHOOK_SECRET") ?? ""

const webhooks = new Webhooks({
    secret: webhookSecret
})

webhooks.on("push", async ({ id, name, payload }) => {
    console.info(`push event recieved: ${name}. payload: ${JSON.stringify(payload)}`);
    if (payload.repository.full_name === "eashwar/eash.dev")
    {
        const currentUtime = Date.now();
        const deployFileToCreate = "/data/site-deploy/" + currentUtime + ".txt";
        console.info(`deploying ${deployFileToCreate}`);
        await Deno.writeTextFile(deployFileToCreate, "deploy time!");
    }
});

const webhookMiddleware = createNodeMiddleware(webhooks, { path: "/gh-webhook"});

const reqLoggingMiddleware = function (req : Request, _res: Response, next: NextFunction) {
    console.info(`${req.method} request to "${req.url}" by ${req.hostname}`);
    next();
};

const app = express();
const port = 30081;

app.use(reqLoggingMiddleware);
app.use(webhookMiddleware);

const swaggerFile = JSON.parse(await Deno.readTextFile('./swagger.json'));
const swaggerOpts = {};
app.use('/docs', (req: Request, _res: Response, next: NextFunction) => {
    swaggerFile.host = req.get('host');
    req.swaggerDoc = swaggerFile;
    next();
}, swaggerUi.serveFiles(swaggerFile, swaggerOpts), swaggerUi.setup());

app.get("/", (_req : Request, res : Response) => {
    res.status(200).send("hello world from deno! welcome to eash-api.");
});

app.get("/health", (_req : Request, res : Response) => {
    res.status(200).send("Healthy");
});

app.get("/ping", (_req : Request, res : Response) => {
    const potentialResponses : string[] = ["hello there!", "hiya!", "pong", "meowdy!", "hey there :3"];
    var responseString = potentialResponses[Math.floor(Math.random() * potentialResponses.length)];
    res.status(200).send(responseString);
});

app.listen(port, () => {
    console.log(`Listening on ${port}`);
});