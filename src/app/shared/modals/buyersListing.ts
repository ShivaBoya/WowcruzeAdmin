import { FileStructS3 } from "./extra.modal"
import { DateFromToJson } from "./property-listings.modal";
export type BuyersListing = {
    "kyc_id": number
    "asset_id": string | null,
    "first_name": string | null,
    "last_name": string | null,
    "middle_name": string | null,
    "mobile": string | null,
    "wallet": string | null,
    "email": string | null,
    "dob": string | null,
    "address": string | null,
    "pincode": string | null,
    "name_as_per_bank": string | null,
    "bank_name": string | null,
    "account_number": string | null,
    "bank_code": string | null,
    "identity_type": string | null,
    "identity_document": FileStructS3[],
    "cancelled_cheque_leaf": FileStructS3[],
    "kyc_status": string,
    "approver_id": string | null,
    "name": string | null,
    "fk_ua_user_id" :null,
    "purchased_date": string | null,
    "property_id": number,
    "asset_name": string,
    "buyersName": string,
    "number_of_owned_tokens": string,
    "ownedSharesINR": string,
    "nftClaimStatus": string,
    "purchased_price": string | null,
    "coin_status": string,
}
export type BuyersListings = BuyersListing[];

export type BuyersListingAPIJSON = {
    "staff_id": string,
    "kyc_id": number | null,
    "property_id": string[] | null,
    "purchased_date": DateFromToJson | null,
    "sort_by": {
        "purchased_date": "DESC"
    }
}

export type BuyersListingFilters = {
    "staff_id": string | null,
    "coin_status": string[]| null,
    "asset_name": string[] | null,
    "asset_id": any | null,
    "name": any | null,
    "last_name": string | null,
    "number_of_owned_token": string | null,
    "purchased_date": DateFromToJson | null,
    "purchased_price": string | null,
    "search_by": {
        'asset_name': string[] | null
    },
    "sort_by": {
        "purchased_date": "DESC"
    }
}

export const emptyBuyersListingFilter = {
    // "filtersByString": {
    //     "NFT_status": null,
    // },
    // "filtersBySearch": {
    //     'property_id': null,
    //     'property_name': null,
    //     'buyer_name': null
    // }
    "staff_id": null,
    "coin_status": null,
    "asset_name": null,
    "asset_id": null,
    "name": null,
    "last_name": null,
    "number_of_owned_token": null,
    "purchased_date": null,
    "purchased_price": null,
    "search_by": {
        'asset_name': null
    },
    "sort_by": {
        "purchased_date": "DESC"
    }
}

export const NFTTypeArr = [
    "MINTED",
    "MINT_NOW",
    "MINTING_NOT_AVAILABLE",
    "MINTING_INPROGRESS"
];

export enum NFTTypeBuyer {
    "MINT_NOW" = "Not Claimed",
    "MINTED" = "Claimed",
    "MINTING_NOT_AVAILABLE" ="Claim Unavailable",
    "MINTING_INPROGRESS" = "Claim in process"

}
export function parseBuyerListingFilter(data: BuyersListingFilters): object {
    let return_object: object = {
        "staff_id": data.staff_id,
        "coin_status": data.coin_status,
        'asset_name': data.asset_name,
        // "property_id": data.property_id,
        "asset_id": data.asset_id,
        "name": data.name,
        "last_name": data.last_name,
        "number_of_owned_token": data.number_of_owned_token,
        "purchased_date":   data.purchased_date,
        "purchased_price": data.purchased_price,
        "search_by": {
            'asset_name': data.search_by.asset_name
        },
        "sort_by": {
            "purchased_date":  data.sort_by.purchased_date
        }
    };

    return return_object;
}
export function parseDateFromTo(data: DateFromToJson | null): object | null {
    let return_object: object | null = {};
    if (data == null) {
        return_object = null;
    } else {
        return_object = {
            'from': data.from,
            'to': data.to
        }
    }
    return return_object;
}