import { Profile } from "server/models";

export interface Model {
    profile?: Profile;
}
/* store the save here I believe */

export const init: Model = {};