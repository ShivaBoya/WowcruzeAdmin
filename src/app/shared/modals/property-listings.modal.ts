//================================STRUCTURES==============================
export type PropertyListing = {
    "property_id": number,
    "property_name": string,
    "property_city": string,
    "property_location": string,
    "property_description": string,
    "property_type": string,
    "listing_date": string,
    "total_shares": number
    "sold_shares": number
    "property_images": object,
    "sale_status": string,
    "SPV_status": string,
    "NFT_status": string,
    "resale_status": string,
    "property_price": number
    "price_per_share": number
    "fiat_currency": string,
    "crypto_currency": string
}

export type PropertyListings = PropertyListing[];

export const SaleTypeArr = [
    "CREATED",
    "STARTED",
    "PAUSED",
    "COMMITED",
    "COMPLETED",
    "ABORTED"
];

export const PropertyTypes = [
    'Coupe',
    'SUV',
    'Convertible',
    'SEDAN'
]

export enum SaleType {
    "CREATED" = "Created",
    "STARTED" = "Started",
    "PAUSED" = "Paused",
    "COMMITED" = "Commited",
    "COMPLETED" = "Completed",
    "ABORTED" = "Aborted",
}

export const ResaleTypeArr = [
    "NOT_OPEN",
    "OPEN",
    "CLOSED"
];

export enum ResaleType {
    "NOT_OPEN" = "Not Open",
    "OPEN" = "Open",
    "CLOSED" = "Closed"
}


export const NFTTypeArr = [
    "NOT_ISSUED",
    "ISSUED"
];

export enum NFTType {
    "NOT_ISSUED" = "Not Issued",
    "ISSUED" = "Issued"
}


export const SPVTypeArr = [
    "FORMED",
    "UNFORMED"
];

export enum SPVType {
    "FORMED" = "Formed",
    "UNFORMED" = "Unformed"
}

//================================STRUCTURES==============================

//================================API HELPER STRUCTURES==============================

export type DateFromToJson = {
    'from': string,
    'to': string
}

export type NumberFromToJson = {
    'from': number,
    'to': number
}

export enum SortBy {
    "asc" = "ASC",
    "desc" = "DESC"
}

export type PropertyListingFilters = {
    "filtersByString": {
        "resale_status": string[] | null,
        "asset_type":string[] | null,
        "sale_status":string[] | null,
        "SPV_status":  string[] | null,
        "NFT_status": string[] | null,
    },
    "filtersByDate": {
        "listing_date": DateFromToJson | null,
    },
    "filtersByPlaces": any | null,
    "filtersByBuilders": null,
    "filtersByPrice": {
        "price_per_token":  NumberFromToJson | null,
    },
    "filtersBySearch": {
        "asset_id":  string[] | null,
        "asset_name":  string[] | null,
    },
    "filterBySort": {
        "listing_date": SortBy | null,
        "price_per_token": null
    }
}

export const emptyPropertyListingFilter = {
    "filtersByString": {
        "sale_status": null,
        "SPV_status": null,
        "NFT_status": null,
        "resale_status": null,
        "asset_type": null,
    },
    "filtersByDate": {
        "listing_date": null,
    },
    "filtersByPlaces": null,
    "filtersByBuilders": null,
    "filtersByPrice": {
        "price_per_token": null,
    },
    "filtersBySearch": {
        'asset_id': null,
        'asset_name': null
    },
    "filterBySort": {
        "listing_date": "DESC",
        "price_per_token": null,
    }
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

export function parseNumberFromTo(data: NumberFromToJson | null): object | null {
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

export function parsePropertyListingFilter(data: PropertyListingFilters): object {
    let return_object: object = {
        "userType": "ADMIN",
        "filtersByString": {
            "resale_status": data.filtersByString.resale_status,
            "property_type": data.filtersByString.asset_type,
            "sale_status": data.filtersByString.sale_status,
            "SPV_status": data.filtersByString.SPV_status,
            "NFT_status": data.filtersByString.NFT_status,
        },
        "filtersByDate": {
            "listing_date": parseDateFromTo(data.filtersByDate.listing_date),
        },
        "filtersByPlaces": data.filtersByPlaces,
        "filtersByPrice": {
            "price_per_share": parseNumberFromTo(data.filtersByPrice.price_per_token),
        },
        "filtersBySearch": {
            'property_id': data.filtersBySearch.asset_id,
            'property_name': data.filtersBySearch.asset_name
        },
        "filterBySort": {
            "listing_date": data.filterBySort.listing_date,
            "price_per_share": data.filterBySort.price_per_token,
        }
    };

    return return_object;
}

export type LocationsDetails = {
    "location_id": number,
    "location_name": string,
    "visibility_weightage": number
}

export type PlaceDetails = {
    "city_id": string,
    "city_name": string,
    "locations": LocationsDetails[]
}

export type BuildersDetails = {
    "builder_id": number,
    "builder_name": string,
    'builder_logo': string
}

export const emptyCityAndBrandDetails = {
    "place_filters": [] as PlaceDetails[],
    "brand_filters": [] as BuildersDetails[]
}

export type CityAndBrandDetails = {
    "place_filters": PlaceDetails[],
    "brand_filters": BuildersDetails[]
}
//================================API HELPER STRUCTURES==============================