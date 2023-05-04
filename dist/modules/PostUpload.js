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
exports.PostUpload = void 0;
const sharp_1 = __importDefault(require("sharp"));
const axios_1 = __importDefault(require("axios"));
class PostUpload {
    constructor(primary, secondary, resize) {
        this.primary = primary;
        this.secondary = secondary;
        this.resize = resize;
        this.changePhotos();
    }
    // Change photos to webp and resize if resize is true
    changePhotos() {
        return __awaiter(this, void 0, void 0, function* () {
            // Render imgs
            this.primary = yield (0, sharp_1.default)(this.primary).toBuffer();
            this.secondary = yield (0, sharp_1.default)(this.secondary).toBuffer();
            // Getting MIME types
            const primaryMime = (yield (0, sharp_1.default)(this.primary).metadata()).format;
            const secondaryMime = (yield (0, sharp_1.default)(this.secondary).metadata()).format;
            // if mime != webp => convert srgb
            if (primaryMime != "webp") {
                this.primary = yield (0, sharp_1.default)(this.primary)
                    .toFormat("webp")
                    .toBuffer();
            }
            if (secondaryMime != "webp") {
                this.secondary = yield (0, sharp_1.default)(this.secondary)
                    .toFormat("webp")
                    .toBuffer();
            }
            // Resize imgs if resize is true
            if (this.resize) {
                const newsize = [1500, 2000];
                this.primary = yield (0, sharp_1.default)(this.primary)
                    .resize(newsize[0], newsize[1])
                    .toBuffer();
                this.secondary = yield (0, sharp_1.default)(this.secondary)
                    .resize(newsize[0], newsize[1])
                    .toBuffer();
            }
        });
    }
    upload(beFake) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield beFake._apiRequest("get", "content/posts/upload-url", {}, { mimeType: "image/webp" });
            let headers1 = response.data[0].headers;
            headers1["Authorization"] = "Bearer " + beFake.token;
            headers1["user-agent"] = beFake.headers["user-agent"];
            const url1 = response.data[0].url;
            let headers2 = response.data[1].headers;
            headers2["Authorization"] = "Bearer " + beFake.token;
            headers2["user-agent"] = beFake.headers["user-agent"];
            console.log(response.data[1].path);
            const url2 = response.data[1].url;
            const primary_res = yield axios_1.default.put(url1, this.primary, {
                headers: headers1,
            });
            const secondary_res = yield axios_1.default.put(url2, this.secondary, {
                headers: headers2,
            });
            console.log(primary_res, secondary_res);
        });
    }
}
exports.PostUpload = PostUpload;
