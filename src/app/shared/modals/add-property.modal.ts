import { FileStructS3 } from "./extra.modal";

export type PropertyInfoItem = {
    title: string,
    content:string,
    subtitle: string
};
export type AssetInfoItem = {
    title: string,
    content: string,
    subContent: string
};

export type PropertyInfo = PropertyInfoItem[];
export type AssetInfo = AssetInfoItem[];

export type YearlyInvestmentDetailsItem = {
    year: number,
    appreciation: number,
    rental: number,
    return: number
}

export type BuildersInfo = {
    "builder_id": number ,
    "builder_name": string,
    "builder_image": string
}
export type DeleteBuildersInfo = {
    "staff_id": string,
    "builder_id": number | null
}

export type CurrencyInfo = {
    "currency_id": number,
    "currency_name": string
}

export type PropertyDocuments = {
    "title": string,
    "description": string,
    "docs": FileStructApi[],
}

export type PropertyDocStruct = FileStructS3[] | FileStructApi[];

export type InvoiceAttributeItemStruct = {
    "invoice_name": string,
    "invoice_price": number,
    "is_percentage": boolean,
    "wallet": string,
    "bank_account": string
}

export type InvoiceAttributesStruct = {
    "sale_type": string,
    "trade_type": string,
    "invoice_details": InvoiceAttributeItemStruct[]
}
export type AccountDetails = [{
    "account_id": string,
    "account_email": string,
}]
//====================================API HELPER STRUCTURES========================================
export type YearlyInvestmentDetailsAPI = {
    "year": number,
    "expectedAppreciation": number,
    "expectedRental": number,
    "expectedReturns": number,
}
export type addCityLocationApi = {
    "staff_id":string,
    "parent_location_id": Number |null,
    "location_name": string[] | null,
    "type": string |null;
    "sub_locations": string[] | null,
    // "COUNTRY": string |null,
    // "CITY":string |null,
    // "SUB_CITY":string |null
}
// export type locationType = {
//     "COUNTRY": "COUNTRY", 
//     "CITY":"CITY", 
//     "SUB_CITY":"SUB_CITY"
// }
export type addBuilderApi = {
    "staff_id": string,
    "parent_brand_id": any,
    "label": string[] | null,
    "type": string,
    "sub_varients": string[] | null
}
export type SaleStatusApi = {
    "staff_id": string,
    "asset_id": number,
    "sale_status": string
}

export type SpvStatusApi = {
    "staff_id": string,
    "asset_id": number,
    "SPV_status": string
}
export type ResaleStatusApi = {
    "staff_id": string,
    "asset_id": number,
    "resale_status": string
}
export type NftStatusApi = {
    "staff_id": string,
    "asset_id": number,
    "ipfs": string,
    "NFT_status": string
}

export type FileStructApi = {
    "extension": string,
    "file_type": string,
    "base64": string,
    "name"?: string
}


export type AddPropertyAPI = {
    "staff_id": string,
    "asset_name": string,
    "escrow_id": string,
    "listing_date": string,
    "total_tokens": number,
    "limit_per_share": number,
    "asset_price": number,
    "price_per_token": number,
    "mileage": number,
    "credit_hour_per_token" : number,
    "high_performance_engine_in_cc": number,
    "location_id": number,
    "fk_fuel_id": number,
    "fk_brand_id": number,
    "fk_ownership_type_id": number,
    "fk_a_class_id": number,
    "fk_asset_category_id": number,
    "fk_asset_type_id": number,
    "fk_a_transmisson_id": number,
    "is_air_condition": number,
    "base_currency_id": number,
    "asset_description": string,
    "asset_features": string[],
    "asset_images": any,
    "addtional_charges": InvoiceAttributesStruct[],
    "asset_details":any;
    "account_details": AccountDetails,
    "city_id":number,
    "active"?: number
}

export type UpdatePropertyAPI = {
    "asset_id":number,
    "staffId": string,
    "asset_name": string,
    "escrow_id": string,
    "listing_date": string,
    "total_tokens": number,
    "limit_per_share": number,
    "asset_price": number,
    "price_per_token": number,
    "mileage": number,
    "credit_hour_per_token" : number,
    "high_performance_engine_in_cc": number,
    "location_id": number,
    "fk_fuel_id": number,
    "fk_brand_id": number,
    "fk_ownership_type_id": number,
    "fk_a_class_id": number,
    "fk_asset_category_id": number,
    "fk_asset_type_id": number,
    "fk_a_transmisson_id": number,
    "is_air_condition": number,
    "base_currency_id": number,
    "asset_description": string,
    "asset_features": string[],
    "asset_images": any,
    "addtional_charges": InvoiceAttributesStruct[],
    "asset_details":any;
    "account_details": AccountDetails,
    "city_id":number,
    "active"?: number
}
export type DefaultPropertyDetailsAPI = {
  "fullPropertyDetails":PropertyDetailsAPI,
  "invoice_items": InvoiceAttributesStruct[]
}

export type PropertyDetailsAPI = {
    "staffId": string,
    "asset_name": string,
    "escrow_id": string,
    "listing_date": string,
    "total_tokens": number,
    "limit_per_share": number,
    "asset_price": number,
    "price_per_token": number,
    "mileage": number,
    "credit_hour_per_token" : number,
    "high_performance_engine_in_cc": number,
    "location_id": number,
    "fk_fuel_id": number,
    "fk_brand_id": number,
    "fk_ownership_type_id": number,
    "fk_a_class_id": number,
    "fk_asset_category_id": number,
    "fk_asset_type_id": number,
    "fk_a_transmisson_id": number,
    "is_air_condition": number,
    "base_currency_id": number,
    "asset_description": string,
    "asset_features": string[],
    "asset_images": any,
    "addtional_charges": InvoiceAttributesStruct[],
    "asset_details":any;
    "account_details": AccountDetails,
    "city_id":number,
    "active"?: number
    "sale_status": string,
    "SPV_status": string,
    "NFT_status": string,
    "resale_status": string,
    // "fk_builder_id": number,
    // "base_currency_id": number,
    // "property_site_link": string,
    // "property_price": number,
    // "property_discount": number,
    // "price_per_share": number,
    // "builder_logo": any,
    // "builder_name":string,
    // "escrow_id":string,
}
export type notModifyForm = {
    "assetName": string,
    "cityName": string,
    "locationName": string,
    "assetDescriptionName": string,
    "assetListingDateName": string,
    "totalSharesName": number,
    "limitPerShareName": number,
    "assetTypeName": string,
    "propertyDetailsTitleName": any,
    "propertyDetailsSubtitleName": any,
    "propertyFeaturesTitleName": any,
    "propertyFeaturesDescriptionName": any,
    "investmentYearsName": number,
    "expectedAppreciationName": number,
    "expectedRentalName": number,
    "expectedReturnName": number,
    "yearlyInvestmentYearsName": any,
    "saleStatusName": string,
    "spvStatusName": string,
    "nftStatusName": string,
    "resaleStatusName": string,
    "propertySiteLinkName": string,
    "assetPriceName": number,
    "propertyDiscountName": number,
    "pricePerShareName": number,
    "yearlyAppreciationName": number,
    "yearlyRentalName": number,
    "yearlyReturnName": number,
    "propertyImagesName": number,
    "builderName": string,
    "currencyTypeName": string,
    "escrowIdName": string,
    "creditHourPerToken":number,
    "highPerformanceEngine":number,
    "OwnershipType":string,
    "transmissionType":string,
    "escrowIdEmail":string,
    "milage":number,
}