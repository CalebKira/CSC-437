import { Auth, ThenUpdate } from "@calpoly/mustang";
import { Msg } from "./messages";
import { Model } from "./model";

export default function update(
  message: Msg,
  model: Model,
  user: Auth.User
) Model | ThenUpdate<Model, Msg> {
  switch (message[0]) {
    case "profile/request": {
      const { userid } = payload;
      if (model.profile?.userid === userid ) break;
      return [
        { ...model, profile: {userid} as Traveler},
        requestProfile(payload, user)
          .then((profile) => ["profile/load", { userid, profile }])
      ];
    }
    case "profile/load": {
      const { profile } = payload;
      return { ...model, profile };
    }
    // put the rest of your cases here
    default:
      throw new Error(`Unhandled Auth message "${unhandled}"`);
  }
}