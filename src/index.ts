import BeFake from "./BeFake";
import Prompt from "prompt-sync";
const input = Prompt();

async function myBf() {
    const mybd = new BeFake();
    await mybd.sendOtpVonage("+34641564704");
    const otp = input("Enter OTP: ");
    await mybd.verifyOtpVonage(otp);
    await mybd.getFriendsFeed();
}

myBf();
