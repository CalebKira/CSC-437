// src/index.ts
import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import Story from "./services/story-svc";
import stories from "./routes/stories";
import auth, { authenticateUser } from "./routes/auth";
import search from "./routes/search"


connect("worlds"); // use your own db name here

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));

app.use(express.json());
/* middle ware to not parse json on both sides */

app.use("/api/stories", authenticateUser, stories);
app.use("/auth", auth);
app.use("/search", search);
/* defining api routes grouped together */


app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
    /* a new route to test connection */
});

app.get("/story/:storyid", (req: Request, res: Response) => {
    const { storyid } = req.params;

    Story.get(storyid).then((data) => {
        if (data) res
            .set("Content-Type", "application/json")
            .send(JSON.stringify(data));
        else res
            .status(404).send();
    });
    /* finding a specific story because it accesses the schema 
        connected to the collection tales */
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});