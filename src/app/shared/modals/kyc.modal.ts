import { FileStructS3 } from "./extra.modal"
import { DateFromToJson } from "./property-listings.modal";

export type KYCLisitng = {
    "kyc_id": any | null,
    "user_id": string,
    "first_name": string | null,
    "name": string | null,
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
    "approver_id": string | null,
    "created_at": string | null,

    "user_name": string |null,
    "mobile_no": string |null,
    "wallet_address": string |null,
    "kyc_status":string
}

export type KYCLisitngs = KYCLisitng[];
export type KYCLisitingAPIJSON = {
    "staff_id": string,
    "filtersByString": {
        "kyc_id": string[] | null,
        "user_id": string[] | null
   } ,
   "filtersByDate": null
}

export type VerifyKYCAPIJSON = {
    "staff_id": string,
    "kyc_status": string,
    "kyc_id": number
}
export type KYCListingFilters = {
    "staff_id": string | null,
    "filtersByDate": {
        "created_at":DateFromToJson | null
    },
    "filtersByString": {
        'user_id': string[] | null,
        "kyc_status": string[] | null,
        "kyc_id":string[] | null
    }
}
export const emptyKYCListingFilter = {
    "staff_id": null,
    "filtersByString": {
        "kyc_status": null,
        "user_id": null ,
        "kyc_id":null
    },
    "filtersByDate": {
        "created_at": null
    },
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
export function parseKYCListingFilter(data: KYCListingFilters): object {
    let return_object: object = {
        "staff_id": data.staff_id,
        "filtersByString": {
            "kyc_status": data.filtersByString.kyc_status,
            "user_id": data.filtersByString.user_id ,
            "kyc_id":data.filtersByString.kyc_id
        },
        "filtersByDate":{
                "created_at":data.filtersByDate.created_at
        }
    };

    return return_object;
}

export enum KycType {
    "APPROVE" = "Approve",
    "REJECT" = "Reject",
}

export const KYCTypeArr = [
    "Requested",
    "Approved",
    "Rejected"
];

export enum KYCTypeUser {
    "Requested" = "REQUESTED",
    "Approved" = "APPROVED",
    "Rejected" ="REJECTED"
    

}