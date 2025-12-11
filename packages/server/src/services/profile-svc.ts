import { Schema, model } from "mongoose";
import { Profile } from "../models/profile";

const profileSchema = new Schema<Profile>(
    {
        userid: {
        type: String,
        required: true,
        trim: true
        },
        pseudonym: {
        type: String,
        },
        email: {
        type: String,
        required: true,
        }
    },
    { collection: "user_profiles" }
    /* defines what the collection name is */
);

const ProfileModel = model<Profile>(
    "Profile",
    profileSchema
);

function get(userid: String): Promise<Profile> {
    return ProfileModel.find({ userid })
        .then((list) => list[0])
        .catch((err) => {
        throw `${userid} Not Found`;
    });
}

function create(json: Profile): Promise<Profile> {
    const t = new ProfileModel(json);
    return t.save();
}

function update(
    userid: String,
    profile: Profile
): Promise<Profile> {
    return ProfileModel.findOneAndUpdate({ userid }, profile, {
        new: true
    }).then((updated) => {
        if (!updated) throw `${userid} not updated`;
        else return updated as Profile;
    });
}

function remove(userid: String): Promise<void> {
    return ProfileModel.findOneAndDelete({ userid }).then(
        (deleted) => {
        if (!deleted) throw `${userid} not deleted`;
        }
    );
}


export default { create, update, get, remove };
/* only need these two. More than that is a security hazard */