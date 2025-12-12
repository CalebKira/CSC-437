import { Profile } from "./serverStuff/profile";

export type Msg =
    | [
      "profile/save",
      {
        userid: string,
        profile: Profile
      }, {
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
      }
    ]
    | [ "profile/save", { userid: string; profile: Profile }]
    | [ "profile/request", { userid: string }]
    // | [ "story/request", { storyid: string }]
    | Cmd;

type Cmd =
    | ["profile/load", { userid: string, profile: Profile }]

/* messages sent to update to change the model */