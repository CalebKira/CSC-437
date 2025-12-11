/* called "stories" because it is a collection of apis for stories */

import express, { Request, Response } from "express";
import { Profile } from "../models/profile";

import Profiles from "../services/profile-svc";

const router = express.Router();


/* GET APIS */


router.get("/:userid", (req: Request, res: Response) => {
    const { userid } = req.params;

    Profiles.get(userid)
        .then((profile: Profile) => res.json(profile))
        .catch((err) => res.status(404).send(err));
});
/* finding the specific profile data */


/* POST APIS */
router.post("/", (req: Request, res: Response) => {
    const newProfile = req.body;

    Profiles.create(newProfile)
        .then((profile: Profile) =>
        res.status(201).json(profile)
        )
        .catch((err) => res.status(500).send(err));
});


/* PUT APIS */
router.put("/:userid", (req: Request, res: Response) => {
    const { userid } = req.params;
    const newUser = req.body;

    Profiles.update(userid, newUser)
        .then((profile: Profile) => res.json(profile))
        .catch((err) => res.status(404).end());
});


/* DELETE APIS */
router.delete("/:userid", (req: Request, res: Response) => {
    const { userid } = req.params;

    Profiles.remove(userid)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});



export default router;