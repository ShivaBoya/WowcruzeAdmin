export class Constant {
    SHARES_DECIMAL: number = 1 * 10 ** 5;
    CRYPTO_COIN_DECIMAL: number = 1 * 10 ** 18;
    USER_TYPE: string = "STAFF";
}


export type FileStructS3 = {
    "Key": string,
    "Bucket": string
}
