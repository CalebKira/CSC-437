import { Story } from "server/models";

export interface Model {
    story?: Story;
}

export const init: Model = {};