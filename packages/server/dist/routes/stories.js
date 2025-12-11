"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var stories_exports = {};
__export(stories_exports, {
  default: () => stories_default
});
module.exports = __toCommonJS(stories_exports);
var import_express = __toESM(require("express"));
var import_story_svc = __toESM(require("../services/story-svc"));
const router = import_express.default.Router();
router.get("/categories/:category/:userid", (req, res) => {
  const category = req.params.category;
  const userid = req.params.userid;
  import_story_svc.default.getUser(category, userid).then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.post("/", (req, res) => {
  const newStory = req.body;
  import_story_svc.default.create(newStory).then(
    (story) => res.status(201).json(story)
  ).catch((err) => res.status(500).send(err));
});
router.put("/:storyid", (req, res) => {
  const { storyid } = req.params;
  const newStory = req.body;
  import_story_svc.default.update(storyid, newStory).then((traveler) => res.json(traveler)).catch((err) => res.status(404).end());
});
router.delete("/:storyid", (req, res) => {
  const { storyid } = req.params;
  import_story_svc.default.remove(storyid).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var stories_default = router;
