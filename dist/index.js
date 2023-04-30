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
const BeFake_1 = __importDefault(require("./BeFake"));
const prompt_sync_1 = __importDefault(require("prompt-sync"));
const input = (0, prompt_sync_1.default)();
function myBf() {
    return __awaiter(this, void 0, void 0, function* () {
        const mybd = new BeFake_1.default();
        yield mybd.loadToken();
        console.log(yield mybd.getFriendSuggestions(1));
    });
}
myBf();
/// IGNORE THIS
/**
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
