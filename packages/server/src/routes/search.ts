/* called "stories" because it is a collection of apis for stories */

import express, { Request, Response } from "express";
import { Story } from "../models/story";

import Stories from "../services/story-svc";

const router = express.Router();


/* GET APIS */
router.get("/", (_, res: Response) => {
    Stories.index()
        .then((list: Story[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});


router.get("/categories/:category", (req: Request, res: Response) => {
    const { category } = req.params;
    
    Stories.getCategory(category)
        .then((list: Story[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});
/* finding the specific category data */

router.get("/:storyid", (req: Request, res: Response) => {
    const { storyid } = req.params;

    Stories.get(storyid)
        .then((story: Story) => res.json(story))
        .catch((err) => res.status(404).send(err));
});



export default router;