/* called "stories" because it is a collection of apis for stories */

import express, { Request, Response } from "express";
import { Story } from "../models/story";

import Stories from "../services/story-svc";

const router = express.Router();


/* GET APIS */


router.get("/categories/:category/:userid", (req: Request, res: Response) => {
    const category = req.params.category;
    const userid = req.params.userid;
    
    Stories.getUser(category, userid)
        .then((list: Story[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});
/* finding the specific category data */


/* POST APIS */
router.post("/", (req: Request, res: Response) => {
    const newStory = req.body;

    Stories.create(newStory)
        .then((story: Story) =>
        res.status(201).json(story)
        )
        .catch((err) => res.status(500).send(err));
});


/* PUT APIS */
router.put("/:storyid", (req: Request, res: Response) => {
    const { storyid } = req.params;
    const newStory = req.body;

    Stories.update(storyid, newStory)
        .then((traveler: Story) => res.json(traveler))
        .catch((err) => res.status(404).end());
});


/* DELETE APIS */
router.delete("/:storyid", (req: Request, res: Response) => {
    const { storyid } = req.params;

    Stories.remove(storyid)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});



export default router;