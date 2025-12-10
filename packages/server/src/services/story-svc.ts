import { Schema, model } from "mongoose";
import { Story } from "../models/story";

const StorySchema = new Schema<Story>(
  {
    storyid: { type: String, required: true, trim: true },
    userid: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    name: { type: String, required: true, trim: true },
    content: { type: String }
  }
);

const StoryModel = model<Story>(
    "Tale",
    StorySchema
);

function get(storyid: String): Promise<Story> {
    return StoryModel.find({ storyid })
        .then((list) => list[0])
        .catch((err) => {
        throw `${storyid} Not Found`;
    });
}
/* make a getter function to get the specific story (anyone can access it).
    also limit the interaction between the model and outside world */

export default { get };