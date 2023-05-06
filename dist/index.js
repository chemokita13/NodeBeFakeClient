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
const BeFake_1 = __importDefault(require("./BeFake"));
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const constant_1 = require("./constant"); // Only when debugging (remove it when you use it)
const fs = __importStar(require("fs"));
const input = (0, prompt_sync_1.default)();
function myBf() {
    return __awaiter(this, void 0, void 0, function* () {
        //* Create instance
        const mybd = new BeFake_1.default();
        //* Login with otp phone
        yield mybd.sendOtpVonage(constant_1.number);
        const otp = input("Enter OTP: ");
        yield mybd.verifyOtpVonage(otp);
        //* Load token (if you have login before)
        yield mybd.loadToken();
        //* Get your friends feed
        const param = 2;
        yield mybd.getFriendsFeed(param // 0 = return data, 1 = save JSON file, 2 = download photos and JSON files for each friend
        );
        //* Comment a post
        yield mybd.commentPost("000000", // Post id (you can get it from getFriendsFeed function)
        "Hello world!" // Comment content
        );
        //* Upload a post
        const img1Path = "IMG1 POST PATH";
        const img2Path = "IMG2 POST PATH";
        // Get bytes from imgs
        const img2Bytes = Buffer.from(fs.readFileSync(img2Path));
        const img1Bytes = Buffer.from(fs.readFileSync(img1Path));
        yield mybd.postUpload(img1Bytes, // img1 bytes
        img2Bytes, // img2 bytes
        false, // if want resize imgs (optional)
        true, // if want late post (optional)
        "friends", // visibility (optional): 'friends', 'friends-of-friends', 'public'
        0, // retakes (optional)
        "That post its mine", // caption (optional)
        "YYYY-MM-DDTHH:mm:ss.SSS[Z]", // taken_at (optional)
        [48.864716, 2.349014] // location (optional)
        );
        //* Delete your post
        yield mybd.deletePost();
        //* Get your friends info
        const param2 = 2; //0= return data, 1= save JSON file
        yield mybd.getFriends(param2);
    });
}
myBf();
