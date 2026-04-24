import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class ErrorCode {
    private ERR_CODE_BY_REPSONSE: { [code: string]: string } = {
        "ERR_INSTALL_METAMASK": "It seems that Metamask is not installed on your device. In order to proceed, you will need to install Metamask, a digital wallet required for managing your cryptocurrencies and perform crypto transactions securely.",
        "ERR_TXN_UNDERPRICED": "Web3 transaction is incomplete. Please try again later.",
        "ERR_GATEWAY_FAILED": "Gatway process failed. Please try again later.",
        "ERR_GATEWAY_UNKNOWN": "Gatway process timed out. Please try again later.",
        "ERR_NO_WALLET_AT_DB": "There is no wallet available under your account. Please update your wallet and try again.",
        "MM-4001": "User rejected the request. Please try again later.",
        "ACTION_REJECTED": "User rejected the request. Please try again.",
    };

    getReponseByErrorCode(code: string): string {
        return this.ERR_CODE_BY_REPSONSE[code];
    }

    getReponseByTextContains(code: string): string {
        if (code.includes("replacement transaction underpriced")) {
            code = "ERR_TXN_UNDERPRICED";
        }
        return this.ERR_CODE_BY_REPSONSE[code];
    }
}