import express, { Response } from "express";
import fetch from "node-fetch";
import { config } from "dotenv";
import cors from "cors";
import { urlencoded, json } from "body-parser";

import mockAPIResponse from "./mockAPI";
import FormType from "./formEnum";

const app = express();

// Middleware
// Here we are configuring express to use body-parser as middle-ware.
app.use(urlencoded({ extended: false }));
app.use(json());

// Cors for cross origin allowance
app.use(cors());

app.use(express.static("dist-client"));

console.log(__dirname);

config();
const { API_KEY } = process.env;

// designates what port the app will listen to for incoming requests
app.listen(8081, () => {
    console.log("Example app listening on port 8081!");
});

app.get("/test", (_req, res) => {
    console.log(FormType.INV);
    res.send(mockAPIResponse);
});

const clients: Response[] = [];

app.get("/api/messages", async (_req, res) => {
    console.log("Goat /events!");
    res.set({
        "Cache-Control": "no-cache",
        "Content-Type": "text/event-stream",
        Connection: "keep-alive",
    });
    res.flushHeaders();

    res.write("retry: 10000\n\n");
    clients.push(res);
});

interface MessageData {
    score: string,
    agreement: string,
    subjectivity: string
    irony: string,
    confidence: string,
}

function sendDataToAll(js_data: MessageData) {
    clients.forEach((res) => {
        res.write(`data: ${JSON.stringify(js_data)}\n\n`);
    });
}

interface UrlData {
    formType: FormType,
    input: string
}

function getApiUrl(data: UrlData) {
    return `https://api.meaningcloud.com/sentiment-2.1?key=${API_KEY}`
        + `&lang=en&${data.formType === FormType.URL ? "url" : "txt"}=${data.input}`;
}

app.post("/api/sendMessage", async (req, res) => {
    try {
        console.log(`Input: ${req.body.input}`);
        console.log("Sending submission to MeaningCloud API...");
        const mcResp = await fetch(getApiUrl(req.body), {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({}),
        });
        console.log("Response received!!");
        const mcJson = await mcResp.json();
        sendDataToAll({
            score: mcJson.score_tag,
            agreement: mcJson.agreement,
            subjectivity: mcJson.subjectivity,
            irony: mcJson.irony,
            confidence: `${mcJson.confidence}%`,
        });
        res.send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});
