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
const path_1 = __importDefault(require("path"));
const fs = __importStar(require("fs"));
const input = (0, prompt_sync_1.default)();
function myBf() {
    return __awaiter(this, void 0, void 0, function* () {
        const mybd = new BeFake_1.default();
        yield mybd.loadToken();
        //console.log(await mybd.postPhoto());
        const img1Path = path_1.default.join("programData", "post", "img1.jpg");
        const img2Path = path_1.default.join("programData", "post", "img2.jpg");
        // Get bytes from imgs
        const img2Bytes = Buffer.from(fs.readFileSync(img2Path));
        const img1Bytes = Buffer.from(fs.readFileSync(img1Path));
        console.log(yield mybd.postUpload(img1Bytes, // img1
        img2Bytes, false, true, "friends", 0, "hola", undefined, [48.864716, 2.349014]));
    });
}
myBf();
/// IGNORE THIS
/**
 *
 *      await mybd.sendOtpVonage(number);
    const otp = input("Enter OTP: ");
    await mybd.verifyOtpVonage(otp);
 *
 *
 *
      
      //* number random with spain code
        
 await mybd.sendOtpVonage(number);
    const otp = input("Enter OTP: ");
    await mybd.verifyOtpVonage(otp);
await mybd.commentPost("LR5yBa893QfW_VvFV7KHc", "hola");

     await mybd.getFriendsFeed(2);
 *
 */
