import BeFake from "./BeFake";
import Prompt from "prompt-sync";
import { number } from "./constant"; // Only when debugging (remove it when you use it)
import * as fs from "fs";
const input = Prompt();

async function myBf() {
    //* Create instance
    const mybd = new BeFake();

    //* Login with otp phone
    await mybd.sendOtpVonage(number);
    const otp = input("Enter OTP: ");
    await mybd.verifyOtpVonage(otp);

    //* Load token (if you have login before)
    await mybd.loadToken();

    //* Get your friends feed
    const param = 2;
    await mybd.getFriendsFeed(
        param // 0 = return data, 1 = save JSON file, 2 = download photos and JSON files for each friend
    );

    //* Comment a post
    await mybd.commentPost(
        "000000", // Post id (you can get it from getFriendsFeed function)
        "Hello world!" // Comment content
    );

    //* Upload a post
    const img1Path = "IMG1 POST PATH";
    const img2Path = "IMG2 POST PATH";
    // Get bytes from imgs
    const img2Bytes: Uint8Array = Buffer.from(fs.readFileSync(img2Path));
    const img1Bytes: Uint8Array = Buffer.from(fs.readFileSync(img1Path));
    await mybd.postUpload(
        img1Bytes, // img1 bytes
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
    await mybd.deletePost();

    //* Get your friends info
    const param2 = 2; //0= return data, 1= save JSON file
    await mybd.getFriends(param2);
}

myBf();
