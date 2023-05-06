"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Post = void 0;
const moment_1 = __importDefault(require("moment"));
const PostUpload_1 = require("./PostUpload");
const axios_1 = __importDefault(require("axios"));
class Post {
    // Constructor (BeFake object instance)
    constructor(beFake) {
        this.beFake = beFake;
    }
    // create post function
    createPost(primary, secondary, late, visibility = "friends", resize = true, retakes = 0, caption, // caption is optional
    taken_at, location) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!taken_at) {
                taken_at = (0, moment_1.default)().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
            }
            else {
                taken_at = (0, moment_1.default)(taken_at).format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
            }
            const postUpload = new PostUpload_1.PostUpload(primary, secondary, late, resize, visibility, retakes, caption);
            yield postUpload.upload(this.beFake);
            let json_data = {
                isLate: late,
                retakeCounter: retakes,
                takenAt: taken_at,
                caption: caption,
                visibility: [visibility],
                backCamera: {
                    bucket: "storage.bere.al",
                    height: postUpload.primary_size[1],
                    width: postUpload.primary_size[0],
                    path: postUpload.primaryPath,
                },
                frontCamera: {
                    bucket: "storage.bere.al",
                    height: postUpload.secondary_size[1],
                    width: postUpload.secondary_size[0],
                    path: postUpload.secondaryPath,
                },
            };
            if (location) {
                json_data["location"] = {
                    latitude: location[0],
                    longitude: location[1],
                };
            }
            const response = yield axios_1.default.post("https://mobile.bereal.com/api/content/posts", json_data, {
                headers: {
                    Authorization: `Bearer ${this.beFake.token}`,
                },
            });
            return response;
        });
    }
}
exports.Post = Post;
