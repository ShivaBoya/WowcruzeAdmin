export type AdminDetails = {
    "staff_id": string,
    "first_name": string | null,
    "middle_name": string | null,
    "last_name": string | null,
    "mobile": string | null,
    "wallet": string | null,
    "country_code": string | null,
    "active": number,
    "created_at": string | null,
    "updated_at": string | null,
    "last_accessed_at": string | null
}

export function parseAdminDetails(data: AdminDetails): object {
    return {
        "staff_id": data.staff_id,
        "first_name": data.first_name,
        "middle_name": data.middle_name,
        "last_name": data.last_name,
        "mobile": data.mobile,
        "wallet": data.wallet,
        "country_code": data.country_code,
        "active": data.active,
        "created_at": data.created_at,
        "updated_at": data.updated_at,
        "last_accessed_at": data.last_accessed_at
    };
}