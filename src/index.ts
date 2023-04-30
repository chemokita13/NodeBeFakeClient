import BeFake from "./BeFake";
import Prompt from "prompt-sync";
import { number } from "./constant"; // Only when debuggin
const input = Prompt();

async function myBf() {
    const mybd = new BeFake();

    await mybd.loadToken();
    console.log(await mybd.getFriendSuggestions(1));
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
