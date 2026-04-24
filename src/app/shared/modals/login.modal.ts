import { AdminDetails } from "./admin.modal"

export type SignInInput = {
    "username": string,
    // "country_code": string,
    // "user_type": string
}

export type SignInOutput = {
    "username": string,
    "session": string
}

export type EmailLoginInput = {
    "email": string,
    "password": string
}

export type EmailLoginOutput = {
    "AuthenticationResult": {
        "AccessToken": string,
        "ExpiresIn": string
    },
    "AdminDetails": any
}

export type AuthenticationResult = {
    "AccessToken": string,
    "ExpiresIn": number,
    "TokenType": string,
    "RefreshToken": string,
    "IdToken": string
}

export type VerifySignInInput = {
    "username": string,
    "session": string,
    "answer": string,
    "user_type":string
}

export type SessionDeatils = {
    'AccessToken': string,
    'ExpiresIn': number,
    'IdToken': string,
    'RefreshToken': string,
    'TokenType': string,
}

export type VerifySignInOutput = {
    "message": string,
    "session": SessionDeatils | null,
    "user_details": any
}


export function parseSignInInput(data: SignInInput): object {
    let return_object: object = {
        "username": data.username,
        // "country_code": data.country_code,
        // "user_type": data.user_type
    };
    return return_object;
}

export function parseSignInOutput(data: SignInOutput): object {
    let return_object: object = {
        "username": data.username,
        "session": data.session
    };
    return return_object;
}

export function parseVerifySignInInput(data: VerifySignInInput): {} {
    let return_object: object = {
        "username": data.username,
        "session": data.session,
        "answer": data.answer,
        // "country_code": data.country_code,
        // "phone_number": data.phone_number,
        "user_type": data.user_type
    }
    return return_object;
}