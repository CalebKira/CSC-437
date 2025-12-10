"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var story_svc_exports = {};
__export(story_svc_exports, {
  default: () => story_svc_default
});
module.exports = __toCommonJS(story_svc_exports);
var import_mongoose = require("mongoose");
const StorySchema = new import_mongoose.Schema(
  {
    storyid: { type: String, required: true, trim: true },
    userid: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    content: { type: String }
  }
);
const StoryModel = (0, import_mongoose.model)(
  "Tale",
  StorySchema
);
function index() {
  return StoryModel.find();
}
function get(storyid) {
  return StoryModel.find({ storyid }).then((list) => list[0]).catch((err) => {
    throw `${storyid} Not Found`;
  });
}
function create(json) {
  const t = new StoryModel(json);
  return t.save();
}
function update(storyid, story) {
  return StoryModel.findOneAndUpdate({ storyid }, story, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${storyid} not updated`;
    else return updated;
  });
}
function remove(storyid) {
  return StoryModel.findOneAndDelete({ storyid }).then(
    (deleted) => {
      if (!deleted) throw `${storyid} not deleted`;
    }
  );
}
var story_svc_default = { get, index, create, update, remove };
