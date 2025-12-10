import { Schema, model } from "mongoose";
import { Story } from "../models/story";

const StorySchema = new Schema<Story>(
  {
    storyid: { type: String, required: true, trim: true },
    userid: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    content: { type: String }
  }
);

const StoryModel = model<Story>(
    "Tale",
    StorySchema
);


function index(): Promise<Story[]> {
    return StoryModel.find();
}

function get(storyid: String): Promise<Story> {
    return StoryModel.find({ storyid })
        .then((list) => list[0])
        .catch((err) => {
        throw `${storyid} Not Found`;
    });
}

function getCategory(category: String): Promise<Story[]> {
    return StoryModel.find({ category })
        .catch((err) => {
        throw `${category} Not Found`;
    });
}
/* for getting the category specific stories */

function getUser(category: String, userid: String): Promise<Story[]> {
    return StoryModel.find({ category, userid })
        .catch((err) => {
        throw `${category} and ${userid} Not Found`;
    });
}
/* for getting the user specific stories organized */

function create(json: Story): Promise<Story> {
    const t = new StoryModel(json);
    return t.save();
}

function update(
    storyid: String,
    story: Story
): Promise<Story> {
    return StoryModel.findOneAndUpdate({ storyid }, story, {
        new: true
    }).then((updated) => {
        if (!updated) throw `${storyid} not updated`;
        else return updated as Story;
    });
}

function remove(storyid: String): Promise<void> {
    return StoryModel.findOneAndDelete({ storyid }).then(
        (deleted) => {
        if (!deleted) throw `${storyid} not deleted`;
        }
    );
}

/* make a getter function to get the specific story (anyone can access it).
    also limit the interaction between the model and outside world */

export default { get, getCategory, getUser, index, create, update, remove };