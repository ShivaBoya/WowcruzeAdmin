import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CityAndBrandDetails, PropertyListingFilters, PropertyListings, parsePropertyListingFilter } from '../modals/property-listings.modal';
import { SIGNIN_API_URL, ENV, web2configurations } from '../utils/config';
import { SignInInput, SignInOutput, VerifySignInInput, VerifySignInOutput, parseSignInInput, parseVerifySignInInput, EmailLoginInput, EmailLoginOutput } from '../modals/login.modal';
import { AddPropertyAPI, DefaultPropertyDetailsAPI, DeleteBuildersInfo, InvoiceAttributeItemStruct, InvoiceAttributesStruct, NftStatusApi, PropertyDetailsAPI, ResaleStatusApi, SaleStatusApi, SpvStatusApi, UpdatePropertyAPI, addBuilderApi, addCityLocationApi } from '../modals/add-property.modal';
import { KYCLisitingAPIJSON, KYCLisitng, VerifyKYCAPIJSON, KYCListingFilters, parseKYCListingFilter } from '../modals/kyc.modal';
import { BuyersListing, BuyersListingAPIJSON, BuyersListingFilters, BuyersListings, parseBuyerListingFilter } from '../modals/buyersListing';
import { ApiModal, ModalTypes } from '../modals/modal.modal';
import { DataService } from './data.service';

@Injectable({
    providedIn: 'root'
})

export class HttpService {
    private is_acc_json = {
        "development": false,
        "production": false,
        "acceptance": true,
    }
    constructor(private http: HttpClient, private dataService: DataService) { }

    getFormattedErrorCode(error: any): string {
        let return_response: string = "";
        let request_string = "";

        if (error.error && error.error.data) {
            request_string = error.error.data;
        } else if (typeof error.error == 'string') {
            request_string = error.error;
        } else if (error.error && error.error.code) {
            request_string = error.error.code;
        } else {
            request_string = error.message || "Unknown error";
        }

        const lowerRequest = request_string.toLowerCase();

        switch (lowerRequest) {
            case ("User Phone number is not yet registered").toLowerCase():
                return_response = "User Phone number is not yet registered";
                break;
            case ("Invalid Status").toLowerCase():
                return_response = `Invalid status`;
                break;
            case "er_parse_error":
                return_response = `Database Server Error`;
                break;
            default:
                // If it's a specific message from our backend, return it as is
                if (request_string.length > 5 && !request_string.includes("SOMETHING_WENT_WRONG")) {
                    return_response = request_string;
                } else {
                    return_response = `Something went wrong. Please try again.`;
                }
                break;
        }
        return return_response;
    }

    invalidateSession() {
        this.dataService.modalUpdater(ModalTypes.ERR_API).next(
            {
                content: 'Error: Invalid session, logging out. please login again.',
                router: '/',
                title: "Invalid session",
                status: true,
                call: () => {
                    localStorage.removeItem('staffId');
                    localStorage.removeItem('wallet');
                    localStorage.removeItem('session');
                    window.location.reload();
                }
            } as ApiModal
        )

    }

    getApiHeader() {
        return { "Authorization": localStorage.getItem('session') ?? '' };
    }

