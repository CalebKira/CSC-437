import { Auth, ThenUpdate } from "@calpoly/mustang";
import { Msg } from "./messages.ts";
import { Model } from "./model.ts";
import {
  Profile
} from "server/models";

export default function update(
    message: Msg,
    model: Model,
    user: Auth.User
): Model | ThenUpdate<Model, Msg> {
    const [ request, contents ] = message;
    switch (request) {
        case "profile/request": {
            const { userid } = contents;
            if (model.profile?.userid === userid ) break;
            return [
                { ...model, profile: {userid} as Profile},
                requestProfile(contents, user)
                .then((profile) => ["profile/load", { userid, profile }])
            ];
        }
        case "profile/load": {
            const { profile } = contents;
            return { ...model, profile };
        }
        // put the rest of your cases here
        default:
            const unhandled = message[0];
            throw new Error(`Unhandled Auth message "${unhandled}"`);
    }
}


function requestProfile(
    contents: { userid: string },
    user: Auth.User
    ) {

    console.log(contents.userid);

    return fetch(`/profile/${contents.userid}`, {
        headers: Auth.headers(user)
        /* AUTH WORKS ACROSS ALL THINGS SO IT'S TRACKED ACROSS EVERYTHING */
    })
    .then((response: Response) => {
        if (response.status === 200) {
            return response.json();
        }
        throw "No Response from server";
    })
    .then((json: unknown) => {
        if (json) return json as Profile
        throw "No JSON in response from server";
    });
}