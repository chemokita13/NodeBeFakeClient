import BeFake from "./BeFake";
import Prompt from "prompt-sync";
import { number } from "./constant"; // Only when debuggin
import path from "path";
import * as fs from "fs";
const input = Prompt();

async function myBf() {
    const mybd = new BeFake();
    await mybd.loadToken();
    await mybd.getFriendsFeed(2);
    //console.log(await mybd.postPhoto());
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

     


  const img1Path = path.join("programData", "post", "img1.jpg");
    const img2Path = path.join("programData", "post", "img2.jpg");

    // Get bytes from imgs
    const img2Bytes: Uint8Array = Buffer.from(fs.readFileSync(img2Path));
    const img1Bytes: Uint8Array = Buffer.from(fs.readFileSync(img1Path));

    console.log(
        await mybd.postUpload(
            img1Bytes, // img1
            img2Bytes,
            false,
            true,
            "friends",
            0,
            "hola",
            undefined,
            [48.864716, 2.349014]
        )
    );



 * 
 */
