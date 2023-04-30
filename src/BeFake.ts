import axios from "axios";

import moment from "moment";

//TODO: save token to avoid login each time
export default class BeFake {
    // TODO: add the coresponding types
    //* Types
    google_api_key: string;
    api_url: string;
    disable_ssl: boolean;
    tokenInfo: any;
    expiration: any; // moment
    firebaseExpiration: any; // moment
    userId: any;
    token: any;
    //proxies: null;
    deviceId: string;
    refresh_token: any;
    otpSession: any; // OTP code session
    firebase_refresh_token: any; // Firebase refresh token
    headers: any; // axios headers
    firebaseToken: any; // Firebase token

    constructor(
        refresh_token = null,
        proxies = null,
        disable_ssl = false,
        deviceId = null
        ///api_url?,
        ///google_api_key?
    ) {
        (this.disable_ssl = false),
            (this.deviceId = deviceId || this.generateRandomDeviceId()),
            (this.api_url = "https://mobile.bereal.com/api"),
            (this.google_api_key = "AIzaSyDwjfEeparokD7sXPVQli9NsTuhT6fJ6iA"),
            (this.headers = {
                "user-agent":
                    "BeReal/1.0.1 (AlexisBarreyat.BeReal; build:9513; iOS 16.0.2) 1.0.0/BRApriKit",
                "x-ios-bundle-identifier": "AlexisBarreyat.BeReal",
            });
    }

    // Generate a random device id, (random string with 16chars)
    generateRandomDeviceId(): string {
        const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < 16; i++) {
            result += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        return result;
    }

    // Only a getter for debug
    getSelf(): any {
        return this.otpSession;
    }

    // Send a mobile verification (vonage) code to a phone number via SMS
    async sendOtpVonage(phoneNumber: string): Promise<void> {
        const data = {
            phoneNumber: phoneNumber,
            deviceId: this.generateRandomDeviceId(),
        };
        const response = await axios.post(
            "https://auth.bereal.team/api/vonage/request-code",
            data,
            {
                headers: {
                    "user-agent":
                        "BeReal/8586 CFNetwork/1240.0.4 Darwin/20.6.0",
                },
            }
        );
        console.log(response.status);
        if (response.status == 200) {
            console.log(
                "OTP sent to " + phoneNumber + " successfully, requestId: ",
                response.data.vonageRequestId
            );
            this.otpSession = response.data.vonageRequestId;
            //?console.log(this.getSelf());
        } else {
            console.log("OTP not sent, error: ", response.data);
        }
    }

    // Verify a mobile verification (vonage) code sent to a phone number via SMS
    async verifyOtpVonage(otpCode: string): Promise<void> {
        // If there is no otpSession, exit
        if (!this.otpSession) {
            return;
        }

        const otpVerRes = await axios.post(
            "https://auth.bereal.team/api/vonage/check-code",
            {
                vonageRequestId: this.otpSession,
                code: otpCode,
            }
        );

        // TODO: check if the response is 200 or 201
        if (otpVerRes.data.status != 0) {
            console.log("OTP verification failed, error: ", otpVerRes.data);
            return;
        }

        const tokenRes = await axios.post(
            "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken",
            {
                token: otpVerRes.data.token,
                returnSecureToken: true,
            },
            {
                params: {
                    key: this.google_api_key,
                },
            }
        );

        if (tokenRes.status !== 200) {
            console.log("Token verification failed, error: ", tokenRes);
            return;
        }

        console.log(
            "Token verified successfully, refreshToken: ",
            tokenRes.data.refreshToken
        );

        // set the token
        this.firebase_refresh_token = tokenRes.data.refreshToken;

        // refresh the token
        await this.firebaseRefreshTokens();
        // grant the access token
        await this.grantAccessToken();
    }

    // upload the token for avoid expiration
    async firebaseRefreshTokens(): Promise<void> {
        // If there is no firebase_refresh_token, exit
        if (!this.firebase_refresh_token) {
            return;
        }

        const response = await axios.post(
            "https://securetoken.googleapis.com/v1/token",
            {
                grantType: "refresh_token",
                refreshToken: this.firebase_refresh_token,
            },
            {
                headers: this.headers,
                withCredentials: true,
                params: { key: this.google_api_key },
            }
        );

        // Exception handling
        if (response.status !== 200) {
            console.log("Token refresh failed(l164), error: ", response.data);
            return;
        }

        this.firebase_refresh_token = response.data.refreshToken;
        this.firebaseToken = response.data.id_token;
        this.firebaseExpiration = moment().add(
            parseInt(response.data.expires_in),
            "seconds"
        );
        this.userId = response.data.user_id;
        return;
    }

    // grant the access token
    async grantAccessToken(): Promise<void> {
        // If there is no firebaseToken, exit
        if (!this.firebaseToken) {
            return;
        }

        const response = await axios.post(
            "https://auth.bereal.team/token",
            {
                grant_type: "firebase",
                client_id: "ios",
                client_secret: "962D357B-B134-4AB6-8F53-BEA2B7255420",
                token: this.firebaseToken,
            },
            {
                headers: this.headers,
                withCredentials: true,
                params: { grant_type: "firebase" },
            }
        );

        // Exception handling
        if (response.status !== 201) {
            console.log("Token refresh failed, error: ", response.data);
            return;
        }
        //!
        // this.tokenInfo = JSON.parse(
        //     atob(response.data.access_token.split(".")[1] + "==")
        // );
        this.refresh_token = response.data.refresh_token;
        this.expiration = moment().add(
            parseInt(response.data.expires_in),
            "seconds"
        );

        this.token = await response.data.access_token;
        console.log("Token granted successfully, token: ", this.token);
        return;
    }

    async apiRequest(method: string, endpoint: string): Promise<any> {
        console.log("Requesting " + this.token);
        const response = await axios({
            method: method,
            url: this.api_url + "/" + endpoint,
            headers: {
                Authorization: "Bearer " + this.token,
            },
        });
        return response.data;
    }

    async getFriendsFeed(): Promise<any> {
        console.log(await this.apiRequest("GET", "feeds/friends"));
    }
}
