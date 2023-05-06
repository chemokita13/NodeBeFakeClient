"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const axios_1 = __importDefault(require("axios"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const sharp_1 = __importDefault(require("sharp")); // to download and resize images
const moment_1 = __importDefault(require("moment"));
const Post_1 = require("./modules/Post");
class BeFake {
    constructor(refresh_token = null, proxies = null, disable_ssl = false, deviceId = null
    ///api_url?,
    ///google_api_key?
    ) {
        (this.disable_ssl = false),
            (this.deviceId = deviceId || this._generateRandomDeviceId()),
            (this.api_url = "https://mobile.bereal.com/api"),
            (this.google_api_key = "AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA"),
            (this.headers = {
                "user-agent": "BeReal/1.0.1 (AlexisBarreyat.BeReal; build:9513; iOS 16.0.2) 1.0.0/BRApriKit",
                "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
            });
        this.dataPath = "programData";
    }
    // Generate a random device id, (random string with 16chars)
    _generateRandomDeviceId() {
        const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 16; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }
    // Only a getter for debug
    _getSelf() {
        return this.otpSession;
    }
    // Send a mobile verification (vonage) code to a phone number via SMS
    sendOtpVonage(phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = {
                phoneNumber: phoneNumber,
                deviceId: this._generateRandomDeviceId(),
            };
            const response = yield axios_1.default.post("https://auth.bereal.team/api/vonage/request-code", data, {
                headers: {
                    "user-agent": "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0",
                },
            });
            if (response.status == 200) {
                this.otpSession = response.data.vonageRequestId;
                return {
                    done: true,
                    msg: "OTP sent successfully",
                };
            }
            else {
                return {
                    done: false,
                    msg: "Something went wrong",
                    data: response,
                };
            }
        });
    }
    saveToken() {
        return __awaiter(this, void 0, void 0, function* () {
            // create an object with the tokens and the userId
            const objToSave = {
                access: {
                    refresh_token: this.refresh_token,
                    token: this.token,
                    expires: this.expiration.format(),
                },
                firebase: {
                    refresh_token: this.firebase_refresh_token,
                    token: this.firebaseToken,
                    expires: this.firebaseExpiration.format(),
                },
                userId: this.userId,
            };
            try {
                // Check if the folder exists
                if (!fs.existsSync(this.dataPath)) {
                    // If doesn't exist, create it
                    fs.mkdirSync(this.dataPath);
                }
                // save the object to a JSON file
                yield fs.writeFileSync(path.join(this.dataPath, "USER_INFO.json"), JSON.stringify(objToSave, null, 4));
                return {
                    done: true,
                    msg: "Tokens saved successfully",
                };
            }
            catch (error) {
                return {
                    done: false,
                    msg: "Something went wrong",
                    data: error,
                };
            }
        });
    }
    refreshToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield axios_1.default.post("https://auth.bereal.team/token", {
                    grant_type: "refresh_token",
                    client_id: "ios",
                    client_secret: "962D357B-B134-4AB6-8F53-BEA2B7255420",
                    refresh_token: this.refresh_token,
                }, {
                    params: { grant_type: "refresh_token" },
                });
                this.token = response.data.access_token;
                this.expiration = (0, moment_1.default)().add(response.data.expires_in, "seconds");
                this.refreshToken = response.data.refresh_token;
            }
            catch (error) {
                console.log(error);
            }
        });
    }
    // load the tokens from a JSON file
    loadToken() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // read the file
                const data = yield fs.readFileSync("./programData/USER_INFO.json", "utf8");
                // parse the JSON
                const obj = JSON.parse(data);
                // set the tokens
                this.refresh_token = obj.access.refresh_token;
                this.token = obj.access.token;
                this.expiration = (0, moment_1.default)(obj.access.expires);
                this.firebase_refresh_token = obj.firebase.refresh_token;
                this.firebaseToken = obj.firebase.token;
                this.firebaseExpiration = (0, moment_1.default)(obj.firebase.expires);
                this.userId = obj.userId;
                console.log("Loaded token successfully");
                yield this.refreshToken(),
                    yield this.firebaseRefreshTokens(),
                    yield this.saveToken();
                return {
                    done: true,
                    msg: "Tokens loaded successfully",
                };
            }
            catch (error) {
                return {
                    done: false,
                    msg: "Something went wrong",
                    data: error,
                };
            }
        });
    }
    // Verify a mobile verification (vonage) code sent to a phone number via SMS
    verifyOtpVonage(otpCode) {
        return __awaiter(this, void 0, void 0, function* () {
            // If there is no otpSession, exit
            if (!this.otpSession) {
                return {
                    done: false,
                    msg: "No otpSession",
                };
            }
            const otpVerRes = yield axios_1.default.post("https://auth.bereal.team/api/vonage/check-code", {
                vonageRequestId: this.otpSession,
                code: otpCode,
            });
            // TODO: check if the response is 200 or 201
            if (otpVerRes.data.status != 0) {
                return {
                    done: false,
                    msg: "OTP verification failed",
                    data: otpVerRes.data,
                };
            }
            try {
                const tokenRes = yield axios_1.default.post("https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken", {
                    token: otpVerRes.data.token,
                    returnSecureToken: true,
                }, {
                    params: {
                        key: this.google_api_key,
                    },
                });
                // set the token
                this.firebase_refresh_token = tokenRes.data.refreshToken;
                // refresh the token
                yield this.firebaseRefreshTokens();
                // grant the access token
                yield this.grantAccessToken();
                // save user info (tokens, userId...)
                yield this.saveToken();
                return {
                    done: true,
                    msg: "OTP verified successfully",
                };
            }
            catch (error) {
                return {
                    done: false,
                    msg: "Something went wrong",
                    data: error,
                };
            }
        });
    }
    // upload the token for avoid expiration
    firebaseRefreshTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            // If there is no firebase_refresh_token, exit
            if (!this.firebase_refresh_token) {
                return "No firebase_refresh_token, please login first";
            }
            try {
                const response = yield axios_1.default.post("https://securetoken.googleapis.com/v1/token", {
                    grantType: "refresh_token",
                    refreshToken: this.firebase_refresh_token,
                }, {
                    headers: this.headers,
                    withCredentials: true,
                    params: { key: this.google_api_key },
                });
                // Exception handling
                if (response.status !== 200) {
                    console.log("Token refresh failed(l164), error: ", response.data);
                    return;
                }
                //!console.log(response.data.refresh_token);
                this.firebase_refresh_token = response.data.refresh_token;
                this.firebaseToken = response.data.id_token;
                this.firebaseExpiration = (0, moment_1.default)().add(parseInt(response.data.expires_in), "seconds");
                this.userId = response.data.user_id;
            }
            catch (error) {
                return {
                    done: false,
                    msg: "Something went wrong",
                    data: error,
                };
            }
        });
    }
    // grant the access token
    grantAccessToken() {
        return __awaiter(this, void 0, void 0, function* () {
            // If there is no firebaseToken, exit
            if (!this.firebaseToken) {
                return;
            }
            const response = yield axios_1.default.post("https://auth.bereal.team/token", {
                grant_type: "firebase",
                client_id: "ios",
                client_secret: "962D357B-B134-4AB6-8F53-BEA2B7255420",
                token: this.firebaseToken,
            }, {
                headers: this.headers,
                withCredentials: true,
                params: { grant_type: "firebase" },
            });
            // Exception handling
            if (response.status !== 201) {
                return;
            }
            this.refresh_token = response.data.refresh_token;
            this.expiration = (0, moment_1.default)().add(parseInt(response.data.expires_in), "seconds");
            this.token = yield response.data.access_token;
            return;
        });
    }
    // make all BeReal's API requests
    _apiRequest(method, endpoint, data, params) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield (0, axios_1.default)({
                method: method,
                url: this.api_url + "/" + endpoint,
                headers: {
                    Authorization: "Bearer " + this.token,
                },
                data: data,
                params: params,
            });
            return response.data;
        });
    }
    // TODO: optimize this function (i think is done without the best way)
    getFriendsFeed(option) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * option:
             * 0: return data
             * 1: save JSON file with data
             * 2: create path and user folders with data and download images
             */
            const response = yield this._apiRequest("GET", "feeds/friends");
            if (option < 0 || option > 3) {
                return {
                    done: false,
                    msg: "Invalid option",
                };
            }
            try {
                if (option == 0) {
                    return {
                        done: true,
                        msg: "Data returned successfully",
                        data: response,
                    };
                }
                if (option == 1) {
                    yield fs.writeFile(path.join("programData", "friendsFeed.json"), JSON.stringify(response, null, 4), () => {
                        console.log("File created successfully");
                    });
                    return {
                        done: true,
                        msg: "File created successfully",
                    };
                }
                if (option == 2) {
                    const feedPath = path.join(this.dataPath, "friendsFeed");
                    // Check if the folder exists
                    if (!fs.existsSync(feedPath)) {
                        // If doesn't exist, create it
                        fs.mkdirSync(feedPath);
                    }
                    else {
                        // If exists, delete it and create it again
                        fs.rmSync(feedPath, { recursive: true });
                        fs.mkdirSync(feedPath);
                    }
                    for (let i = 0; i < response.length; i++) {
                        const friendPath = path.join(feedPath, response[i].userName);
                        // Check if the folder exists
                        if (!fs.existsSync(friendPath)) {
                            // If doesn't exist, create it
                            yield fs.mkdirSync(friendPath);
                        }
                        else {
                            // If exists, delete it and create it again
                            fs.rmSync(friendPath, { recursive: true });
                            fs.mkdirSync(friendPath);
                        }
                        // create photos folder
                        const imagesPath = path.join(friendPath, "images");
                        if (!fs.existsSync(imagesPath)) {
                            // If doesn't exist, create it
                            fs.mkdirSync(imagesPath);
                        }
                        // Save user.json info
                        yield fs.writeFile(path.join(friendPath, "user.json"), JSON.stringify(response[i], null, 4), () => {
                            console.log("user.json created successfully", response[i].userName);
                        });
                        //* Save images
                        // Primary image
                        const primaryImage = yield axios_1.default.get(response[i].photoURL, {
                            responseType: "arraybuffer",
                        });
                        console.log(primaryImage.data);
                        yield (0, sharp_1.default)(primaryImage.data)
                            .toFormat("jpg")
                            .toFile(path.join(imagesPath, "primary.jpg"));
                        // Secondary image
                        const secondaryImage = yield axios_1.default.get(response[i].secondaryPhotoURL, {
                            responseType: "arraybuffer",
                        });
                        yield (0, sharp_1.default)(secondaryImage.data)
                            .toFormat("jpg")
                            .toFile(path.join(imagesPath, "secondary.jpg"));
                        // Profile img
                        /// if doesn't exist, continue
                        if (!response[i].user.profilePicture)
                            continue;
                        const profileImage = yield axios_1.default.get(response[i].user.profilePicture.url, {
                            responseType: "arraybuffer",
                        });
                        yield (0, sharp_1.default)(profileImage.data)
                            .toFormat("jpg")
                            .toFile(path.join(imagesPath, "profile.jpg"));
                    }
                }
                return {
                    done: true,
                    msg: "Data saved successfully",
                };
            }
            catch (error) {
                return {
                    done: false,
                    msg: "Error saving data",
                    data: error,
                };
            }
        });
    }
    // Get friends info
    getFriends(option) {
        return __awaiter(this, void 0, void 0, function* () {
            /**
             * option:
             * 0: return data
             * 1: save JSON file with data
             * */
            if (option < 0 || option > 1) {
                return {
                    done: false,
                    msg: "Invalid option",
                };
            }
            const response = yield this._apiRequest("GET", "relationships/friends");
            if (option == 0) {
                return {
                    done: true,
                    msg: "Data returned successfully",
                    data: response,
                };
            }
            else {
                // check if programData folder exists
                if (!fs.existsSync("programData")) {
                    // If doesn't exist, create it
                    fs.mkdirSync("programData");
                }
                yield fs.writeFile(path.join("programData", "friends.json"), JSON.stringify(response, null, 4), () => {
                    console.log("File created successfully");
                });
                return {
                    done: true,
                    msg: "File created successfully",
                };
            }
        });
    }
    // Comment a post
    commentPost(postId, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            // Prepare the data to send in the request
            const payload = {
                postId: postId,
            };
            const data = {
                content: comment,
            };
            const response = yield this._apiRequest("POST", "content/comments", data, payload);
            return {
                done: true,
                msg: "Comment posted successfully",
                data: response,
            };
        });
    }
    // Get friend suggestions
    getFriendSuggestions(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._apiRequest("GET", "relationships/suggestions", {}, // data empty
            page ? { page: page } : {} // if page is defined, send it
            );
            return {
                done: true,
                msg: "Friend suggestions returned successfully",
                data: response,
            };
        });
    }
    // Post a photo
    postUpload(primary, secondary, resize = true, late = true, visibility = "friends", retakes = 0, caption = "", takenAt, location) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const primaryImg = yield (0, sharp_1.default)(primary).toBuffer();
                const secondaryImg = yield (0, sharp_1.default)(secondary).toBuffer();
                const post = new Post_1.Post(this);
                const postUploaded = yield post.createPost(primaryImg, secondaryImg, late, visibility, resize, retakes, caption, takenAt !== null && takenAt !== void 0 ? takenAt : undefined, // if takenAt is defined, send it but if not, send undefined (dont sent anything)
                location !== null && location !== void 0 ? location : undefined // same as above
                );
                return {
                    done: true,
                    msg: "Post uploaded successfully",
                    data: postUploaded,
                };
            }
            catch (error) {
                return {
                    done: false,
                    msg: "Error uploading post",
                    data: error,
                };
            }
        });
    }
    // Delete your post
    deletePost() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this._apiRequest("DELETE", "content/posts");
            return {
                done: true,
                msg: "Post deleted successfully",
                data: response,
            };
        });
    }
}
exports.default = BeFake;
