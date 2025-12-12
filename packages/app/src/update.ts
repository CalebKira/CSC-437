import { Auth, ThenUpdate, Message } from "@calpoly/mustang";
import { Msg } from "./messages.ts";
import { Model } from "./model.ts";
import {
  Profile
} from "./serverStuff/profile.ts";

export default function update(
    message: Msg,
    model: Model,
    user: Auth.User
): Model | ThenUpdate<Model, Msg> {
    const [command, payload, callbacks ={}] = message;

    switch (command) {
        case "profile/request": {
            const { userid } = payload;
            if (model.profile?.userid === userid ){
                return model;
            };
            return [
                { ...model, profile: {userid} as Profile},
                requestProfile(payload, user)
                .then((profile) => ["profile/load", { userid, profile }])
            ];
        }
        case "profile/load": {
            const { profile } = payload;
            return { ...model, profile };
        }

        case "profile/save": {
            const { userid } = payload;

            return [model,
            saveProfile(payload, user, callbacks)
            .then((profile) =>
                ["profile/load", {userid, profile}])
            ];
        }
        // put the rest of your cases here
        default:
            const unhandled: never = command;
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

function saveProfile(
    msg: {
        userid: string;
        profile: Profile;
    },
    user: Auth.User,
    callbacks: Message.Reactions
    ): Promise<Profile> {
    
    return fetch(`/profile/${msg.userid}`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json",
        ...Auth.headers(user)
        },
        body: JSON.stringify(msg.profile)
    })
        .then((response: Response) => {
        if (response.status === 200) return response.json();
        throw new Error(
            `Failed to save profile for ${msg.userid}`
        );
        })
        .then((json: unknown) => {
        if (json) {
            if (callbacks.onSuccess) callbacks.onSuccess();
            return json as Profile;
        }
        throw new Error(
            `No JSON in API response`
        )
        })
        .catch((err) => {
        if (callbacks.onFailure) callbacks.onFailure(err);
        throw err;
        });
}