    signIn(input_params: SignInInput): Promise<SignInOutput> {
        return new Promise<SignInOutput>((resolve, reject) => {
            try {
                let is_acc: boolean = this.is_acc_json[ENV];
                let input_p: object | any = parseSignInInput(input_params);
                if (is_acc) input_p.env = 'ACC';
                this.http.post(`${SIGNIN_API_URL}/wc_cognito/sign-in/sign-in-with-otp`, parseSignInInput(input_params)).subscribe(
                    (response: any) => {
                        resolve(response as SignInOutput);
                    },
                    (error: any) => {
                        reject(this.getFormattedErrorCode(error));
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }

    verifySignIn(input_params: VerifySignInInput): Promise<VerifySignInOutput> {
        return new Promise<VerifySignInOutput>((resolve, reject) => {
            try {
                let is_acc: boolean = this.is_acc_json[ENV];
                let input_p: object | any = parseVerifySignInInput(input_params);
                if (is_acc) input_p.env = 'ACC';
                this.http.post(`${SIGNIN_API_URL}/wc_cognito/sign-in/verify-sign-in`, input_p).subscribe(
                    (response: any) => {
                        resolve(response as VerifySignInOutput);
                    },
                    (error: any) => {
                        reject(this.getFormattedErrorCode(error));
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }

    loginWithEmail(input_params: EmailLoginInput): Promise<EmailLoginOutput> {
        return new Promise<EmailLoginOutput>((resolve, reject) => {
            try {
                this.http.post(`${web2configurations.API_URL}/wc-admin/login-with-email`, input_params).subscribe(
                    (response: any) => {
                        resolve(response.data as EmailLoginOutput);
                    },
                    (error: any) => {
                        reject(this.getFormattedErrorCode(error));
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }

    fetchPropertyListings(listing_filters: PropertyListingFilters, page: number = 1, pageSize: number = 10, adminId: string = ''){
       let url = `${web2configurations.API_URL}/wc-admin/fetch-assets`;
        return new Promise<any>((resolve, reject) => {
            try {
                let body = {
                    ...listing_filters,
                    page: page,
                    number_of_assets_per_page: pageSize,
                    admin_id: adminId
                };
                this.http.post(url, body, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        reject(this.getFormattedErrorCode(error));
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }

        });
    }

    fetchBuyerListings(listing_filters_buyer: BuyersListingFilters): Promise<BuyersListings> {
        return new Promise<BuyersListings>((resolve, reject) => {
            try {
                this.http.post(`${web2configurations.API_URL}/wc-user/fetch-investment-holders`, parseBuyerListingFilter(listing_filters_buyer), { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response as BuyersListings);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }

        });
    }
    fetchUserKYCList(listing_filters_kyc: KYCListingFilters): Promise<KYCLisitng[]> {
        return new Promise<KYCLisitng[]>((resolve, reject) => {
            try {
                this.http.post(`${web2configurations.API_URL}/wc-user/fetch-users-kyc`, parseKYCListingFilter(listing_filters_kyc), { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response as KYCLisitng[]);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }

        });
    }

    // fetchCityAndBuilders() {
    //     return new Promise<any>((resolve, reject) => {
    //         try {
    //             this.http.get(`${web2configurations.API_URL}/fr-property/fetch-properties-default-filters`).subscribe(
    //                 (response: any) => {
    //                     resolve(response as CityAndBuildersDetails);
    //                 },
    //                 (error: any) => {
    //                     reject(this.getFormattedErrorCode(error));
    //                 }
    //             );
    //         } catch (error) {
    //             reject(this.getFormattedErrorCode(error));
    //         }
    //     });
    // }

    addProperty(input_params: AddPropertyAPI): Promise<string> {
        let url = `${web2configurations.API_URL}/wc-admin/add-asset`;
        return new Promise<string>((resolve, reject) => {
            try {
                this.http.post(url, input_params, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    fetchDroupdownInfo() {
      let url = `${web2configurations.API_URL}/wc-admin/fetch-admin-default-details`;
        return new Promise<any>((resolve, reject) => {
            try {
                this.http.post(url, {}, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        reject(this.getFormattedErrorCode(error));
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }

    updateProperty(input_params: UpdatePropertyAPI | any): Promise<string> {
        let url = `${web2configurations.API_URL}/wc-admin/update-asset`;
        input_params['staff_id'] = localStorage.getItem('staff_id');
        return new Promise<string>((resolve, reject) => {
            try {
                this.http.post(url, input_params, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    addCityLocationApi(input_params: addCityLocationApi | any): Promise<string> {
        input_params['staff_id'] = localStorage.getItem('staff_id');
        return new Promise<string>((resolve, reject) => {
            try {
                this.http.post(`${web2configurations.API_URL}/wc_assets/add-location`, input_params, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }
    removeCityLocationApi(input_params:any): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                this.http.post(`${web2configurations.API_URL}/wc_assets/delete-location`, input_params, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }
    addBuilderApi(input_params: addBuilderApi): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                this.http.post(`${web2configurations.API_URL}/wc_assets/add-brand`, input_params, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }
    removeBrandApi(input_params: any) {
        return new Promise<string>((resolve, reject) => {
            try {
                this.http.post(`${web2configurations.API_URL}/wc_assets/delete-brand`, input_params, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }
    updateSaleStatus(input_params: SaleStatusApi): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                this.http.post(`${web2configurations.API_URL}/wc_assets/update-asset-sale-status`, input_params, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    updateSpvStatus(input_params: SpvStatusApi): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                this.http.post(`${web2configurations.API_URL}/wc_assets/update-asset-spv-status`, input_params, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }
    updateResaleStatus(input_params: ResaleStatusApi): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                this.http.post(`${web2configurations.API_URL}/wc_assets/update-asset-resale-status`, input_params, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }
    updateNftStatus(input_params: NftStatusApi): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                this.http.post(`${web2configurations.API_URL}/wc_assets/commit-nft`, input_params, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    fetchPropertyDetails(obj: any): Promise<DefaultPropertyDetailsAPI | string> {
        let url = `${web2configurations.API_URL}/wc-admin/fetch-asset-details`;
        return new Promise<DefaultPropertyDetailsAPI | string>((resolve, reject) => {
            try {
                this.http.post(url, obj, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        const data = response?.data || response?.response;
                        let item = data?.asset_info;
                        let charges = data?.invoice_items || data?.additional_chagres_info || [];

                        let invoiceItems: InvoiceAttributesStruct[] = [];
                        for (let i = 0; i < charges.length; i++) {
                            let invoiceItem: InvoiceAttributesStruct = {
                                sale_type: charges[i].sale_type,
                                trade_type: charges[i].trade_type,
                                invoice_details: charges[i].invoice_details as InvoiceAttributeItemStruct[]
                            };
                            invoiceItems.push(invoiceItem);
                        }
                        resolve({ fullPropertyDetails: item, invoice_items: invoiceItems });
                    },
                    (error: any) => {
                        reject(this.getFormattedErrorCode(error));
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }

    fetchUserKYC(input_params: KYCLisitingAPIJSON): Promise<KYCLisitng[] | string> {
        return new Promise<KYCLisitng[] | string>((resolve, reject) => {
            try {
                this.http.post(`${web2configurations.API_URL}/wc-user/fetch-users-kyc`, input_params, { headers: this.getApiHeader() }).subscribe(
                    (response: any | KYCLisitng[]) => {
                        for (let itemIndex = 0; itemIndex < response.length; itemIndex++) {
                            const element = response[itemIndex];
                            if (response[itemIndex].identity_document != null && response[itemIndex].identity_document != '') {
                                response[itemIndex].identity_document = JSON.parse(response[itemIndex].identity_document);
                                response[itemIndex].cancelled_cheque_leaf = JSON.parse(response[itemIndex].cancelled_cheque_leaf);
                            }
                        }
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }

    fetchBuyerListing(input_params: BuyersListingFilters): Promise<BuyersListing[] | string> {
        return new Promise<BuyersListing[] | string>((resolve, reject) => {
            try {
                this.http.post(`${web2configurations.API_URL}/wc-user/fetch-investment-holders`, input_params, { headers: this.getApiHeader() }).subscribe(
                    (response: any | BuyersListing[]) => {
                        for (let itemIndex = 0; itemIndex < response.length; itemIndex++) {
                            const element = response[itemIndex];
                            if (response[itemIndex].identity_document != null && response[itemIndex].identity_document != '') {
                                response[itemIndex].identity_document = JSON.parse(response[itemIndex].identity_document);
                                response[itemIndex].cancelled_cheque_leaf = JSON.parse(response[itemIndex].cancelled_cheque_leaf);
                            }
                        }
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }

    verifyKYC(input_params: VerifyKYCAPIJSON): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            try {
                this.http.post(`${web2configurations.API_URL}/wc-user/verify-kyc`, input_params, { headers: this.getApiHeader() }).subscribe(
                    (response: any | KYCLisitng[]) => {
                        resolve(response);
                    },
                    (error: any) => {
                        if (error.status == 0) {
                            this.invalidateSession();
                            reject('Error: Invalid session, logging out. please login again.');
                        } else {
                            reject(this.getFormattedErrorCode(error));
                        }
                    }
                );
            } catch (error) {
                reject(error);
            }
        });
    }

    getAdmins(filters: any = {}): Promise<any> {
        let url = `${web2configurations.API_URL}/wc-admin/get-admins`;
        return new Promise<any>((resolve, reject) => {
            try {
                let body = {
                    filters: filters,
                    admin_id: localStorage.getItem('staff_id')
                };
                this.http.post(url, body, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response.data);
                    },
                    (error: any) => {
                        reject(this.getFormattedErrorCode(error));
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }

    addAdmin(payload: any): Promise<any> {
        let url = `${web2configurations.API_URL}/wc-admin/add-admin`;
        return new Promise<any>((resolve, reject) => {
            try {
                payload.admin_id = localStorage.getItem('staff_id');
                this.http.post(url, payload, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response.data);
                    },
                    (error: any) => {
                        reject(this.getFormattedErrorCode(error));
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }


    getAllPermissions(): Promise<any> {
        let url = `${web2configurations.API_URL}/wc-admin/get-all-permissions`;
        return new Promise<any>((resolve, reject) => {
            try {
                this.http.post(url, {}, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response.data);
                    },
                    (error: any) => {
                        reject(this.getFormattedErrorCode(error));
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }

    editAdmin(payload: any): Promise<any> {

        let url = `${web2configurations.API_URL}/wc-admin/edit-admin`;
        return new Promise<any>((resolve, reject) => {
            try {
                payload.admin_id = localStorage.getItem('staff_id');
                this.http.post(url, payload, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response.data);
                    },
                    (error: any) => {
                        reject(this.getFormattedErrorCode(error));
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }


    deleteAdmin(target_staff_id: string): Promise<any> {
        let url = `${web2configurations.API_URL}/wc-admin/delete-admin`;
        let payload = {
            admin_id: localStorage.getItem('staff_id'),
            staff_id: target_staff_id
        };
        return new Promise<any>((resolve, reject) => {
            try {
                this.http.post(url, payload, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response.data);
                    },
                    (error: any) => {
                        reject(this.getFormattedErrorCode(error));
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }

    getUsers(filters: any = {}, page: number = 1, pageSize: number = 10): Promise<any> {

        let url = `${web2configurations.API_URL}/wc-admin/get-users`;
        return new Promise<any>((resolve, reject) => {
            try {
                let body = {
                    filters: filters,
                    page: page,
                    pageSize: pageSize,
                    admin_id: localStorage.getItem('staff_id')
                };
                this.http.post(url, body, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response.data);
                    },
                    (error: any) => {
                        reject(this.getFormattedErrorCode(error));
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }

    fetchAdminProfile(): Promise<any> {
        let url = `${web2configurations.API_URL}/wc-admin/fetch-admin-profile`;
        return new Promise<any>((resolve, reject) => {
            try {
                let body = {
                    admin_id: localStorage.getItem('staff_id')
                };
                this.http.post(url, body, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response.data);
                    },
                    (error: any) => {
                        reject(this.getFormattedErrorCode(error));
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }

    fetchAdminProfileByID(target_admin_id: string): Promise<any> {
        const admin_id = localStorage.getItem('staff_id');
        let url = `${web2configurations.API_URL}/wc-admin/get-admin-details?staff_id=${target_admin_id}&admin_id=${admin_id}`;
        return new Promise<any>((resolve, reject) => {
            try {
                this.http.get(url, { headers: this.getApiHeader() }).subscribe(
                    (response: any) => {
                        resolve(response.data);
                    },
                    (error: any) => {
                        reject(this.getFormattedErrorCode(error));
                    }
                );
            } catch (error) {
                reject(this.getFormattedErrorCode(error));
            }
        });
    }
}
