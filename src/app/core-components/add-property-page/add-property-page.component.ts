import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from "@angular/forms";
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { AssetInfo, AssetInfoItem, CurrencyInfo, DefaultPropertyDetailsAPI, DeleteBuildersInfo, FileStructApi, InvoiceAttributeItemStruct, InvoiceAttributesStruct, NftStatusApi, PropertyDetailsAPI, PropertyDocStruct, ResaleStatusApi, SpvStatusApi, YearlyInvestmentDetailsAPI, addBuilderApi, addCityLocationApi } from 'src/app/shared/modals/add-property.modal';
import { AddPropertyAPI, UpdatePropertyAPI, notModifyForm, SaleStatusApi } from 'src/app/shared/modals/add-property.modal';
import { BuildersInfo, PropertyDocuments, PropertyInfo, PropertyInfoItem, YearlyInvestmentDetailsItem } from 'src/app/shared/modals/add-property.modal';
import { ApiModal, ModalTypes } from 'src/app/shared/modals/modal.modal';
import { CityAndBrandDetails, LocationsDetails, PlaceDetails, SaleType } from 'src/app/shared/modals/property-listings.modal';
import { DataService } from 'src/app/shared/services/data.service';
import { HttpService } from 'src/app/shared/services/http.service';
import { web2configurations } from '../../shared/utils/config';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FileStructS3 } from 'src/app/shared/modals/extra.modal';
import { delay } from 'rxjs';


@Component({
  selector: 'app-add-property-page',
  templateUrl: './add-property-page.component.html',
  styleUrls: ['./add-property-page.component.scss']
})
export class AddPropertyPageComponent implements OnInit {
  currentFormPage: number = 1;
  maxFileSize = 5 * 1024 * 1024; // 5MB
  stepOneForm: FormGroup;
  stepTwoForm: FormGroup;
  modalForm: FormGroup;
  modalInvoiceForm: FormGroup;
  cityLocationBuilderForm: FormGroup;
  isPageLoader = false;
  isFormOneSubmitted: boolean = false;
  isFormTwoSubmitted: boolean = false;
  clickedOnupdate: boolean = false;
  isCityChanged: boolean = false;
  isPrimaryInvoiceSubmited: boolean = false;
  isSecondaryInvoiceSubmited: boolean = false;
  selectedYear: any;
isCorrectEmail = false;
 cityError= false;
 isBrandSelected = true;
  futureYear: any;
  years: number[] = [];
  isYearlyInvestmentExist: boolean = false;
  currentCity = '';
  invoiceDetailsItems = [] as any;
  intialInvoiceDetailsItems = [] as any;
  addLocation = '';
  addedLocationItems: string[] = [];
  previousLocationItems: string[] = [];
  addedBrandItems: string[] = [];
  isCity: boolean = false;
  isLocation: boolean = false;
  isBrand: boolean = false;
  isSubBrand: boolean = false;
  subBrandeatils:any;
  propertyDetailsItems: PropertyInfo = [] as PropertyInfo;
  propertyFeaturesItems: PropertyInfo = [] as PropertyInfo;
  assetFeaturesItems: AssetInfo = [] as AssetInfo;

  yearlyInvestementDetails: YearlyInvestmentDetailsItem[] = [] as YearlyInvestmentDetailsItem[];
  propertyImages: FileStructApi[] = [] as FileStructApi[];
  builderLogo: FileStructApi = {} as FileStructApi;
  buildersDetails: BuildersInfo[] = [] as BuildersInfo[];
  currencyDetails: CurrencyInfo[] = [] as CurrencyInfo[];
  propertyDocuments: PropertyDocuments[] = [] as PropertyDocuments[];
  propertyCurrentDocuments: FileStructApi[] = [] as FileStructApi[];
  todayDate: string = '';
  cityAndBrandDetails: CityAndBrandDetails = {} as CityAndBrandDetails;
  // cityDetails: PlaceDetails[] = [] as PlaceDetails[];
  cityDetails:any
  // locationDetails: LocationsDetails[] = [] as LocationsDetails[];
  locationDetails:any;

  isViewDetails: boolean = false;
  isUpdateDetails: boolean = false;
  // isPropertyPerShareIsLessThenOne: boolean = false;
  propertyId: number | any;
  form1BeforeModification: notModifyForm = {} as notModifyForm;
  form2BeforeModification: notModifyForm = {} as notModifyForm;
  propertyDetailsBeforeModification: PropertyInfo = [] as PropertyInfo;
  propertyFeaturesItemsBeforeModification: PropertyInfo = [] as PropertyInfo;
  yearlyInvestementDetailsBeforeModification: YearlyInvestmentDetailsItem[] = [] as YearlyInvestmentDetailsItem[];
  soldShares: number | any;

  propertyImagesBeforeModification: FileStructApi[] = [] as FileStructApi[];
  propertyDocumentsBeforeModification: any;

  propertyImagesOriginalStruct: FileStructS3[] | FileStructApi[] = [] as FileStructS3[];
  builderLogoOriginalStruct: FileStructS3 | FileStructApi = {} as FileStructS3;
  propertyImagesBeforeOriginalStruct: FileStructS3[] | FileStructApi[] = [] as FileStructS3[];

  indexPropertyDocumentsOriginalStruct: number = -1;
  propertyDocumentsOriginalStruct: PropertyDocStruct[] = [] as PropertyDocStruct[];
  propertyDocumentsBeforeOriginalStruct: PropertyDocStruct[] = [] as PropertyDocStruct[];
  invoiceItems: InvoiceAttributesStruct[] = [] as InvoiceAttributesStruct[];
  invoiceIsPercent: boolean = false;
  // options = [
  //   { label: 'Option 1', value: 'option1' },
  //   { label: 'Option 2', value: 'option2' },
  //   { label: 'Option 3', value: 'option3' },
  //   // Add more options as needed
  // ];
  // selectedOption: any;

  selectedOption: string = '';
  selectedLocation: string = '';
  isDropdownOpen: boolean = false;
  assetTypes:any;
  assetsCategories :any;
  assetsOwnersType:any;
  assetsTransmissionType:any;
  assetsFeatures:any;
  assetsBrands:any;
  assetsFuelTypes:any;
  countries:any;
  states:any;
  locations:any;
  subLocations:any;
  brandError : boolean = false;
  sublocationError = false;
  assetsAirConditionerType = [
    { id: 1, text: 'Yes' },
    { id: 2, text: 'No' }
  ];
  assetDetailsObj = [
    { id: 1, text: 'Registration' },
    { id: 2, text: 'Kilometer Driven' }
  ];
  // otherChargesOption = [
  //   { id: 1, text: 'AMC Charges' },
  //   { id: 2, text: 'gst' },
  //   {id: 3, text:'Platform Handling Fee'}
  // ];
  isStateSelected = true;
  isCitySelected = true;
  isCurrencySelectDisabled = true;
  assetsClassType:any;
  assetsCurrencies :any;
  isCountryChanged = false;
  isStateChanged = false;
  assetFeatures :string[]  = [];
 isAssetIdEmpty = false;
  addFeatureId :any;
  isBrandChanged = false;
  subBrandError = false;
  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private httpService: HttpService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private datePipe: DatePipe,
    private el: ElementRef
  ) {
    // this.fetchCityAndBuilderDetails();

    this.stepOneForm = this.formBuilder.group({
      assetName: ['', Validators.required],
      assetDescriptionName: ['', Validators.required, this.trimValidatorCheck],
      currencyTypeName: [{ value: '1', disabled: true }],
      assetListingDateName: ['', Validators.required],
      cityName: ['', Validators.required],
      locationName: ['', Validators.required],
      totalSharesName: ['40', Validators.required],
      limitPerShareName: ['', Validators.required],
      assetPriceName: ['', Validators.required],
      pricePerShareName: ['', Validators.required],
      brandType : ['', Validators.required],
      subBrandType : ['', Validators.required],
      creditHourPerToken: ['70', Validators.required],
      milage: ['', Validators.required],
      highPerformanceEngine: ['', Validators.required],
      assetCategoryName: ['', Validators.required],
      OwnershipType: ['', Validators.required],
      transmissionType: ['', Validators.required],
      // propertyDiscountName: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^(-)?[0-9]+(\.[0-9]+)?$')]],
      assetTypeName: ['', Validators.required],
      escrowIdName: ['', Validators.required],
      escrowIdEmail: ['', Validators.required],
      countryName: ['', Validators.required],
      stateName:['', Validators.required],
      // propertyDetailsTitleName: [''],
      // propertyDetailsSubtitleName: [''],
    });

    // this.currencyDetails.push({ currency_id: 1, currency_name: "DH" } as CurrencyInfo);
    // this.currencyDetails.push({ currency_id: 2, currency_name: "INR" } as CurrencyInfo);

    this.stepTwoForm = this.formBuilder.group({
      assetFeature: [''],
      airConditionType: ['', [Validators.required]],
      airConditionTypeDisplay: [''],
      classType: ['', [Validators.required]],
      classTypeDisplay: [''],
      assetDetailsSubtitleName: [''],
      assetFuel: ['', Validators.required],
      assetFuelDisplay: [''],
      // investmentYearsName: ['', Validators.required],
      // propertySiteLinkName: ['', Validators.required],
      // expectedAppreciationName: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^(-)?[0-9]+(\.[0-9]+)?$')]],
      // expectedRentalName: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^(-)?[0-9]+(\.[0-9]+)?$')]],
      // expectedReturnName: ['', [Validators.required, Validators.min(0), Validators.max(100), Validators.pattern('^(-)?[0-9]+(\.[0-9]+)?$')]],
      // yearlyInvestmentYearsName: [''],
      // yearlyAppreciationName: [''],
      // yearlyRentalName: [''],
      // yearlyReturnName: [''],
      propertyImagesName: [''],
      // builderName: ['', Validators.required],
      // propertyDocumentTitleName: [''],
      // propertyDocumentDescriptionName: [''],
      // propertyCurrentDocsName: [''],
      saleStatusName: ['CREATED'],
      spvStatusName: ['UNFORMED'],
      nftStatusName: ['NOT_ISSUED'],
      resaleStatusName: ['NOT_OPEN'],
      assetDetailsTitleName: [''],
      assetDetailsContentName: [''],
      assetDetailsSubContentName: [''],
      insurenceDate: ['', Validators.required],
      insurenceContent:['', Validators.required],
      lastServiceDate: ['', Validators.required],
      lastServiceContent:['', Validators.required],
      company: ['', Validators.required],
      corporatePara1:['', Validators.required],
      corporatePara2:['', Validators.required],
      historySubTitle:['', Validators.required],
    });

    this.modalForm = this.formBuilder.group({
      selectedSaleSatus: ['', Validators.required],
      selectedSpvSatus: ['', Validators.required],
      selectedResaleSatus: ['', Validators.required],
      selectedNftSatus: ['', Validators.required],
      ipfsValue: ['', Validators.required]
    })
    this.selectedYear = new Date().getFullYear();
    this.futureYear = this.selectedYear + 10;
    for (let year = this.selectedYear; year <= this.futureYear; year++) {
      this.years.push(year);
    }

    this.modalInvoiceForm = this.formBuilder.group({
      invoiceSaleTypeName: ['', Validators.required],
      invoiceTradeTypeName: ['', Validators.required],
      invoiceNameName: ['', Validators.required],
      invoicePriceName: ['', Validators.required],
      invoiceAccountName: ['', Validators.required],
      invoiceWalletName: ['', Validators.required],
    });
    this.cityLocationBuilderForm = this.formBuilder.group({
      addCityName: ['', Validators.required],
      addLocationName: ['', Validators.required],
      addBrandName: ['', Validators.required],
      addSubBrandName : [''],
    });
  }

  // trimValidator(value: string) {
  //   const trimmedValue = value.trim();

  //   if (!trimmedValue.length && value != '') {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  onSelectChange(event: any): void {
    this.addFeatureId = event.target.value;
    this.isAssetIdEmpty = this.addFeatureId.length === 0;
  }
  setSearchByFilterItem(value: any, search_type: string): void {

    if (search_type == 'ASSET_FE') {
      this.addFeatureId = '';
      if(value !='' && value != undefined && value !=null){
        if (!this.assetFeatures.includes(value)) {
          // let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
          this.assetFeatures.push(value);
          // currentPropertyListingFilters.filtersBySearch.property_id = this.assetFeatures;
          // this.updateFilterSubject(currentPropertyListingFilters);
          let valid_pImages = document.getElementById('asset_features_validation_id') as HTMLSpanElement;
        // valid_pImages.innerText = "Please add atleast 1 asset features";
        valid_pImages.style.display = 'none';
        }
      }
    } 
    value = "";
    this.stepTwoForm.patchValue({
      assetFeature: '',});
  }
  removeSearchByFilterItem(value: string, search_type: string) {
    if (search_type == 'ASSET_FE') {
      let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
      this.assetFeatures = this.assetFeatures.filter((elem:any) => elem != value);
      // currentPropertyListingFilters.filtersBySearch.property_id = this.propertyIdSearchItems;
      // currentPropertyListingFilters.filtersBySearch.property_id = this.assetFeatures.length > 0
      // ? this.assetFeatures
      // : null;
      // this.updateFilterSubject(currentPropertyListingFilters);
    } 
  }
  trimValidatorCheck(control: AbstractControl): Promise<ValidationErrors | null> {
    const value: string = control.value;
    return new Promise((resolve) => {
      setTimeout(() => {
        if (value && value.trim() === '') {
          resolve({ required: true });
        } else {
          resolve(null);
        }
      }, 0);
    });
  }

  handleOutsideClick(class_id: string, id: string, event: MouseEvent) {
    let looking_dd = document.getElementsByClassName(class_id);
    let found_item = false;
    for (let look_index = 0; look_index < looking_dd.length; look_index++) {
      const dd = looking_dd[look_index];
      if (dd.contains(event.target as any)) {
        found_item = true;
        break;
      }
    }

    if (!found_item) {
      let changing_item = (document.getElementById(id) as HTMLBodyElement);
      if (changing_item != null) {
        changing_item.style.display = 'none';
        if (changing_item.parentElement) {
          changing_item.parentElement.style.zIndex = '';
        }
      }
    }
  }

  ngOnInit(): void {
    const today = new Date();
    this.todayDate = today.toISOString().split('T')[0];
    console.log(this.propertyImages);

    document.addEventListener('click', (event: MouseEvent) => {
      if (!this.isViewDetails) {
        // Find if click was inside any dropdown container
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          this.closeAllDropdowns();
        }
      }
    });

    if (this.router.url.includes('property-details')) {
      this.isPageLoader = true;
      this.isViewDetails = true;
      this.propertyId = Number(this.activatedroute.snapshot.paramMap.get("id"));
      let obj = {
        "asset_id": this.propertyId,
        "user_id": "g2w3606o"
      }
      this.isPageLoader = true;
      this.httpService.fetchPropertyDetails(obj)
        .then((response: any) => {
          const item = response?.fullPropertyDetails;
          const item1 = response;
          
          if (!item) {
            throw new Error('Asset info not found in mapped response');
          }

          return this.fetchDropdownValues().then(() => {
            this.processPropertyDetails(item, item1);
          });
        })
        .catch((error) => {
          console.error('Error in ngOnInit asset details loading:', error);
          let modalItem: ApiModal = {
            title: 'Property Details Failed',
            content: 'Error at fetching property details, please try again later. If the issue persists please contact the support team.',
            status: true
          } as ApiModal;
          this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
        })
        .finally(() => {
          this.isPageLoader = false;
        });
    } else {
      this.fetchDropdownValues();
    }
  }

  processPropertyDetails(item: any, item1: any) {
    console.log('Processing property details. Asset Info:', item);
    try {
      this.invoiceItems = item1?.invoice_items as InvoiceAttributesStruct[] || [];
      this.getInvoiceCardItems();
      // this.soldShares = item.sold_shares;

      this.stepOneForm.disable({ onlySelf: true });
      this.stepTwoForm.disable({ onlySelf: true });
      // this.currentCity = item.property_city;

      // if (this.propertyFeaturesItems.length > 0) {
      //   this.stepOneForm.controls['propertyFeaturesTitleName'].setValue(this.propertyFeaturesItems[0].title);
      //   this.stepOneForm.controls['propertyFeaturesDescriptionName'].setValue(this.propertyFeaturesItems[0].subtitle);
      // }

      const safeParse = (data: any) => {
        if (typeof data === 'string') {
          try {
            return JSON.parse(data);
          } catch (e) {
            console.error('Failed to parse JSON:', data, e);
            return data;
          }
        }
        return data;
      };

      let carDeatils = safeParse(item.car_details);
      let history = carDeatils && carDeatils[0] && carDeatils[0].content ? carDeatils[0].content[1] : null;
      let accountDetails = safeParse(item.escrow_details) || {};
      this.stepOneForm.patchValue({
        assetName: item.asset_name,
        escrowIdName: accountDetails.account_id,
        escrowIdEmail: accountDetails.account_email,
        locationName: item.child_location,
        totalSharesName: item.total_tokens,
        pricePerShareName: item.price_per_token,
        cityName: item.city,
        countryName: item.country,
        assetListingDateName: this.getDateval(item.listing_date),
        assetPriceName: item.asset_price,
        assetDescriptionName:item.description,
        creditHourPerToken: item.credit_hour_per_token,
        milage: item.mileage,
        highPerformanceEngine:item.high_performance_engine,
        currencyTypeName:item.currency,
        assetCategoryName: item.asset_category_name,
        OwnershipType: item.asset_ownership,
        subBrandType :item.label,
        // transmissionType: carDeatils[5].content,
        assetTypeName:item.asset_type,
        limitPerShareName: item.limit_per_share,
        stateName:item.state,
        // assetDetailsTitleName: item.escrow_id,
        // assetDetailsContentName: item.escrow_id,
        // assetDetailsSubContentName: item.escrow_id,
  
      });

      // We don't need to call fetchDropdownValues again here as it's handled in the caller

      this.stepTwoForm.patchValue({
        saleStatusName: item.sale_status,
        spvStatusName: item.spv_status,
        nftStatusName: item.nft_status,
        resaleStatusName: item.resale_status,
        airConditionType: carDeatils && carDeatils[6] ? carDeatils[6].content : '',
        // assetDetailsContentName: item.sale_status,
        // assetDetailsSubContentName: item.sale_status,
        // assetDetailsSubtitleName: item.sale_status,
        // assetDetailsTitleName: item.sale_status,
        assetFuel: item.fuel_type_name,
        brandType: item.label,
        classType: item.class,
        historySubTitle : carDeatils && carDeatils[0] ? carDeatils[0].title : '',
        company: carDeatils && carDeatils[0] && carDeatils[0].content && carDeatils[0].content[0] ? carDeatils[0].content[0].Company : '',
        corporatePara1: history && history['Corporate History'] ? history['Corporate History'].para_1 : '',
        corporatePara2: history && history['Corporate History'] ? history['Corporate History'].para_2 : '',
        propertyImagesName: item.sale_status,
      });
      this.assetFeatures = safeParse(item.asset_features) || [];
      this.propertyDetailsItems = [];
      this.propertyImages = []; // Reset images
      this.propertyImagesOriginalStruct = [];
      this.addBrandName(item.label);
      // this.addBrandName(this.stepTwoForm.controls['brandType'].value ? this.stepTwoForm.controls['brandType'].value:item.label);
      this.addAircondition(carDeatils);
      this.addFuel(item.fuel_type_name || item.fk_fuel_id);
      this.addClass(item.class || item.fk_a_class_id);
      this.addAssetType(item.asset_type || item.fk_asset_type_id);
      this.addAssetCategory(item.asset_category_name || item.fk_asset_category_id);
      this.addOwnershipType(item.asset_ownership || item.fk_ownership_type_id) ;
      this.addTransmission(item.transmission || item.fk_a_transmisson_id);
      this.addCurrency(item.currency || item.fk_currency_id);
      this.addOtherDetails(carDeatils);
      if (carDeatils && Array.isArray(carDeatils)) {
        carDeatils.forEach((key:any) => {
          if (key.title && (key.title.toLowerCase() == "registration" || key.title.toLowerCase() == "kilometer driven")) {
            let obj = {
              "title":key.title,
              "content":key.content,
              "subtitle":"",
            }
            this.propertyDetailsItems.push(obj);
          }
        });
      }
      this.modalForm.patchValue({
        selectedSaleSatus: item.sale_status,
        selectedSpvSatus: item.SPV_status,
        selectedNftSatus: item.NFT_status,
        selectedResaleSatus: item.resale_status,
      })
      let assetimages = safeParse(item.asset_images) || []; 
      for (let pItemIndex = 0; pItemIndex < assetimages.length; pItemIndex++) {
        const element = assetimages[pItemIndex];
        const key = element['Key'] || element['key'] || element['key_name'];
        if (key) {
          this.propertyImages.push(
            {
              base64: `${web2configurations.CLOUDFRONT_URL}${key}`
            } as FileStructApi
          );
          this.propertyImagesOriginalStruct.push(element);
        }
      }
    } catch (err) {
      console.error('Error processing property details:', err);
    }
  }

          // for (let pDocIndex = 0; pDocIndex < item.property_documents.length; pDocIndex++) {
          //   const element = item.property_documents[pDocIndex];
          //   let docsItems: FileStructApi[] = [];
          //   if (element.docs.length > 0) {
          //     element.docs.forEach((doc: any) => {
          //       docsItems.push({
          //         base64: `${web2configurations.CLOUDFRONT_URL}${doc['Key']}`,
  getDateval(val:string){
  const today = new Date(val);
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  this.todayDate = `${year}-${month}-${day}`;
  return this.todayDate;
}
  getIsUpdateProperty() {
    if (this.router.url.includes('property-details')) {
      return true;
    } else {
      return false;
    }
  }

  updateProperty() {
    this.stepOneForm.enable({ onlySelf: true, emitEvent: false });
    this.stepTwoForm.enable({ onlySelf: true, emitEvent: false });
    this.form1BeforeModification = this.stepOneForm.value;
    this.form2BeforeModification = this.stepTwoForm.value;
    this.propertyDetailsBeforeModification = [];
    // this.propertyDetailsBeforeModification = this.propertyDetailsItems;
    for (const key in this.propertyDetailsItems) {
      if (Object.prototype.hasOwnProperty.call(this.propertyDetailsItems, key)) {
        this.propertyDetailsBeforeModification.push({ title: this.propertyDetailsItems[key].title, subtitle: this.propertyDetailsItems[key].subtitle } as PropertyInfoItem)
      }
    }
    this.propertyFeaturesItemsBeforeModification = [];
    for (const key in this.propertyFeaturesItems) {
      if (Object.prototype.hasOwnProperty.call(this.propertyFeaturesItems, key)) {
        this.propertyFeaturesItemsBeforeModification.push({ title: this.propertyFeaturesItems[key].title, subtitle: this.propertyFeaturesItems[key].subtitle } as PropertyInfoItem)
      }
    }
    this.yearlyInvestementDetailsBeforeModification = [];
    for (const key in this.yearlyInvestementDetails) {
      if (Object.prototype.hasOwnProperty.call(this.yearlyInvestementDetails, key)) {
        this.yearlyInvestementDetailsBeforeModification.push({
          year: this.yearlyInvestementDetails[key].year,
          appreciation: this.yearlyInvestementDetails[key].appreciation,
          rental: this.yearlyInvestementDetails[key].rental,
          return: this.yearlyInvestementDetails[key].return,
        } as YearlyInvestmentDetailsItem)
      }
    }
    this.propertyImagesBeforeModification = [];
    for (let pItemIndex = 0; pItemIndex < this.propertyImages.length; pItemIndex++) {
      const element = this.propertyImages[pItemIndex];
      this.propertyImagesBeforeModification.push(
        {
          base64: `${web2configurations.CLOUDFRONT_URL}${element['base64']}`
        } as FileStructApi
      );
      // this.propertyImagesBeforeOriginalStruct.push(element);
    }
    // this.propertyImagesBeforeOriginalStruct = this.propertyImagesOriginalStruct;
    this.propertyDocumentsBeforeModification = [];
    this.propertyDocumentsBeforeOriginalStruct = [];
    for (let pDocIndex = 0; pDocIndex < this.propertyDocuments.length; pDocIndex++) {
      const element = this.propertyDocuments[pDocIndex];
      let docsItems: FileStructApi[] = [];
      if (element.docs.length > 0) {
        element.docs.forEach((doc: any) => {
          docsItems.push({
            base64: `${web2configurations.CLOUDFRONT_URL}${doc['base64']}`,
            extension: `${doc['extension'].split('.')[(doc['extension'].split('.')).length - 1]}`,
            file_type: `application/${doc['file_type'].split('.')[(doc['file_type'].split('.')).length - 1]}`,
            name: doc['name'].split('/')[(doc['name'].split('/')).length - 1]
          } as FileStructApi);
        });
        this.propertyDocumentsBeforeOriginalStruct[pDocIndex] = (element.docs as any);
      }

      this.propertyDocumentsBeforeModification.push(
        {
          title: element.title,
          description: element.description ?? '',
          docs: docsItems
        } as PropertyDocuments
      );

    }
    this.isUpdateDetails = true;
    this.isViewDetails = false;

  }

  updateModal() {
    let formTwoValidated = this.promptIfErrorFormTwo();
    console.log(this.stepTwoForm.invalid && this.isFormTwoSubmitted);
    if (formTwoValidated) {
      let modalItem: ApiModal = {
        title: 'Confirm Submission',
        content: 'Are you sure you want to modify the asset details? Make sure all the required fields are filled correctly.',
        status: true,
        call: () => {
          this.modifyProperty();
        }
      } as ApiModal
      this.dataService.modalUpdater(ModalTypes.CONFIRM_API).next(modalItem);
    }
  }

  modifyProperty() {
    let formTwoValidated = this.promptIfErrorFormTwo();
    if (formTwoValidated) {
      this.isPageLoader = true;
      this.httpService.updateProperty(this.getUpdatePropertyAPIJSON()).then(
        (response) => {
          let modalItem: ApiModal = {
            title: 'Asset Details Modified Successfuly',
            content: 'The asset has been successfully Modified. Please visit the listing page to check the changes.',
            status: true,
            router: 'Property'
          } as ApiModal
          this.dataService.modalUpdater(ModalTypes.SUCCESS_API).next(modalItem);
          this.stepOneForm.disable({ onlySelf: true });
          this.stepTwoForm.disable({ onlySelf: true });
          this.isViewDetails = true;
          this.isUpdateDetails = false;
          this.isPageLoader = false;
        },
        (error) => {
          let modalItem: ApiModal = {
            title: 'Asset Updation Failed',
            content: error,
            status: true,
            router: ''
          } as ApiModal
          this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
          this.isPageLoader = false;
        }
      );
    }

  }


  cancelModifyProperty() {
    this.stepOneForm.patchValue({
      assetName: this.form1BeforeModification.assetName,
      escrowIdName: this.form1BeforeModification.escrowIdName,
      assetDescriptionName: this.form1BeforeModification.assetDescriptionName,
      currencyTypeName: Number(this.form1BeforeModification.currencyTypeName),
      propertyListingDateName: this.form1BeforeModification.assetListingDateName,
      cityName: this.form1BeforeModification.cityName,
      locationName: this.form1BeforeModification.locationName,
      totalSharesName: this.form1BeforeModification.totalSharesName,
      limitPerShareName: this.form1BeforeModification.limitPerShareName,
      assetPriceName: this.form1BeforeModification.assetPriceName,
      pricePerShareName: this.form1BeforeModification.pricePerShareName,
      propertyDiscountName: this.form1BeforeModification.propertyDiscountName,
      propertyTypeName: this.form1BeforeModification.assetTypeName,
    });

    this.stepTwoForm.patchValue({
      propertySiteLinkName: this.form2BeforeModification.propertySiteLinkName,
      investmentYearsName: this.form2BeforeModification.investmentYearsName,
      expectedAppreciationName: this.form2BeforeModification.expectedAppreciationName,
      expectedRentalName: this.form2BeforeModification.expectedRentalName,
      expectedReturnName: this.form2BeforeModification.expectedReturnName,
      builderName: this.form2BeforeModification.builderName,
      saleStatusName: this.form2BeforeModification.saleStatusName,
      spvStatusName: this.form2BeforeModification.spvStatusName,
      nftStatusName: this.form2BeforeModification.nftStatusName,
      resaleStatusName: this.form2BeforeModification.resaleStatusName,
    });

    this.propertyDetailsItems = this.propertyDetailsBeforeModification;
    this.propertyFeaturesItems = this.propertyFeaturesItemsBeforeModification;
    this.yearlyInvestementDetails = this.yearlyInvestementDetailsBeforeModification;
    this.propertyImages = this.propertyImagesBeforeModification;
    this.propertyImagesOriginalStruct = this.propertyImagesBeforeOriginalStruct;
    this.propertyDocuments = this.propertyDocumentsBeforeModification;
    this.propertyDocumentsOriginalStruct = this.propertyDocumentsBeforeOriginalStruct;

    this.isUpdateDetails = false;
    this.isViewDetails = true;

    this.stepOneForm.disable({ onlySelf: true, emitEvent: false });
    this.stepTwoForm.disable({ onlySelf: true, emitEvent: false });
    this.router.navigate(['']);
  }

  fetchCityAndBuilderDetails() {
    // this.httpService.fetchCityAndBuilders().then(
    //   res => {
    //     this.cityAndBuildersDetails = res;
    //     this.cityDetails = res.place_filters;
    //     this.cityAndBuildersDetails.builder_filters.forEach((element: any) => {
    //       const existingBuilder = this.buildersDetails.find(builder => builder.builder_id === element.builder_id);
    //       if (!existingBuilder) {
    //         this.buildersDetails.push({
    //           builder_id: element.builder_id,
    //           builder_name: element.builder_name,
    //           builder_image: `${web2configurations.CLOUDFRONT_URL}${JSON.parse(element.builder_logo)['Key']}`
    //         } as BuildersInfo);
    //       }
    //     });
    //     this.onChangeCity('', '');
    //     this.stepOneForm.patchValue({ cityName: this.stepOneForm.controls['cityName'].value });
    //     this.currencyDetails = [];
    //     for (let i = 0; i < res.currency_filters.length; i++) {
    //       const currency = res.currency_filters[i];
    //       this.currencyDetails.push({ currency_id: currency.currency_id, currency_name: currency.fiat_currency } as CurrencyInfo);
    //     }
    //     // this.dataService.cityAndBuilderSubject.next(res);
    //   },
    //   err => {
    //     console.log(err);
    //   }
    // );
  }
  fetchDropdownValues(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.httpService.fetchDroupdownInfo().then(
        res => {
          console.log('Dropdown response:', res);
          const data = res?.data || res?.response;
          if (!data) {
            console.warn('Dropdown data missing in response');
            resolve();
            return;
          }
          this.assetTypes = data.asset_types || [];
          this.assetsOwnersType = data.ownership || [];
          this.assetsTransmissionType = data.transmission || [];
          this.assetsFeatures = data.asset_features || [];
          this.assetsBrands = data.brands || [];
          this.assetsFuelTypes = data.fuel_types || [];
          this.countries = data.locations || [];
          
          if (this.countries && this.countries.length > 0) {
            const selectedCountry = this.stepOneForm.controls['countryName'].value;
            if (selectedCountry) {
              const country = this.countries.find((item: any) => item.label === selectedCountry);
              this.states = country ? country.child_locations : [];
            }

            const selectedState = this.stepOneForm.controls['stateName'].value;
            if (selectedState && this.states) {
              const state = this.states.find((item: any) => item.label === selectedState);
              this.cityDetails = state ? state.child_locations : [];
            }

            const selectedCity = this.stepOneForm.controls['cityName'].value;
            if (selectedCity && this.cityDetails) {
              const city = this.cityDetails.find((item: any) => item.label === selectedCity);
              this.locationDetails = city ? city.child_locations : [];
            }
          }
          this.assetsClassType = data.class || [];
          this.assetsCurrencies = data.currencies || [];
          this.assetsCategories = data.asset_catagories || [];
          resolve();
        },
        err => {
          console.error('Error fetching dropdown values:', err);
          reject(err);
        }
      );
    });
  }
  addBrandName(addedVal:any){
    if (!this.assetsBrands) return;
    this.assetsBrands.forEach((item:any) => {
      if (item.child_brands) {
        item.child_brands.forEach((item1:any) => {
          if(item1.label == addedVal){
            this.stepOneForm.get('brandType')!.setValue(item.label);
            }
        }); 
      }
    });
  }
  addAircondition(addedVal:any){
    if (!addedVal || !Array.isArray(addedVal)) return;
    addedVal.forEach( (item1:any)=>{
       if(item1.title == "Air Condition" && this.assetsAirConditionerType){
        this.assetsAirConditionerType.forEach((item:any) => {
          if(item.text == item1.content){
           this.stepTwoForm.get('airConditionType')!.setValue(item.id);
           this.stepTwoForm.get('airConditionTypeDisplay')!.setValue(item.text);
          }
           });
       } else if(item1.title == "Transmission" && this.assetsTransmissionType){
        this.assetsTransmissionType.forEach((item:any) => {
          if(item.transmission_value == item1.content){
            this.stepOneForm.get('transmissionType')!.setValue(item.transmission_value); // Set name for UI
          }
           });
       }
    })
   
  }
  addFuel(addedVal:any){
    if (!this.assetsFuelTypes) return;
    this.assetsFuelTypes.forEach((item:any) => {
   if(item.fuel_value == addedVal){
    this.stepTwoForm.get('assetFuel')!.setValue(item.fuel_id);
    this.stepTwoForm.get('assetFuelDisplay')!.setValue(item.fuel_value);
   }
    });
  }
  addClass(addedVal:any){
    if (!this.assetsClassType) return;
    this.assetsClassType.forEach((item:any) => {
   if(item.class_name == addedVal){
    this.stepTwoForm.get('classType')!.setValue(item.class_id);
    this.stepTwoForm.get('classTypeDisplay')!.setValue(item.class_name);
   }
    });
  }
  addAssetType(addedVal: any) {
    console.log('addAssetType input:', addedVal);
    if (!this.assetTypes || !addedVal) return;
    this.assetTypes.forEach((item: any) => {
      if (item.asset_type_value == addedVal || item.asset_type_id == addedVal) {
        console.log('Found Asset Type match:', item);
        this.stepOneForm.get('assetTypeName')!.setValue(item.asset_type_value);
      }
    });
  }
  addAssetCategory(addedVal: any) {
    console.log('addAssetCategory input:', addedVal);
    if (!this.assetsCategories || !addedVal) return;
    this.assetsCategories.forEach((item: any) => {
      if (item.catagory_name == addedVal || item.asset_catagory_id == addedVal) {
        console.log('Found Asset Category match:', item);
        this.stepOneForm.get('assetCategoryName')!.setValue(item.catagory_name); 
      }
    });
  }
  addOwnershipType(addedVal: any) {
    console.log('addOwnershipType input:', addedVal);
    if (!this.assetsOwnersType || !addedVal) return;
    this.assetsOwnersType.forEach((item: any) => {
      if (item.ownership_value == addedVal || item.ownership_id == addedVal) {
        console.log('Found Ownership match:', item);
        this.stepOneForm.get('OwnershipType')!.setValue(item.ownership_value);
      }
    });
  }
  addTransmission(addedVal: any) {
    console.log('addTransmission input:', addedVal);
    if (!this.assetsTransmissionType || !addedVal) return;
    this.assetsTransmissionType.forEach((item: any) => {
      if (item.transmission_value == addedVal || item.transmission_id == addedVal) {
        console.log('Found Transmission match:', item);
        this.stepOneForm.get('transmissionType')!.setValue(item.transmission_value);
      }
    });
  }
addCurrency(addedVal:any){
  if (!this.assetsCurrencies) return;
  this.assetsCurrencies.forEach((item:any) => {
 if(item.currency_name == addedVal){
  this.stepOneForm.get('currencyTypeName')!.setValue(item.currency_name);
 }
  });
}
  addOtherDetails(addedVal: any) {
    if (addedVal && Array.isArray(addedVal)) {
      addedVal.forEach((item: any) => {
        if (item.title == "Insurance" && item.content) {
          this.stepTwoForm.get('insurenceDate')?.setValue(item.content.date || '');
          this.stepTwoForm.get('insurenceContent')?.setValue(item.content.content_1 || '');
        } else if (item.title == "Last Service" && item.content) {
          this.stepTwoForm.get('lastServiceDate')?.setValue(item.content.date || '');
          let km = item.content.kilometer;
          if (km) {
            if (typeof km === 'string' && !this.isNumber(km)) {
              this.stepTwoForm.get('lastServiceContent')?.setValue(Number(km.split(' ')[0]));
            } else {
              this.stepTwoForm.get('lastServiceContent')?.setValue(Number(km));
            }
          }
        }
      });
    }
  }
isNumber(value:any) {
  return !isNaN(value) && !isNaN(parseFloat(value));
}

  onChangeCity(event: any, option: string) {
    this.isCityChanged = true;
    if (option) {
      this.stepOneForm.patchValue({ cityName: option });
      if (!this.isViewDetails) {
        this.stepOneForm.patchValue({ locationName: "" });
      }
      
      const city = this.cityDetails?.find((c: any) => c.label === option);
      this.locationDetails = city ? city.child_locations : [];
    }
    const droupDown = document.getElementById('detailsDroupDown');
    if (droupDown) droupDown.style.display = 'none';
    if (this.stepOneForm.controls['cityName'].value) {
      this.isCitySelected = false;
    }
  }

  onChangeCountry(event: any, option: string) {
    this.isCountryChanged = true;
    if (option) {
      this.stepOneForm.patchValue({ countryName: option });
      if (!this.isViewDetails) {
        this.stepOneForm.patchValue({ stateName: "", cityName: "", locationName: "" });
      }
      
      const country = this.countries?.find((c: any) => c.label === option);
      this.states = country ? ([{ location_id: -1, label: '', child_locations: [] }].concat(country.child_locations)) : [];
    }
    const droupDown = document.getElementById('detailsDroupDownCountry');
    if (droupDown) droupDown.style.display = 'none';
  }

  onChangeState(event: any, option: string) {
    this.isStateChanged = true;
    if (option) {
      this.stepOneForm.patchValue({ stateName: option });
      if (!this.isViewDetails) {
        this.stepOneForm.patchValue({ cityName: "", locationName: "" });
      }
      
      const state = this.states?.find((s: any) => s.label === option);
      this.cityDetails = state ? state.child_locations : [];
    }
    const droupDown = document.getElementById('detailsDroupDownState');
    if (droupDown) droupDown.style.display = 'none';
    if (this.stepOneForm.controls['stateName'].value) {
      this.isStateSelected = false;
    }
  }

  onChangeBrand(event: any, option: string) {
    this.isBrandChanged = true;
    if (option) {
      this.stepOneForm.patchValue({ brandType: option });
      if (!this.isViewDetails) {
        this.stepOneForm.patchValue({ subBrandType: "" });
      }
      
      const brand = this.assetsBrands?.find((b: any) => b.label === option);
      this.subBrandeatils = brand ? brand.child_brands : [];
    }
    const droupDown = document.getElementById('detailsDroupDownBrand');
    if (droupDown) droupDown.style.display = 'none';
    if (this.stepOneForm.controls['brandType'].value) {
      this.isBrandSelected = false;
    }
  }
  // getLocationsByCityId(city_name: string): LocationsDetails[] {
  //   return this.cityAndBuildersDetails.place_filters ? this.cityAndBuildersDetails.place_filters.find((item) => item.city_name == city_name)?.locations ?? [] : [];
  // }
  // getLocationsByCityId(city_name: string): LocationsDetails[] {
  //   // let currentCity = this.form1BeforeModification.cityName;
  //   const placeFilters = this.cityAndBuildersDetails.place_filters;
  //   this.stepOneForm.patchValue({ cityName: this.stepOneForm.controls['cityName'].value });

  //   if (placeFilters != undefined) {
  //     for (let item = 0; item < placeFilters.length; item++) {
  //       if (placeFilters[item].city_name === city_name) {
  //         if (!this.isViewDetails) {
  //           this.stepOneForm.patchValue({ locationName: "" });
  //         } else {
  //           this.stepOneForm.patchValue({ locationName: placeFilters[item].locations[0].location_name });
  //         }
  //         return ([{ location_id: -1, location_name: '', visibility_weightage: 0 }]).concat(placeFilters[item].locations);
  //       }
  //     }
  //   }
  //   return [];
  // }
  promptStep2() {
    // this.currentFormPage = 2;
    if (this.isViewDetails) {
      this.currentFormPage = 2;
    } else {
      this.isFormOneSubmitted = true;
      if (this.stepOneForm.valid) {
        this.currentFormPage = 2;
      } 
      // else {
      //   // this.isPropertyPerShareIsLessThenOne = true;
      //   this.promptErrorFormOne();
      // }
    }
    // if (savedFormState[1]) {
    //   // this.stepOneForm.setValue(savedFormState[0]);
    //   this.stepTwoForm.setValue(savedFormState[1]);
    // }
    // this.stepTwoForm.patchValue({
    //   airConditionType: this.stepTwoForm.controls['airConditionType'].value,
    //   assetFuel:  this.stepTwoForm.controls['assetFuel'].value,
    //   brandType:  this.stepTwoForm.controls['brandType'].value,
    //   classType:  this.stepTwoForm.controls['classType'].value
    // });
    
  }


  promptErrorFormOne() {
    if (this.propertyDetailsItems.length == 0) {
      let valid_pd = document.getElementById('pd_item_validation_id') as HTMLSpanElement;
      valid_pd.innerText = "Please add atleast one asset details info";
      valid_pd.style.display = 'block';
    }
    if (this.propertyFeaturesItems.length == 0) {
      let valid_pf = document.getElementById('pf_item_validation_id') as HTMLSpanElement;
      valid_pf.innerText = "Please add atleast one asset features info";
      valid_pf.style.display = 'block';
    }
  }



  promptIfErrorFormTwo(): boolean {
    this.isFormTwoSubmitted = true;

    if (this.propertyImages.length != 0 && this.propertyDetailsItems.length != 0 && 
      (this.stepTwoForm.controls['company'].status !== 'INVALID') &&
      (this.stepTwoForm.controls['historySubTitle'].status !== 'INVALID') &&
     (this.stepTwoForm.controls['corporatePara1'].status !== 'INVALID') &&
     (this.stepTwoForm.controls['corporatePara2'].status !== 'INVALID') &&
      (this.stepTwoForm.controls['lastServiceDate'].status !== 'INVALID') &&
     (this.stepTwoForm.controls['lastServiceContent'].status !== 'INVALID') &&
     (this.stepTwoForm.controls['insurenceDate'].status !== 'INVALID') &&
     (this.stepTwoForm.controls['insurenceContent'].status !== 'INVALID')
  ) {
      return true;
    } else {
      // if (this.yearlyInvestementDetails.length < this.stepTwoForm.controls['investmentYearsName'].value) {
      //   let valid_pd = document.getElementById('yid_item_validation_id') as HTMLSpanElement;
      //   valid_pd.innerText = `Please add exact ${this.stepTwoForm.controls['investmentYearsName'].value} yearly investment details`;
      //   valid_pd.style.display = 'block';
      // }
      if( (this.stepTwoForm.controls['company'].status == 'INVALID') ||
      (this.stepTwoForm.controls['historySubTitle'].status == 'INVALID') ||
     (this.stepTwoForm.controls['corporatePara1'].status == 'INVALID') ||
     (this.stepTwoForm.controls['corporatePara2'].status == 'INVALID')){
        let valid_pDoc = document.getElementById('pf_item_history_id') as HTMLSpanElement;
        // valid_pDoc.innerText = "Please add atleast 1 asset deatils";
        valid_pDoc.style.display = 'block';
      }
      if( (this.stepTwoForm.controls['lastServiceDate'].status == 'INVALID') ||
      (this.stepTwoForm.controls['lastServiceContent'].status == 'INVALID')){
        let valid_pDoc = document.getElementById('pf_item_lastSer_id') as HTMLSpanElement;
        // valid_pDoc.innerText = "Please add atleast 1 asset deatils";
        valid_pDoc.style.display = 'block';
      }
      if((this.stepTwoForm.controls['insurenceDate'].status == 'INVALID') ||
      (this.stepTwoForm.controls['insurenceContent'].status == 'INVALID')){
        let valid_pDoc = document.getElementById('pf_item_insurence_id') as HTMLSpanElement;
        // valid_pDoc.innerText = "Please add atleast 1 asset deatils";
        valid_pDoc.style.display = 'block';
      }
      if (this.propertyDetailsItems.length == 0) {
        let valid_pDoc = document.getElementById('pd_item_validation_id_atleastOne') as HTMLSpanElement;
        valid_pDoc.innerText = "Please add atleast 1 asset deatils";
        valid_pDoc.style.display = 'block';
      }
      if (this.propertyImages.length == 0) {
        let valid_pImages = document.getElementById('pimage_item_validation_id') as HTMLSpanElement;
        valid_pImages.innerText = "Please add atleast 1 image for this asset";
        valid_pImages.style.display = 'block';
      }
      if (this.assetFeatures.length == 0) {
        let valid_pImages = document.getElementById('asset_features_validation_id') as HTMLSpanElement;
        valid_pImages.innerText = "Please add atleast 1 asset features";
        valid_pImages.style.display = 'block';
      }                          
      return false;
    }

  }

  promptStep1() {
    this.currentFormPage = 1;
   
  }

  submitModal() {
    let formTwoValidated = this.promptIfErrorFormTwo();
    console.log(this.stepTwoForm.invalid && this.isFormTwoSubmitted);
    if (formTwoValidated) {
      let modalItem: ApiModal = {
        title: 'Confirm Submission',
        content: 'Are you sure you want to submit this form? Make sure all the required fields are filled correctly.',
        status: true,
        call: () => {
          this.submitProperty();
        }
      } as ApiModal
      this.dataService.modalUpdater(ModalTypes.CONFIRM_API).next(modalItem);
    }
  }

  submitProperty() {
    let formTwoValidated = this.promptIfErrorFormTwo();
    if (formTwoValidated) {
      this.isPageLoader = true;
      const payload = this.getAddPropertyAPIJSON();
      console.log("Submitting Asset Payload:", payload);
      this.httpService.addProperty(payload).then(
        (response: any) => {
          if (response && (response.response === "Success" || response.success)) {
            let modalItem: ApiModal = {
              title: 'Asset Addition Successful',
              content: 'The asset has been successfully added. Please visit the listing page to check its availability.',
              status: true,
              router: 'Property'
            } as ApiModal
            this.dataService.modalUpdater(ModalTypes.SUCCESS_API).next(modalItem);
            this.isPageLoader = false;
            this.resetForms();
          } else {
            let modalItem: ApiModal = {
              title: 'Error',
              content: response.response || response.message || "Unknown error occurred",
              status: true,
              router: ''
            } as ApiModal
            this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
            this.isPageLoader = false;
          }
        },
        (error) => {
          let modalItem: ApiModal = {
            title: 'Asset Addition Failed',
            content: error,
            status: true,
            router: ''
          } as ApiModal
          this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
          this.isPageLoader = false;
        }
      );
    }
  }

  resetForms() {
    this.stepOneForm.reset();
    this.stepTwoForm.reset();
    this.propertyDetailsItems = [] as PropertyInfo;
    this.propertyFeaturesItems = [] as PropertyInfo;
    this.yearlyInvestementDetails = [] as YearlyInvestmentDetailsItem[];
    this.propertyImages = [] as FileStructApi[];
    this.propertyDocuments = [] as PropertyDocuments[];
    this.propertyCurrentDocuments = [] as FileStructApi[];
    this.isFormOneSubmitted = false;
    this.isFormTwoSubmitted = false;
  }

  getAddPropertyAPIJSON(): AddPropertyAPI {
    let propertyInfo: AddPropertyAPI = {} as AddPropertyAPI;

    // let yearlyInvestementDetailsAPI: any = {};
    // this.yearlyInvestementDetails.forEach((item, index) => {
    //   yearlyInvestementDetailsAPI[`year${index + 1}`] = {
    //     Year: item.year,
    //     expectedAppreciation: item.appreciation,
    //     expectedRental: item.rental,
    //     expectedReturns: item.return
    //   }
    // });

    let propertyDetailsObject: any = {};
    this.propertyDetailsItems.forEach(element => {
      propertyDetailsObject[element.title] = element.subtitle;
    });

    let propertyFeaturesObject: any = {};
    this.propertyFeaturesItems.forEach(element => {
      propertyFeaturesObject[element.title] = element.subtitle;
    });

    const invoiceAttributes: InvoiceAttributesStruct[] = [];

    this.intialInvoiceDetailsItems.forEach((item: any) => {
      const invoiceDetail: InvoiceAttributeItemStruct = {
        invoice_name: item.invoice_name,
        invoice_price: item.invoice_price,
        is_percentage: item.is_percentage,
        wallet: item.wallet,
        bank_account: item.bank_account
      };

      let invoiceAttributesItem: InvoiceAttributesStruct | undefined = invoiceAttributes.find
        (attr => attr.sale_type === item.sale_type && attr.trade_type === item.trade_type);

      if (!invoiceAttributesItem) {
        invoiceAttributesItem = {
          sale_type: item.sale_type,
          trade_type: item.trade_type,
          invoice_details: []
        };
        invoiceAttributes.push(invoiceAttributesItem);
      }

      invoiceAttributesItem.invoice_details.push(invoiceDetail);
    });

    // console.log(invoiceAttributes);
    propertyInfo.staff_id = this.dataService.staffIdSubject.value;
    propertyInfo.asset_name = this.stepOneForm.controls['assetName'].value;
    // propertyInfo.account_details[0].account_id = this.stepOneForm.controls['escrowIdName'].value;
    // propertyInfo.account_details[0].account_email = this.stepOneForm.controls['escrowIdEmail'].value;
    propertyInfo.asset_description = this.stepOneForm.controls['assetDescriptionName'].value;
    propertyInfo.listing_date = this.datePipe.transform(this.stepOneForm.controls['assetListingDateName'].value, 'yyyy-MM-dd HH:mm:ss') ?? '';
    propertyInfo.total_tokens = Number(this.stepOneForm.controls['totalSharesName'].value);
    propertyInfo.limit_per_share = Number(this.stepOneForm.controls['limitPerShareName'].value);
    propertyInfo.asset_price = Number(this.stepOneForm.controls['assetPriceName'].value);
    propertyInfo.price_per_token = Number(this.stepOneForm.controls['pricePerShareName'].value);
    propertyInfo.mileage = Number(this.stepOneForm.controls['milage'].value);
    propertyInfo.high_performance_engine_in_cc = Number(this.stepOneForm.controls['highPerformanceEngine'].value);
    // Robust Mapping for required IDs with fallbacks
    propertyInfo.fk_asset_type_id = this.assetTypes?.find((item: any) => item.asset_type_value === this.stepOneForm.controls['assetTypeName'].value)?.asset_type_id || 1;
    propertyInfo.fk_asset_category_id = this.assetsCategories?.find((item: any) => item.asset_catagory_value === this.stepOneForm.controls['assetCategoryName'].value)?.asset_catagory_id || 1;
    propertyInfo.fk_ownership_type_id = this.assetsOwnersType?.find((item: any) => item.ownership_value === this.stepOneForm.controls['OwnershipType'].value)?.ownership_id || 1;
    propertyInfo.fk_a_transmisson_id = this.assetsTransmissionType?.find((item: any) => item.transmission_value === this.stepOneForm.controls['transmissionType'].value)?.transmission_id || 1;
    propertyInfo.fk_a_class_id = this.assetsClassType?.find((item: any) => item.class_name === this.stepTwoForm.controls['classType'].value || item.class_value === this.stepTwoForm.controls['classType'].value)?.class_id || 1;
    propertyInfo.fk_fuel_id = this.assetsFuelTypes?.find((item: any) => item.fuel_type_value === this.stepTwoForm.controls['assetFuel'].value)?.fuel_type_id || 1;

    console.log("Resolved IDs for Add Asset:", {
      type: propertyInfo.fk_asset_type_id,
      category: propertyInfo.fk_asset_category_id,
      transmission: propertyInfo.fk_a_transmisson_id,
      class: propertyInfo.fk_a_class_id,
      fuel: propertyInfo.fk_fuel_id
    });

    propertyInfo.credit_hour_per_token = Number(this.stepOneForm.controls['creditHourPerToken'].value);
    // Map IDs for Location and Brand using .find()
    const selectedCity = this.stepOneForm.controls['cityName'].value;
    const selectedLocation = this.stepOneForm.controls['locationName'].value;
    const selectedBrand = this.stepOneForm.controls['brandType'].value;
    const selectedSubBrand = this.stepOneForm.controls['subBrandType'].value;

    if (this.cityDetails) {
      const city = this.cityDetails.find((c: any) => c.label === selectedCity);
      if (city && city.child_locations) {
        const loc = city.child_locations.find((l: any) => l.label === selectedLocation);
        if (loc) {
          propertyInfo.location_id = loc.location_id;
        }
      }
    }

    if (this.assetsBrands) {
      const brand = this.assetsBrands.find((b: any) => b.label === selectedBrand);
      if (brand && brand.child_brands) {
        const subBrand = brand.child_brands.find((sb: any) => sb.label === selectedSubBrand);
        if (subBrand) {
          propertyInfo.fk_brand_id = subBrand.brand_id;
        }
      }
    }
    // propertyType and other redundant assignments removed to prevent overwriting fix
    propertyInfo.asset_features = this.assetFeatures;
    propertyInfo.is_air_condition = Number(this.stepTwoForm.controls['airConditionType'].value);
    propertyInfo.base_currency_id = Number(this.stepOneForm.controls['currencyTypeName'].value);
    propertyInfo.active = 1; // Ensure new assets are active
    let ownerType = this.assetsOwnersType?.find((option: any) => option.ownership_value === this.stepOneForm.controls['OwnershipType'].value);
    let transType = this.assetsTransmissionType?.find((option: any) => option.transmission_value === this.stepOneForm.controls['transmissionType'].value);
    let classType = this.assetsClassType?.find((option: any) => option.class_name === this.stepTwoForm.controls['classType'].value || option.class_value === this.stepTwoForm.controls['classType'].value);
  //  let airType = this.assetsAirConditionerType.find((option:any) => option.id ===  Number(this.stepTwoForm.controls['airConditionType'].value));
   let airType = this.assetsAirConditionerType.find(
    (item: any) => item.id === Number(this.stepTwoForm.controls['airConditionType'].value)
  );
    let detailsArr = [
        {
          "title": "History",
          "content": [
              {
                  "Company": this.stepTwoForm.controls['company'].value
              },
              {
                  "Corporate History": {
                      "para_1": this.stepTwoForm.controls['corporatePara1'].value,
                      "para_2": this.stepTwoForm.controls['corporatePara2'].value
                  }
              }
          ],
          "subtitle":  this.stepTwoForm.controls['historySubTitle'].value
      }, 
      {
        "title": "Last Service",
        "content": {
            "date": this.stepTwoForm.controls['lastServiceDate'].value,
            "kilometer": this.stepTwoForm.controls['lastServiceContent'].value + " KM"
        },
        "subtitle": ""
    },
    {
      "title": "Owner",
      "content":  ownerType ? ownerType.ownership_value : '',
      "subtitle": ""
  },
  {
      "title": "Transmission",
      "content": transType ? transType.transmission_value : '',
      "subtitle": ""
  },
  {
      "title": "Insurance",
      "content": {
          "date": this.stepTwoForm.controls['insurenceDate'].value,
          "content_1": this.stepTwoForm.controls['insurenceContent'].value
      },
      "subtitle": ""
  },
  {
      "title": "Class",
      "content": classType ? classType.class_name : '',
      "subtitle": ""
  },
  {
      "title": "Air Condition",
      "content": airType ? airType.text : '',
      "subtitle": ""
  }
      
    ];
  //   propertyInfo.asset_details = [
  //       {
  //         "title": "History",
  //         "content": [
  //             {
  //                 "Company": "Founded in 2017 and headquartered in Mumbai, InCred Financial Services Ltd is a privately held NBFC that leverages technology and data science to provide lending services to individuals and SMEs."
  //             },
  //             {
  //                 "Corporate History": {
  //                     "para_1": "In 2016, InCred acquired Visu Leasing and Finance Pvt Ltd (originally incorporated in Jan '91) and changed its name to reflect the InCred brand.",
  //                     "para_2": "In FY '21, the Company announced a merger with KKR India Financial Services - which is in the business of providing structured funding, promoter financing, and mezzanine financing. The current InCred Financial Services Ltd refers to the merged entity"
  //                 }
  //             }
  //         ],
  //         "subtitle": "Non Accidental"
  //     },
  //     {
  //         "title": "Kilometer Driven",
  //         "content": "11,271KM",
  //         "subtitle": ""
  //     },
  //     {
  //         "title": "Last Service",
  //         "content": {
  //             "date": "11 SEP 2023",
  //             "kilometer": "111123 KM"
  //         },
  //         "subtitle": ""
  //     },
  //     {
  //         "title": "Registration",
  //         "content": "KA 05 KB 5989",
  //         "subtitle": ""
  //     },
  //     {
  //         "title": "Owner",
  //         "content": "1st Owner",
  //         "subtitle": ""
  //     },
  //     {
  //         "title": "Transmission",
  //         "content": "Manual",
  //         "subtitle": ""
  //     },
  //     {
  //         "title": "Insurance",
  //         "content": {
  //             "date": "Valid upto DEC 2023",
  //             "content_1": " Zero depreciation"
  //         },
  //         "subtitle": ""
  //     },
  //     {
  //         "title": "Class",
  //         "content": "Premium",
  //         "subtitle": ""
  //     },
  //     {
  //         "title": "Air Condition",
  //         "content": "Yes",
  //         "subtitle": ""
  //     }
  // ]
 propertyInfo.asset_details = [
      ...detailsArr,
      ...this.propertyDetailsItems
    ]; 
    propertyInfo.asset_images = this.propertyImages;
    propertyInfo.addtional_charges = this.getValidInvoiceStructure(this.invoiceDetailsItems);
    let obj = {
      "account_id": this.stepOneForm.controls['escrowIdName'].value,
      "account_email": this.stepOneForm.controls['escrowIdEmail'].value,
    }
    propertyInfo.account_details = [obj];
    propertyInfo.active = 1;
    return propertyInfo;
  }

  getUpdatePropertyAPIJSON(): UpdatePropertyAPI {
    let propertyInfo: UpdatePropertyAPI = {} as UpdatePropertyAPI;

    let propertyDetailsObject: any = {};
    // this.propertyDetailsItems.forEach(element => {
    //   propertyDetailsObject[element.title] = element.subtitle;
    // });

    let propertyFeaturesObject: any = {};
    this.propertyFeaturesItems.forEach(element => {
      propertyFeaturesObject[element.title] = element.subtitle;
    });
    propertyInfo.asset_id = this.propertyId;
    propertyInfo.asset_name = this.stepOneForm.controls['assetName'].value;
    // propertyInfo.account_details[0].account_id = this.stepOneForm.controls['escrowIdName'].value;
    // propertyInfo.account_details[0].account_email = this.stepOneForm.controls['escrowIdEmail'].value;
    propertyInfo.asset_description = this.stepOneForm.controls['assetDescriptionName'].value;
    propertyInfo.listing_date = this.datePipe.transform(this.stepOneForm.controls['assetListingDateName'].value, 'yyyy-MM-dd HH:mm:ss') ?? '';
    propertyInfo.total_tokens = Number(this.stepOneForm.controls['totalSharesName'].value);
    propertyInfo.limit_per_share = Number(this.stepOneForm.controls['limitPerShareName'].value);
    propertyInfo.asset_price = Number(this.stepOneForm.controls['assetPriceName'].value);
    propertyInfo.price_per_token = Number(this.stepOneForm.controls['pricePerShareName'].value);
    propertyInfo.mileage = Number(this.stepOneForm.controls['milage'].value);
    propertyInfo.high_performance_engine_in_cc = Number(this.stepOneForm.controls['highPerformanceEngine'].value);
    // Robust Mapping for required IDs with fallbacks (Update)
    propertyInfo.fk_asset_type_id = this.assetTypes?.find((item: any) => item.asset_type_value === this.stepOneForm.controls['assetTypeName'].value)?.asset_type_id || 1;
    propertyInfo.fk_asset_category_id = this.assetsCategories?.find((item: any) => item.asset_catagory_value === this.stepOneForm.controls['assetCategoryName'].value)?.asset_catagory_id || 1;
    propertyInfo.fk_ownership_type_id = this.assetsOwnersType?.find((item: any) => item.ownership_value === this.stepOneForm.controls['OwnershipType'].value)?.ownership_id || 1;
    propertyInfo.fk_a_transmisson_id = this.assetsTransmissionType?.find((item: any) => item.transmission_value === this.stepOneForm.controls['transmissionType'].value)?.transmission_id || 1;
    propertyInfo.fk_a_class_id = this.assetsClassType?.find((item: any) => item.class_name === this.stepTwoForm.controls['classType'].value || item.class_value === this.stepTwoForm.controls['classType'].value)?.class_id || 1;
    propertyInfo.fk_fuel_id = this.assetsFuelTypes?.find((item: any) => item.fuel_type_value === this.stepTwoForm.controls['assetFuel'].value)?.fuel_type_id || 1;

    propertyInfo.credit_hour_per_token = Number(this.stepOneForm.controls['creditHourPerToken'].value);
    // Robust mapping for Update Location and Brand using .find()
    const updCityLabel = this.stepOneForm.controls['cityName'].value;
    const updLocLabel = this.stepOneForm.controls['locationName'].value;
    const updBrandLabel = this.stepOneForm.controls['brandType'].value;
    const updSubBrandLabel = this.stepOneForm.controls['subBrandType'].value;

    if (this.cityDetails) {
      const city = this.cityDetails.find((c: any) => c.label === updCityLabel);
      if (city && city.child_locations) {
        const loc = city.child_locations.find((l: any) => l.label === updLocLabel);
        if (loc) {
          propertyInfo.location_id = loc.location_id;
        }
      }
    }

    if (this.assetsBrands) {
      const brand = this.assetsBrands.find((b: any) => b.label === updBrandLabel);
      if (brand && brand.child_brands) {
        const subBrand = brand.child_brands.find((sb: any) => sb.label === updSubBrandLabel);
        if (subBrand) {
          propertyInfo.fk_brand_id = subBrand.brand_id;
        }
      }
    }
    // Update cleanup
    propertyInfo.asset_features = this.assetFeatures;
    propertyInfo.is_air_condition = Number(this.stepTwoForm.controls['airConditionType'].value);
    propertyInfo.base_currency_id = Number(this.stepOneForm.controls['currencyTypeName'].value);
    propertyInfo.active = 1; 
    let ownerType = this.assetsOwnersType?.find((option: any) => option.ownership_value === this.stepOneForm.controls['OwnershipType'].value);
    let transType = this.assetsTransmissionType?.find((option: any) => option.transmission_value === this.stepOneForm.controls['transmissionType'].value);
    let classType = this.assetsClassType?.find((option: any) => option.class_name === this.stepTwoForm.controls['classType'].value || option.class_value === this.stepTwoForm.controls['classType'].value);
  //  let airType = this.assetsAirConditionerType.find((option:any) => option.id ===  Number(this.stepTwoForm.controls['airConditionType'].value));
   let airType = this.assetsAirConditionerType.find(
    (item: any) => item.id === Number(this.stepTwoForm.controls['airConditionType'].value)
  );
    let detailsArr = [
        {
          "title": "History",
          "content": [
              {
                  "Company": this.stepTwoForm.controls['company'].value
              },
              {
                  "Corporate History": {
                      "para_1": this.stepTwoForm.controls['corporatePara1'].value,
                      "para_2": this.stepTwoForm.controls['corporatePara2'].value
                  }
              }
          ],
          "subtitle":  this.stepTwoForm.controls['historySubTitle'].value
      }, 
      {
        "title": "Last Service",
        "content": {
            "date": this.stepTwoForm.controls['lastServiceDate'].value,
            "kilometer": this.stepTwoForm.controls['lastServiceContent'].value
        },
        "subtitle": ""
    },
    {
      "title": "Owner",
      "content":  ownerType ? ownerType.ownership_value : '',
      "subtitle": ""
  },
  {
      "title": "Transmission",
      "content": transType ? transType.transmission_value : '',
      "subtitle": ""
  },
  {
      "title": "Insurance",
      "content": {
          "date": this.stepTwoForm.controls['insurenceDate'].value,
          "content_1": this.stepTwoForm.controls['insurenceContent'].value
      },
      "subtitle": ""
  },
  {
      "title": "Class",
      "content": classType ? classType.class_name : '',
      "subtitle": ""
  },
  {
      "title": "Air Condition",
      "content": airType ? airType.text : '',
      "subtitle": ""
  }
      
    ];
    propertyInfo.asset_details = [
      ...detailsArr,
      ...this.propertyDetailsItems
    ]; 
    propertyInfo.asset_images = this.propertyImagesOriginalStruct;
    propertyInfo.addtional_charges = this.getValidInvoiceStructure(this.invoiceDetailsItems);
    let obj = {
      "account_id": this.stepOneForm.controls['escrowIdName'].value,
      "account_email": this.stepOneForm.controls['escrowIdEmail'].value,
    }
    propertyInfo.account_details = [obj];
    propertyInfo.active = 1;
    return propertyInfo;
  }

  // transformDate(selectedDate: string) {
  //   const currentTime = new Date();
  //   const formattedDatePart = this.datePipe.transform(selectedDate, 'yyyy-MM-dd');
  //   const formattedDateTime = formattedDatePart + ' ' + currentTime.toTimeString().slice(0, 8);
  //   const formattedResult = this.datePipe.transform(formattedDateTime, 'yyyy-MM-dd HH:mm:ss');
  //   return formattedResult
  // }

  addPropertyDetails() {
    let propertyDetailsItem: PropertyInfoItem = {} as PropertyInfoItem;
    let validationComponent: HTMLSpanElement = document.getElementById('pd_item_validation_id') as HTMLSpanElement;
    let propertyDetailsTitleWithoutWhitespace = (this.stepTwoForm.controls['assetDetailsTitleName'].value ?? '').trim();
    let propertyDetailsSubtitleNameWithoutWhitespace = (this.stepTwoForm.controls['assetDetailsSubtitleName'].value ?? '').trim();
    let titleStrippedStr = /^(["'])\s*\1$/.test(propertyDetailsTitleWithoutWhitespace);
    let subtitleStrippedStr = /^(["'])\s*\1$/.test(propertyDetailsSubtitleNameWithoutWhitespace);
    if (((propertyDetailsTitleWithoutWhitespace != "" && propertyDetailsSubtitleNameWithoutWhitespace != ""  && !titleStrippedStr && !subtitleStrippedStr))) {
      validationComponent.style.display = "none";
      propertyDetailsItem.title = this.stepTwoForm.controls['assetDetailsTitleName'].value;
      propertyDetailsItem.content = this.stepTwoForm.controls['assetDetailsSubtitleName'].value;
      propertyDetailsItem.subtitle = "";
      if(propertyDetailsItem.title == "Kilometer Driven"){
        propertyDetailsItem.content = propertyDetailsItem.content + 'KM';
      }
      this.propertyDetailsItems.push(propertyDetailsItem);
      this.stepTwoForm.controls['assetDetailsTitleName'].reset();
      this.stepTwoForm.controls['assetDetailsSubtitleName'].reset();
    } else {
      validationComponent.style.display = "block";
      validationComponent.innerText = "Please fill both title and subtitle fields";
    }
  }

  onChangeRemoveValidationById(id: string) {
    let validationComponent: HTMLBodyElement = document.getElementById(id) as HTMLBodyElement;
    validationComponent.style.display = "none";
    // validationComponent.innerText = "";
  }
  preventNonNumericInput(event: KeyboardEvent): void {
    if (event.key === 'e' || event.key === 'E' || event.key === '+' || event.key === '-') {
      event.preventDefault();
    }
  }
  removePropertyDetails(itemIndex: number) {
    this.propertyDetailsItems = this.propertyDetailsItems.filter((_, index) => index !== itemIndex);
  }

  loadPropertyDetailsData(index: number) {
    this.stepOneForm.controls['propertyDetailsTitleName'].setValue(this.propertyDetailsItems[index].title);
    this.stepOneForm.controls['propertyDetailsSubtitleName'].setValue(this.propertyDetailsItems[index].subtitle);
    this.indexPropertyDocumentsOriginalStruct = index;
  }

  addPropertyFeatures() {
    let propertyFeaturesItem: AssetInfoItem = {} as AssetInfoItem;
    let validationComponent: HTMLSpanElement = document.getElementById('pf_item_validation_id') as HTMLSpanElement;

    if ((this.stepTwoForm.controls['assetDetailsTitleName'].value != "" && this.stepTwoForm.controls['assetDetailsContentName'].value != "")
    && (this.stepTwoForm.controls['assetDetailsTitleName'].value != null && this.stepTwoForm.controls['assetDetailsContentName'].value != null) && (this.stepTwoForm.controls['assetDetailsSubContentName'].value != null && this.stepTwoForm.controls['assetDetailsSubContentName'].value != null)) {
      propertyFeaturesItem.title = this.stepTwoForm.controls['assetDetailsTitleName'].value;
      propertyFeaturesItem.content = (this.stepTwoForm.controls['assetDetailsContentName'].value).replace(/"/g, '\\"');
      propertyFeaturesItem.subContent = (this.stepTwoForm.controls['assetDetailsSubContentName'].value).replace(/"/g, '\\"');
      this.assetFeaturesItems.push(propertyFeaturesItem);
      this.stepTwoForm.controls['assetDetailsTitleName'].reset();
      this.stepTwoForm.controls['assetDetailsContentName'].reset();
      this.stepTwoForm.controls['assetDetailsSubContentName'].reset();
    } else {
      validationComponent.style.display = "block";
      validationComponent.innerText = "Please fill both title and description fields";
    }
  }

  removePropertyFeatures(itemIndex: number) {
    this.propertyFeaturesItems = this.propertyFeaturesItems.filter((_, index) => index !== itemIndex);
  }


  loadPropertyFeatureData(item: AssetInfoItem) {
    this.stepTwoForm.controls['assetFeaturesTitleName'].setValue(item.title);
    this.stepTwoForm.controls['assetDetailsContentName'].setValue(item.content);
    this.stepTwoForm.controls['assetDetailsSubContentName'].setValue(item.subContent);
  }

  loadYIDdata(item: YearlyInvestmentDetailsItem) {
    this.stepTwoForm.controls['yearlyInvestmentYearsName'].setValue(item.year);
    this.stepTwoForm.controls['yearlyAppreciationName'].setValue(item.appreciation);
    this.stepTwoForm.controls['yearlyRentalName'].setValue(item.rental);
    this.stepTwoForm.controls['yearlyReturnName'].setValue(item.return);
  }


  addYearlyInvestmentDetails() {
    let yearlyInvestementDetailsItem: YearlyInvestmentDetailsItem = {} as YearlyInvestmentDetailsItem;
    let validationComponent: HTMLSpanElement = document.getElementById('yid_item_validation_id') as HTMLSpanElement;

    if ( this.stepTwoForm.controls['yearlyInvestmentYearsName'].value != null
    && this.stepTwoForm.controls['yearlyAppreciationName'].value != null
    && this.stepTwoForm.controls['yearlyRentalName'].value != null
    && this.stepTwoForm.controls['yearlyReturnName'].value != null
      && this.stepTwoForm.controls['yearlyInvestmentYearsName'].value.toString() != ""
      && this.stepTwoForm.controls['yearlyAppreciationName'].value.toString() != ""
      && this.stepTwoForm.controls['yearlyRentalName'].value.toString() != ""
      && this.stepTwoForm.controls['yearlyReturnName'].value.toString() != ""
    ) {
      yearlyInvestementDetailsItem.year = this.stepTwoForm.controls['yearlyInvestmentYearsName'].value;
      yearlyInvestementDetailsItem.appreciation = this.stepTwoForm.controls['yearlyAppreciationName'].value;
      yearlyInvestementDetailsItem.rental = this.stepTwoForm.controls['yearlyRentalName'].value;
      yearlyInvestementDetailsItem.return = this.stepTwoForm.controls['yearlyReturnName'].value;
      var count = 0;
      this.yearlyInvestementDetails.forEach(function (value, key) {
        if (value.year == yearlyInvestementDetailsItem.year) {
          count = count + 1;
        }
      });
      if (count == 0) {
        validationComponent.style.display = "none";
        this.yearlyInvestementDetails.push(yearlyInvestementDetailsItem);
        this.stepTwoForm.controls['yearlyInvestmentYearsName'].reset();
        this.stepTwoForm.controls['yearlyAppreciationName'].reset();
        this.stepTwoForm.controls['yearlyRentalName'].reset();
        this.stepTwoForm.controls['yearlyReturnName'].reset();
      } else {
        validationComponent.style.display = "block";
        validationComponent.innerText = "This year already exists";
        // }
      }
    } else {
      validationComponent.style.display = "block";
      validationComponent.innerText = "Please fill all the required fields";
    }
  }

  removeYearlyInvestmentDetails(itemIndex: number) {
    this.yearlyInvestementDetails = this.yearlyInvestementDetails.filter((_, index) => index !== itemIndex);
  }


  onDragOverFile(event: DragEvent) {
    event.preventDefault();
  }

  async onDropFile(event: DragEvent, type: string) {
    event.preventDefault();
    const files = event.dataTransfer?.files;

    switch (type) {
      case "P_IMAGES":
        if (files != undefined) {
          this.onChangeRemoveValidationById('pimage_item_validation_id');
          for (let itemIndex = 0; itemIndex < files.length; itemIndex++) {
            const element = files[itemIndex];
            if (element.size <= this.maxFileSize) {
              let putItem: FileStructApi = {
                base64: await this.createObjectURL(element),
                extension: element.type.split('/')[1],
                file_type: element.type,
              } as FileStructApi;
              this.propertyImages.push(putItem);
              this.propertyImagesOriginalStruct.push(putItem as any);
            } else {
              (document.getElementById('pimage_item_validation_id') as HTMLSpanElement).style.display = "block";
              (document.getElementById('pimage_item_validation_id') as HTMLSpanElement).innerText = "File size exceeds 5mb";
            }
          }
        }
        break;

      case "B_LOGO":
        this.builderLogo = {} as FileStructApi;
        this.builderLogoOriginalStruct = {} as FileStructApi;
        if (files != undefined) {
          this.onChangeRemoveValidationById('builder_item_validation_id');
          // for (let itemIndex = 0; itemIndex < files.length; itemIndex++) {
          const element = files[0];
          if (element.size <= this.maxFileSize) {
            let putItem: FileStructApi = {
              base64: await this.createObjectURL(element),
              extension: element.type.split('/')[1],
              file_type: element.type,
            } as FileStructApi;
            this.builderLogo = putItem;
            this.builderLogoOriginalStruct = putItem;
          } else {
            (document.getElementById('builder_item_validation_id') as HTMLSpanElement).style.display = "block";
            (document.getElementById('builder_item_validation_id') as HTMLSpanElement).innerText = "File size exceeds 5mb";
          }
          // }
        }
        break;

      case "P_DOCS":
        if (files != undefined) {
          this.onChangeRemoveValidationById('pdoc_item_validation_id');
          for (let itemIndex = 0; itemIndex < files.length; itemIndex++) {
            const element = files[itemIndex];
            if (element.size <= this.maxFileSize) {
              let putItem: FileStructApi = {
                base64: await this.createObjectURL(element),
                extension: element.type.split('/')[1],
                file_type: element.type,
                name: element.name
              } as FileStructApi;
              this.propertyCurrentDocuments.push(putItem);
              this.propertyDocumentsOriginalStruct[this.indexPropertyDocumentsOriginalStruct].push(putItem as any);
            } else {
              (document.getElementById('pdoc_item_validation_id') as HTMLSpanElement).style.display = "block";
              (document.getElementById('pdoc_item_validation_id') as HTMLSpanElement).innerText = "File size exceeds 5mb";
            }
          }
        }
        break;

      default:
        break;
    }
  }

  async onFileSelected(event: Event, type: string) {
    const input = event.target as HTMLInputElement;
    const files: any = input.files;

    switch (type) {
      case "P_IMAGES":
        this.onChangeRemoveValidationById('pimage_item_validation_id');
        if (files != undefined) {
          for (let itemIndex = 0; itemIndex < files.length; itemIndex++) {
            const element = files[itemIndex];
            if (element.size <= this.maxFileSize) {
              let putItem: FileStructApi = {
                base64: await this.createObjectURL(element),
                extension: element.type.split('/')[1],
                file_type: element.type,
              } as FileStructApi;
              this.propertyImages.push(putItem);
              this.propertyImagesOriginalStruct.push(putItem as any);
            } else {
              (document.getElementById('pimage_item_validation_id') as HTMLSpanElement).style.display = "block";
              (document.getElementById('pimage_item_validation_id') as HTMLSpanElement).innerText = "File size exceeds 5mb";
            }
          }
        }
        break;

      case "B_LOGO":
        if (files != undefined) {
          this.onChangeRemoveValidationById('builder_item_validation_id');
          for (let itemIndex = 0; itemIndex < files.length; itemIndex++) {
            const element = files[itemIndex];
            if (element.size <= this.maxFileSize) {
              let putItem: FileStructApi = {
                base64: await this.createObjectURL(element),
                extension: element.type.split('/')[1],
                file_type: element.type,
              } as FileStructApi;
              this.builderLogo = putItem;
              this.builderLogoOriginalStruct = putItem;
            } else {
              (document.getElementById('builder_item_validation_id') as HTMLSpanElement).style.display = "block";
              (document.getElementById('builder_item_validation_id') as HTMLSpanElement).innerText = "File size exceeds 5mb";
            }
          }
        }
        break;

      case "P_DOCS":
        this.onChangeRemoveValidationById('pdoc_item_validation_id');
        if (files !== undefined) {
          for (let itemIndex = 0; itemIndex < files.length; itemIndex++) {
            const element = files[itemIndex];
            if (element.size <= this.maxFileSize) {
              const putItem: FileStructApi = {
                base64: await this.createObjectURL(element),
                extension: element.type.split('/')[1],
                file_type: element.type,
                name: element.name
              };
              this.propertyCurrentDocuments.push(putItem);
              if (!this.propertyDocumentsOriginalStruct[this.indexPropertyDocumentsOriginalStruct]) {
                this.propertyDocumentsOriginalStruct[this.indexPropertyDocumentsOriginalStruct] = [];
              }
              this.propertyDocumentsOriginalStruct[this.indexPropertyDocumentsOriginalStruct].push(putItem as any);
            } else {
              const pdocItemValidation = document.getElementById('pdoc_item_validation_id') as HTMLSpanElement;
              pdocItemValidation.style.display = 'block';
              pdocItemValidation.innerText = 'File size exceeds 5mb';
            }
          }
        }
        break;

      default:
        break;
    }
  }

  async createObjectURL(file: File): Promise<string> {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve) => {
      reader.onload = () => {
        resolve(reader.result as string);
      };
    });
  }

  removePropertyImages(itemIndex: number) {
    this.propertyImages = this.propertyImages.filter((_, index) => index !== itemIndex);
    this.propertyImagesOriginalStruct = (this.propertyImagesOriginalStruct as any[]).filter((_, index) => index !== itemIndex);
  }
  removeBuilderLogo() {

  }

  removeCurrentDocImages(itemIndex: number) {
    this.propertyCurrentDocuments = this.propertyCurrentDocuments.filter((_, index) => index !== itemIndex);
    this.propertyDocumentsOriginalStruct[this.indexPropertyDocumentsOriginalStruct] = (this.propertyDocumentsOriginalStruct[this.indexPropertyDocumentsOriginalStruct] as any[]).filter((_, index) => index !== itemIndex);
  }

  removePropertyDoc(itemIndex: number) {
    this.propertyDocuments = this.propertyDocuments.filter((_, index) => index !== itemIndex);
    this.propertyDocumentsOriginalStruct = (this.propertyDocumentsOriginalStruct as any[]).filter((_, index) => index !== itemIndex);
  }

  getBuilderImageUrl(): string {
    let builderItem: BuildersInfo | null = this.buildersDetails.find((value) => value.builder_name == this.stepTwoForm.controls['builderName'].value) ?? null;
    if (builderItem == null) {
      return '';
    } else {
      return builderItem.builder_image;
    }
  }

  loadPropertyDocumentData(index: number) {
    let itemRestrict = JSON.parse(JSON.stringify(this.propertyDocuments[index]));
    this.indexPropertyDocumentsOriginalStruct = -1;
    this.stepTwoForm.controls['propertyDocumentTitleName'].setValue(itemRestrict.title);
    this.stepTwoForm.controls['propertyDocumentDescriptionName'].setValue(itemRestrict.description);
    this.propertyCurrentDocuments = JSON.parse(JSON.stringify(itemRestrict.docs));
  }

  addPropertyDocuments() {
    let propertyDocInstance: PropertyDocuments = {} as PropertyDocuments;
    let validationComponent: HTMLSpanElement = document.getElementById('pdoc_item_validation_id') as HTMLSpanElement;

    if (this.stepTwoForm.controls['propertyDocumentTitleName'].value != ""
      && this.stepTwoForm.controls['propertyDocumentDescriptionName'].value != ""
      && this.propertyCurrentDocuments.length > 0) {
      validationComponent.style.display = "none";
      propertyDocInstance.title = this.stepTwoForm.controls['propertyDocumentTitleName'].value;
      propertyDocInstance.description = (this.stepTwoForm.controls['propertyDocumentDescriptionName'].value).replace(/"/g, '\\"');
      propertyDocInstance.docs = [...JSON.parse(JSON.stringify(this.propertyCurrentDocuments))];
      this.indexPropertyDocumentsOriginalStruct = this.propertyDocuments.length;
      this.propertyDocumentsOriginalStruct[this.indexPropertyDocumentsOriginalStruct] = propertyDocInstance.docs;
      this.propertyDocuments.push(propertyDocInstance);
      this.stepTwoForm.controls['propertyDocumentTitleName'].reset();
      this.stepTwoForm.controls['propertyDocumentDescriptionName'].reset();
      this.propertyCurrentDocuments = [];
    } else {
      validationComponent.style.display = "block";
      validationComponent.innerText = "Please fill the required fields";
    }
  }

  openUrl(url: string, type: string) {
    switch (type) {
      case 'PDF':
        // Create an iframe to embed the PDF
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '100%';

        // Open the PDF in a new tab
        const newTab = window.open();
        newTab?.document.body.appendChild(iframe);
        break;
      case 'IMAGE':
        const image = document.createElement('img');
        image.src = url;
        image.style.width = '100%';
        image.style.height = '100%';

        // Open the image in a new tab
        const newTabImage = window.open();
        newTabImage?.document.body.appendChild(image);
        break;
      default:
        break;
    }




  }

  getSaleStatusAPIJSON(): SaleStatusApi {
    let saleInfo: SaleStatusApi = {} as SaleStatusApi;
    saleInfo.asset_id = this.propertyId;
    saleInfo.sale_status = this.modalForm.value.selectedSaleSatus;
    saleInfo.staff_id = this.dataService.staffIdSubject.value;

    return saleInfo;
  }

  onCancelClick(key: string) {
    switch (key) {
      case 'SALE':
        if (!this.clickedOnupdate) {
          this.modalForm.controls['selectedSaleSatus'].setValue(this.stepTwoForm.value.saleStatusName);
        }
        break;
      case 'SPV':
        if (!this.clickedOnupdate) {
          this.modalForm.controls['selectedSpvSatus'].setValue(this.stepTwoForm.value.spvStatusName);
        }
        break;
      case 'RESALE':
        if (!this.clickedOnupdate) {
          this.modalForm.controls['selectedResaleSatus'].setValue(this.stepTwoForm.value.resaleStatusName);
        }
        break;
      case 'TOKEN':
        if (!this.clickedOnupdate) {
          this.modalForm.controls['selectedNftSatus'].setValue(this.stepTwoForm.value.nftStatusName);
        }
        break;
      default:
        break;
    }
  }

  statusConfirmationModal(key: string) {
    this.clickedOnupdate = true;
    let selectedStatus;
    switch (key) {
      case 'SALE':
        selectedStatus = 'You are about to update the sale status as ' + this.modalForm.value.selectedSaleSatus;
        this.onCancelClick(key);
        break;
      case 'SPV': selectedStatus = 'You are about to update the sale status as ' + this.modalForm.value.selectedSpvSatus;
        this.onCancelClick(key);
        break;
      case 'RESALE': selectedStatus = 'You are about to update the sale status as ' + this.modalForm.value.selectedResaleSatus;
        this.onCancelClick(key);
        break;
      case 'TOKEN': selectedStatus = 'You are about to update the sale status as ' + this.modalForm.value.selectedNftSatus;
        this.onCancelClick(key);
        break;
      default:
        break;
    }
    let modalItem: ApiModal = {
      title: 'Confirm Submission',
      content: selectedStatus,
      status: true,
      call: () => {
        switch (key) {
          case 'SALE': this.updateSaleStatus();
            break;
          case 'SPV': this.updateSpvStatus();
            break;
          case 'RESALE': this.updateResaleStatus();
            break;
          case 'TOKEN': this.updateNftStatus();
            break;
          default:
            break;
        }
      }
    } as ApiModal
    this.dataService.modalUpdater(ModalTypes.CONFIRM_API).next(modalItem);

  }
  updateSaleStatus() {
    console.log("status updated succesfuly");
    this.isPageLoader = true;
    this.httpService.updateSaleStatus(this.getSaleStatusAPIJSON()).then(
      (response) => {
        let modalItem: ApiModal = {
          title: 'Sale Status Updated Successfully',
          content: 'The Sale Status Updated Successfully. Please visit the view asset page to check the Sale Status.',
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.SUCCESS_API).next(modalItem);
        this.stepTwoForm.controls['saleStatusName'].setValue(this.modalForm.value.selectedSaleSatus);
        this.isPageLoader = false;
      },
      (error) => {
        let modalItem: ApiModal = {
          title: 'Sale Status Updation Failed',
          content: error,
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
        this.isPageLoader = false;
      }
    );

  }

  getSpvStatusAPIJSON(): SpvStatusApi {
    let saleInfo: SpvStatusApi = {} as SpvStatusApi;
    saleInfo.asset_id = this.propertyId;
    saleInfo.SPV_status = this.modalForm.value.selectedSpvSatus;
    saleInfo.staff_id = this.dataService.staffIdSubject.value;

    return saleInfo;
  }

  updateSpvStatus() {
    this.isPageLoader = true;
    this.httpService.updateSpvStatus(this.getSpvStatusAPIJSON()).then(
      (response) => {
        let modalItem: ApiModal = {
          title: 'SPV Sale Status Updated Successfully',
          content: 'The SPV Sale Updated Successfully. Please visit the view asset page to check the SPV Sale Status.',
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.SUCCESS_API).next(modalItem);
        this.stepTwoForm.controls['spvStatusName'].setValue(this.modalForm.value.selectedSpvSatus);
        this.isPageLoader = false;
      },
      (error) => {
        let modalItem: ApiModal = {
          title: 'SPV Sale Status Updation Failed',
          content: error,
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
        this.isPageLoader = false;
      }
    );
  }
  getResaleStatusAPIJSON(): ResaleStatusApi {
    let saleInfo: ResaleStatusApi = {} as ResaleStatusApi;
    saleInfo.asset_id = this.propertyId;
    saleInfo.resale_status = this.modalForm.value.selectedResaleSatus;
    saleInfo.staff_id = this.dataService.staffIdSubject.value;

    return saleInfo;
  }
  updateResaleStatus() {
    this.isPageLoader = true;
    this.httpService.updateResaleStatus(this.getResaleStatusAPIJSON()).then(
      (response) => {
        let modalItem: ApiModal = {
          title: 'Resale Status Updated Successfully',
          content: 'The Resale Status Updated Successfully. Please visit the view asset page to check the SPV Sale Status.',
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.SUCCESS_API).next(modalItem);
        this.stepTwoForm.controls['resaleStatusName'].setValue(this.modalForm.value.selectedResaleSatus);
        this.isPageLoader = false;
      },
      (error) => {
        let modalItem: ApiModal = {
          title: 'Resale Status Updation Failed',
          content: error,
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
        this.isPageLoader = false;
      }
    );
  }

  getNftStatusAPIJSON(): NftStatusApi {
    let saleInfo: NftStatusApi = {} as NftStatusApi;
    saleInfo.asset_id = this.propertyId;
    saleInfo.NFT_status = this.modalForm.value.selectedNftSatus;
    saleInfo.ipfs = this.modalForm.value.ipfsValue;
    saleInfo.staff_id = this.dataService.staffIdSubject.value;

    return saleInfo;
  }

  updateNftStatus() {
    this.isPageLoader = true;
    this.httpService.updateNftStatus(this.getNftStatusAPIJSON()).then(
      (response) => {
        let modalItem: ApiModal = {
          title: 'Token Status Updated Successfully',
          content: 'The Token Status Updated Successfully. Please visit the view asset page to check the Token Status.',
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.SUCCESS_API).next(modalItem);
        this.stepTwoForm.controls['nftStatusName'].setValue(this.modalForm.value.selectedNftSatus);
        this.isPageLoader = false;
      },
      (error) => {
        let ref = document.getElementById("onCancelClickNft");
        ref?.click();
        let modalItem: ApiModal = {
          title: 'Token Status Updation Failed',
          content: error,
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
        this.isPageLoader = false;
      }
    );
  }

  syncPropertyPrice() {
    this.stepOneForm.controls['pricePerShareName'].setValue(this.stepOneForm.controls['assetPriceName'].value / this.stepOneForm.controls['totalSharesName'].value, { emitEvent: false });
  }

  submitInvoiceModal() {

  }

  addInvoiceCard() {
    let validationComponent: HTMLSpanElement = document.getElementById('invoice_item_validation_id') as HTMLSpanElement;

    if ((this.modalInvoiceForm.controls['invoiceSaleTypeName'].value != ""
      && this.modalInvoiceForm.controls['invoiceSaleTypeName'].value != null) && (this.modalInvoiceForm.controls['invoiceTradeTypeName'].value != "" && this.modalInvoiceForm.controls['invoiceTradeTypeName'].value != null)
      && (this.modalInvoiceForm.controls['invoiceNameName'].value != "" && this.modalInvoiceForm.controls['invoiceNameName'].value != null) &&
      (this.modalInvoiceForm.controls['invoicePriceName'].value != "" && this.modalInvoiceForm.controls['invoicePriceName'].value != null)) {
      validationComponent.style.display = "none";
      // if (isItemAvailableIndex != -1) {
      //   this.invoiceItems[isItemAvailableIndex].sale_type = this.modalInvoiceForm.controls['invoiceSaleTypeName'].value,
      //     this.invoiceItems[isItemAvailableIndex].trade_type = this.modalInvoiceForm.controls['invoiceTradeTypeName'].value,
      //     this.invoiceItems[isItemAvailableIndex].details.push({
      //       bank_account: this.modalInvoiceForm.controls['invoiceAccountName'].value,
      //       invoice_name: this.modalInvoiceForm.controls['invoiceNameName'].value,
      //       invoice_price: this.modalInvoiceForm.controls['invoicePriceName'].value,
      //       is_percentage: this.invoiceIsPercent,
      //       wallet: this.modalInvoiceForm.controls['invoiceWalletName'].value,
      //     });
      //     this.modalInvoiceForm.reset(); 
      // } else {
      //   this.invoiceItems.push(
      //     {
      //       sale_type: this.modalInvoiceForm.controls['invoiceSaleTypeName'].value,
      //       trade_type: this.modalInvoiceForm.controls['invoiceTradeTypeName'].value,
      //       details: [] as InvoiceAttributeItemStruct[]
      //     }
      //   );
      //   this.invoiceItems[this.invoiceItems.length - 1].details.push({
      //     bank_account: this.modalInvoiceForm.controls['invoiceAccountName'].value,
      //     invoice_name: this.modalInvoiceForm.controls['invoiceNameName'].value,
      //     invoice_price: this.modalInvoiceForm.controls['invoicePriceName'].value,
      //     is_percentage: this.invoiceIsPercent,
      //     wallet: this.modalInvoiceForm.controls['invoiceWalletName'].value,
      //   })
      //   this.modalInvoiceForm.reset(); 
      // }
      // this.getInvoiceCardItems();
      if (this.invoiceIsPercent) {
        if (Number(this.modalInvoiceForm.controls['invoicePriceName'].value) <= 100) {
          this.invoiceDetailsItems.push({
            sale_type: this.modalInvoiceForm.controls['invoiceSaleTypeName'].value,
            trade_type: this.modalInvoiceForm.controls['invoiceTradeTypeName'].value,
            bank_account: this.modalInvoiceForm.controls['invoiceAccountName'].value ? this.modalInvoiceForm.controls['invoiceAccountName'].value : "" ,
            invoice_name: this.modalInvoiceForm.controls['invoiceNameName'].value,
            invoice_price: this.modalInvoiceForm.controls['invoicePriceName'].value,
            is_percentage: this.invoiceIsPercent,
            wallet: this.modalInvoiceForm.controls['invoiceWalletName'].value ? this.modalInvoiceForm.controls['invoiceWalletName'].value:""
          })
          this.modalInvoiceForm.reset();
          this.getPreviousInvoiceCardItems();
        } else {
          validationComponent.style.display = "block";
          validationComponent.innerText = "Price Percentage should be less or equal to 100";
        }
      } else {
        this.invoiceDetailsItems.push({
          sale_type: this.modalInvoiceForm.controls['invoiceSaleTypeName'].value,
          trade_type: this.modalInvoiceForm.controls['invoiceTradeTypeName'].value,
          bank_account: this.modalInvoiceForm.controls['invoiceAccountName'].value ? this.modalInvoiceForm.controls['invoiceAccountName'].value : "" ,
          invoice_name: this.modalInvoiceForm.controls['invoiceNameName'].value,
          invoice_price: this.modalInvoiceForm.controls['invoicePriceName'].value,
          is_percentage: this.invoiceIsPercent,
          wallet: this.modalInvoiceForm.controls['invoiceWalletName'].value ? this.modalInvoiceForm.controls['invoiceWalletName'].value:""
        })
        this.modalInvoiceForm.reset();
        this.getPreviousInvoiceCardItems();
      }
    } else {
      validationComponent.style.display = "block";
      validationComponent.innerText = "Please ensure to fill all the fields to add an invoice item.";
    }
  }
  getInvoiceCardItems() {
    this.invoiceDetailsItems = [];
    if (!this.invoiceItems || !Array.isArray(this.invoiceItems)) return;
    for (let i = 0; i < this.invoiceItems.length; i++) {
      if (this.invoiceItems[i].invoice_details && Array.isArray(this.invoiceItems[i].invoice_details) && this.invoiceItems[i].invoice_details.length != 0) {
        for (let j = 0; j < this.invoiceItems[i].invoice_details.length; j++) {
          this.invoiceDetailsItems.push({
            sale_type: this.invoiceItems[i].sale_type,
            trade_type: this.invoiceItems[i].trade_type,
            bank_account: this.invoiceItems[i].invoice_details[j].bank_account,
            invoice_name: this.invoiceItems[i].invoice_details[j].invoice_name,
            invoice_price: this.invoiceItems[i].invoice_details[j].invoice_price,
            is_percentage: this.invoiceItems[i].invoice_details[j].is_percentage,
            wallet: this.invoiceItems[i].invoice_details[j].wallet
          })
        }
      }
    }
    this.intialInvoiceDetailsItems = this.invoiceDetailsItems;
  }

  getPreviousInvoiceCardItems() {
    this.intialInvoiceDetailsItems = [];
    for (let i = 0; i < this.invoiceItems.length; i++) {
      if (this.invoiceItems[i].invoice_details.length != 0) {
        for (let j = 0; j < this.invoiceItems[i].invoice_details.length; j++) {
          this.intialInvoiceDetailsItems.push({
            sale_type: this.invoiceItems[i].sale_type,
            trade_type: this.invoiceItems[i].trade_type,
            bank_account: this.invoiceItems[i].invoice_details[j].bank_account,
            invoice_name: this.invoiceItems[i].invoice_details[j].invoice_name,
            invoice_price: this.invoiceItems[i].invoice_details[j].invoice_price,
            is_percentage: this.invoiceItems[i].invoice_details[j].is_percentage,
            wallet: this.invoiceItems[i].invoice_details[j].wallet
          })
        }
      }
    }
  }

  getValidInvoiceStructure(items: any[]): InvoiceAttributesStruct[] {
    let invoice_items: InvoiceAttributesStruct[] = [];
    items.forEach(item => {
      let isAvailableIndex = invoice_items.findIndex(elm => elm.sale_type == item.sale_type && elm.trade_type == item.trade_type);
      if (isAvailableIndex == -1) {
        invoice_items.push({
          sale_type: item.sale_type,
          trade_type: item.trade_type,
          invoice_details: [
            {
              bank_account: item.bank_account,
              invoice_name: item.invoice_name,
              invoice_price: item.invoice_price,
              is_percentage: item.is_percentage,
              wallet: item.wallet
            }
          ]
        });
      } else {
        invoice_items[isAvailableIndex].invoice_details.push(
          {
            bank_account: item.bank_account,
            invoice_name: item.invoice_name,
            invoice_price: item.invoice_price,
            is_percentage: item.is_percentage,
            wallet: item.wallet
          }
        );
      }
    });
    return invoice_items;
  }


  loadInvoiceDetailsData(index: number) {
    this.modalInvoiceForm.controls['invoiceSaleTypeName'].setValue(this.invoiceDetailsItems[index].sale_type);
    this.modalInvoiceForm.controls['invoiceTradeTypeName'].setValue(this.invoiceDetailsItems[index].trade_type);
    this.modalInvoiceForm.controls['invoiceNameName'].setValue(this.invoiceDetailsItems[index].invoice_name);
    this.modalInvoiceForm.controls['invoicePriceName'].setValue(this.invoiceDetailsItems[index].invoice_price);
    this.modalInvoiceForm.controls['invoiceAccountName'].setValue(this.invoiceDetailsItems[index].bank_account);
    this.modalInvoiceForm.controls['invoiceWalletName'].setValue(this.invoiceDetailsItems[index].wallet);
    this.invoiceIsPercent = this.invoiceDetailsItems[index].is_percentage;
  }

  removeInvoiceDetails(itemIndex: any, type: string) {
    let items: any = [];
    switch (type) {
      case 'INITIAL':
        items = this.intialInvoiceDetailsItems;
        break;
      case 'MODAL':
        items = this.invoiceDetailsItems;
        break;
    }
    // for (let i = 0; i < this.invoiceItems.length; i++) {
    //   if (this.invoiceItems[i].trade_type === items[itemIndex].trade_type) {
    //     let removeItem = this.invoiceItems[i].details;
    //     removeItem = removeItem.filter((item) => {
    //       return (
    //         item.bank_account !== items[itemIndex].bank_account &&
    //         item.invoice_name !== items[itemIndex].invoice_name &&
    //         item.invoice_price !== items[itemIndex].invoice_price &&
    //         item.wallet !== items[itemIndex].wallet
    //       );

    //     });
    //     this.invoiceItems[i].details = removeItem;
    //   }
    // }
    items = items.filter((_: any, index: any) => index !== itemIndex);
    if (type == 'MODAL') {
      this.invoiceDetailsItems = items;
    } else if (type == 'INITIAL') {
      this.intialInvoiceDetailsItems = items;
      this.invoiceDetailsItems = items;
    }
    this.isPrimaryInvoiceSubmited = false;
  }

  getTradeColor(type: string) {
    let return_style: string = '';
    switch (type) {
      case 'BUY':
        return_style = "badge badge-success min-card c-pointer mb-2";
        break;
      case 'SELL':
        return_style = "badge badge-danger min-card c-pointer mb-2";
        break;
      default:
        break;
    }
    return return_style;
  }
  changePriceOrFixed() {
    this.invoiceIsPercent = !this.invoiceIsPercent;
    if (this.invoiceIsPercent) {
      this.modalInvoiceForm.patchValue({
        'invoicePriceName': this.modalInvoiceForm.controls['invoicePriceName'].value > 100 ? 100 : this.modalInvoiceForm.controls['invoicePriceName'].value
      })
    }
  }
  onCancelClickInvoice() {
    this.invoiceDetailsItems = this.intialInvoiceDetailsItems;
    if (this.intialInvoiceDetailsItems.length == 0) {
      this.invoiceItems = [];
    }
    (document.getElementById("invoiceModalId") as HTMLBodyElement).style.display = "none";
    this.modalInvoiceForm.reset();
  }

  onConfirmInvoice() {
    if (this.invoiceItems.length > 0) {
      this.isPrimaryInvoiceSubmited = true;
    }
    this.intialInvoiceDetailsItems = this.invoiceDetailsItems;
    this.invoiceItems = this.getValidInvoiceStructure(this.intialInvoiceDetailsItems);
  }

  getTrimText(value: string, trimLength: number) {
    if (value != '' && value != undefined) {
      return value.substring(0, trimLength) + '...';
    } else {
      return '';
    }

  }
  // removeOption(event: Event, option: any): void {
  //   event.preventDefault();
  //   const index = this.options.indexOf(option);
  //   if (index !== -1) {
  //     this.options.splice(index, 1);
  //   }
  // }

  onCancelCityLocation() {
    this.isCity = false;
    this.isLocation = false;
    this.isBrand = false;
    this.cityError = false;
    this.sublocationError = false;
    this.brandError= false;
    this.subBrandError = false;
    this.isBrandSelected = true;
    (document.getElementById("cityLocationModalId") as HTMLBodyElement).style.display = "none";
    this.cityLocationBuilderForm.reset();
    this.cityLocationBuilderForm.patchValue({ addLogo: '' });
  }
  submitCityModal() {

  }
  addCityLocation(type: string) {
    switch (type) {
      case 'CITY':
        this.isCity = true;
        this.stepOneForm.controls['cityName'].value ? this.cityLocationBuilderForm.patchValue({ addCityName: this.stepOneForm.controls['cityName'].value }): '';
        this.addedLocationItems = [];
        break;
      case 'LOCATION':
        this.isLocation = true;
        this.cityLocationBuilderForm.patchValue({ addCityName: this.stepOneForm.controls['cityName'].value });
        // this.fetchDropdownValues();

        break;
      case 'BRAND':
        this.isBrand = true;
        this.stepOneForm.controls['brandType'].value ? this.cityLocationBuilderForm.patchValue({ addBrandName: this.stepOneForm.controls['brandType'].value }): '';
        this.addedBrandItems = [];
        break;
        case 'SUBBRAND':
          this.isSubBrand = true;
          this.stepOneForm.controls['brandType'].value ? this.cityLocationBuilderForm.patchValue({ addBrandName: this.stepOneForm.controls['brandType'].value }): '';
          this.addedBrandItems = [];
          break;
      default:
        break;
    }


  }
  findUniqueStrings(array1: any, array2: any) {
    const uniqueStrings = array2.filter((str: any) => !array1.includes(str));
    return uniqueStrings;
  }
  getCityLocationAPIJSON(): addCityLocationApi {
    let cityLocationInfo: addCityLocationApi = {} as addCityLocationApi;
    let city_name = this.cityLocationBuilderForm.controls['addCityName'].value;
    let city_id = null;
    cityLocationInfo.staff_id = this.dataService.staffIdSubject.value;
    if(this.isCity){
      this.states.forEach((item: any) => {
        if (item.label == this.stepOneForm.controls['stateName'].value) {
          cityLocationInfo.parent_location_id = item.location_id;
        }
      });
      cityLocationInfo.location_name = city_name;
      cityLocationInfo.type = "CITY";
      cityLocationInfo.sub_locations = this.addedLocationItems;
    } else if (this.isLocation){
      let loactions:any = [];
      const uniqueStrings: any = this.findUniqueStrings(this.previousLocationItems, this.addedLocationItems);
      if (this.stepOneForm.controls['cityName'].value == this.cityLocationBuilderForm.controls['addCityName'].value) {
        this.cityDetails.forEach((item: any) => {
          if (item.label == this.stepOneForm.controls['cityName'].value) {
            city_id = item.location_id;
            city_name = null;
            // if(!item.child_locations.includes(this.cityLocationBuilderForm.controls['addLocationName'].value)){
            //   loactions.push(this.cityLocationBuilderForm.controls['addLocationName'].value);
            // }
          }
        });
      }
      
    cityLocationInfo.parent_location_id = city_id;
    cityLocationInfo.location_name = null;
    cityLocationInfo.sub_locations = this.addedLocationItems,
    cityLocationInfo.type = "SUB_CITY";
    }
    return cityLocationInfo;

  }
  onSubmitCityLocation() {
    this.isPageLoader = true;
    this.httpService.addCityLocationApi(this.getCityLocationAPIJSON()).then(
      (response) => {
        this.onCancelCityLocation();
        let modalItem: ApiModal = {
          title: 'City/Location added Successfuly',
          content: 'The City/Location added successfully. Please chaeck the list to verify the changes.',
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.SUCCESS_API).next(modalItem);
        this.isPageLoader = false;
        this.fetchDropdownValues();
      },
      (error) => {
        this.onCancelCityLocation();
        let modalItem: ApiModal = {
          title: 'Addition of City/Location failed',
          content: error,
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
        this.isPageLoader = false;
      }
    );

  }

  location(value: HTMLInputElement, search_type: string): void {
    this.sublocationError = false;
    this.cityError = false;
    this.brandError= false;
    this.subBrandError = false;
    const locationValue = value.value.trim();
    let strippedStr = /^(["'])\s*\1$/.test(locationValue);
    if (search_type == 'Location' && !strippedStr && locationValue != "") {
      let cityNames: any = [];
      let locationsname: any = [];
      this.cityDetails.forEach((item: any) => {
        cityNames.push(item.label.toLowerCase());
        item.child_locations.forEach((item1: any) => {
          locationsname.push((item1.label).toLowerCase());
        });
      });
      if(this.isCity){
        if (!cityNames.includes((this.cityLocationBuilderForm.controls['addCityName'].value).toLowerCase())) {
          this.cityError = false;
          if (!this.addedLocationItems.includes(value.value)) {
            this.addedLocationItems.push(value.value);
            this.cityLocationBuilderForm.patchValue({ addLocationName: null });
          } else {
            value.value = '';
          }
        } else {
          this.cityError = true;
        }
      } else {
        if (cityNames.includes((this.cityLocationBuilderForm.controls['addCityName'].value).toLowerCase())) {
          // loactions.push(this.cityLocationBuilderForm.controls['addLocationName'].value);
          let cityName = this.cityLocationBuilderForm.controls['addCityName'].value;
          const index1 = this.cityDetails.findIndex((obj:any) => obj.label === cityName);
          let subLocation = this.cityDetails[index1].child_locations;
          let subLocationItems:any = []; 
          subLocation.forEach((item: any) => {
            subLocationItems.push((item.label).toLowerCase());
          });
          if(!subLocationItems.includes((this.cityLocationBuilderForm.controls['addLocationName'].value).toLowerCase())){
            if (!this.addedLocationItems.includes(value.value)) {
              this.addedLocationItems.push(value.value);
              this.cityLocationBuilderForm.patchValue({ addLocationName: null });
            } else {
              value.value = '';
            }
          } else {
            this.sublocationError = true;
          }
        } 
      }
    } else if (search_type == 'brand' && !strippedStr && locationValue != ""){
      let allBrands: any = [];
      this.assetsBrands.forEach((item: any) => {
        allBrands.push(item.label.toLowerCase());
      });
      if(this.isBrand){
        if (!allBrands.includes((this.cityLocationBuilderForm.controls['addBrandName'].value).toLowerCase())) {
          if (!this.addedBrandItems.includes(value.value)) {
            this.addedBrandItems.push(value.value);
            // this.cityLocationBuilderForm.patchValue({ addBrandName: null });
          } else {
            value.value = '';
          }
        } else {
          this.brandError = true;
        }
      } else {
        if (allBrands.includes((this.cityLocationBuilderForm.controls['addBrandName'].value).toLowerCase())) {
          let brandName = this.cityLocationBuilderForm.controls['addBrandName'].value;
          const index1 = this.assetsBrands.findIndex((obj:any) => obj.label === brandName);
          let subBrands = this.assetsBrands[index1].child_brands;
          let subBrandItems:any = []; 
          subBrands.forEach((item: any) => {
            subBrandItems.push((item.label).toLowerCase());
          });
          if(!subBrandItems.includes((this.cityLocationBuilderForm.controls['addSubBrandName'].value).toLowerCase())){
            if (!this.addedBrandItems.includes(value.value)) {
              this.addedBrandItems.push(value.value);
              this.cityLocationBuilderForm.patchValue({ addSubBrandName: null });
            } else {
              value.value = '';
            }
          }else{
           this.subBrandError = true;
          }
          
        }
      }
      
    }
  }


  removeLocationItem(value: any, search_type: string): void {
    if (search_type == 'Location') {
      // let currentLocatonAdded = this.dataService.propertyListingFiltersSubject.value;
      this.addedLocationItems = this.addedLocationItems.filter(elem => elem != value);
      // currentLocatonAdded.filtersByPlaces.asset_id = this.addedLocationItems;
      // this.updateFilterSubject(currentLocatonAdded);/
    }
    else if (search_type == "brand") {
      // let currentPropertyListingFilters = this.dataService.propertyListingFiltersSubject.value;
      this.addedBrandItems = this.addedBrandItems.filter(elem => elem != value);
      // currentPropertyListingFilters.filtersBySearch.property_name = this.assetNameSearchItems;
      // this.updateFilterSubject(currentPropertyListingFilters);
    }
  }
  getBuilderAPIJSON(): addBuilderApi {
    let builderInfo: addBuilderApi = {} as addBuilderApi;
    builderInfo.staff_id = this.dataService.staffIdSubject.value;
    
    let brand_id = null;
    if(this.isBrand){
      builderInfo.parent_brand_id = null;
      builderInfo.label = this.cityLocationBuilderForm.controls['addBrandName'].value;
      builderInfo.type = "BRAND";
      builderInfo.sub_varients = this.addedBrandItems;
    } else if (this.isSubBrand){
      const uniqueStrings: any = this.findUniqueStrings(this.previousLocationItems, this.addedBrandItems);
      if (this.stepOneForm.controls['brandType'].value == this.cityLocationBuilderForm.controls['addBrandName'].value) {
        this.assetsBrands.forEach((item: any) => {
          if (item.label == this.stepOneForm.controls['brandType'].value) {
            builderInfo.parent_brand_id = item.brand_id;
          }
        });
      }
      builderInfo.type = "VARIENT";
      builderInfo.label = null;
      builderInfo.sub_varients = this.addedBrandItems;
    }
   
    return builderInfo;
  }

  onSubmitBuilder() {
    this.isPageLoader = true;
    this.httpService.addBuilderApi(this.getBuilderAPIJSON()).then(
      (response) => {
        this.onCancelCityLocation();
        let modalItem: ApiModal = {
          title: 'Brand/Sub brand added Successfuly',
          content: 'The Brand/Sub brand added successfully. Please chaeck the list to verify the changes.',
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.SUCCESS_API).next(modalItem);
        this.fetchDropdownValues();
        this.isPageLoader = false;
      },
      (error) => {
        this.onCancelCityLocation();
        let modalItem: ApiModal = {
          title: 'Addition of Brand/Sub brand failed',
          content: error,
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
        this.isPageLoader = false;
      }
    );
  }

  @HostListener('document:mousedown', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    // Check if the click was outside any dropdown container
    if (!target.closest('.dropdown-container') && !target.closest('.dropdown-container-location') && !target.closest('.dd-listner') && !target.closest('.dd-listner-location')) {
      this.closeAllDropdowns();
    }
  }

  closeAllDropdowns() {
    const dropdowns = [
      'detailsDroupDown', 
      'detailsDroupDownLocation', 
      'detailsDroupDownCountry', 
      'detailsDroupDownState', 
      'detailsDroupDownBrand', 
      'detailsDroupDownSubbrand',
      'detailsDroupDownbuilder',
      'detailsDroupDownAssetType',
      'detailsDroupDownCurrency',
      'detailsDroupDownCategory',
      'detailsDroupDownOwnership',
      'detailsDroupDownTransmission',
      'detailsDroupDownAirCondition',
      'detailsDroupDownClass',
      'detailsDroupDownFeature',
      'detailsDroupDownDetailTitle',
      'detailsDroupDownFuel'
    ];
    dropdowns.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.style.display = 'none';
        if (el.parentElement) {
          el.parentElement.style.zIndex = '';
        }
      }
    });
  }

  openDroupDown(event: any, type: string) {
    if (!this.isViewDetails) {
      event.stopPropagation();
      
      // Determine which dropdown we are targeting
      let targetId = '';
      switch (type) {
        case 'COUNTRY': targetId = 'detailsDroupDownCountry'; break;
        case 'STATE': targetId = 'detailsDroupDownState'; break;
        case 'CITY': targetId = 'detailsDroupDown'; break;
        case 'LOCATION': targetId = 'detailsDroupDownLocation'; break;
        case 'BRAND': targetId = 'detailsDroupDownBrand'; break;
        case 'SUBBRAND': targetId = 'detailsDroupDownSubbrand'; break;
        case 'ASSET_TYPE': targetId = 'detailsDroupDownAssetType'; break;
        case 'CURRENCY': targetId = 'detailsDroupDownCurrency'; break;
        case 'CATEGORY': targetId = 'detailsDroupDownCategory'; break;
        case 'OWNERSHIP': targetId = 'detailsDroupDownOwnership'; break;
        case 'TRANSMISSION': targetId = 'detailsDroupDownTransmission'; break;
        case 'AIR_CONDITION': targetId = 'detailsDroupDownAirCondition'; break;
        case 'CLASS': targetId = 'detailsDroupDownClass'; break;
        case 'FEATURE': targetId = 'detailsDroupDownFeature'; break;
        case 'DETAIL_TITLE': targetId = 'detailsDroupDownDetailTitle'; break;
        case 'FUEL': targetId = 'detailsDroupDownFuel'; break;
        case 'BUILDER': targetId = 'detailsDroupDownbuilder'; break;
      }

      const targetEl = document.getElementById(targetId);
      const isCurrentlyVisible = targetEl ? (targetEl.style.display === 'block') : false;

      // Close all first
      this.closeAllDropdowns();

      // If it was closed, open it (and handle special logic for filtered lists)
      if (!isCurrentlyVisible && targetEl) {
        let shouldOpen = true;

        // Special logic for cascading dropdowns
        if (type === 'STATE') {
          let country_name = this.stepOneForm.controls['countryName'].value;
          if (country_name && this.countries) {
            const index = this.countries.findIndex((obj: any) => obj.label === country_name);
            if (index !== -1) {
              this.states = this.countries[index].child_locations;
            } else {
              shouldOpen = false;
            }
          } else {
            shouldOpen = false;
          }
        } else if (type === 'CITY') {
          let state_name = this.stepOneForm.controls['stateName'].value;
          if (state_name && this.states) {
            const index = this.states.findIndex((obj: any) => obj.label === state_name);
            if (index !== -1) {
              this.cityDetails = this.states[index].child_locations;
            } else {
              shouldOpen = false;
            }
          } else {
            shouldOpen = false;
          }
        } else if (type === 'LOCATION') {
          let city_name = this.stepOneForm.controls['cityName'].value;
          if (city_name && this.cityDetails) {
            const index = this.cityDetails.findIndex((obj: any) => obj.label === city_name);
            if (index !== -1) {
              this.locationDetails = this.cityDetails[index].child_locations;
            } else {
              shouldOpen = false;
            }
          } else {
            shouldOpen = false;
          }
        } else if (type === 'SUBBRAND') {
          let brand_name = this.stepOneForm.controls['brandType'].value;
          if (brand_name && this.assetsBrands) {
            const index = this.assetsBrands.findIndex((obj: any) => obj.label === brand_name);
            if (index !== -1) {
              this.subBrandeatils = this.assetsBrands[index].child_brands;
            } else {
              shouldOpen = false;
            }
          } else {
            shouldOpen = false;
          }
        }

        if (shouldOpen) {
          targetEl.style.display = 'block';
          targetEl.style.position = 'absolute';
          if (targetEl.parentElement) {
            targetEl.parentElement.style.zIndex = '1101';
          }
        }
      }
    }
  }

  onChangeFuel(event: any, option: any) {
    this.stepTwoForm.patchValue({ 
      assetFuel: option.fuel_id,
      assetFuelDisplay: option.fuel_value
    });
    this.closeAllDropdowns();
  }

  // Value Selection Handlers
  onChangeAirCondition(event: any, option: any) {
    this.stepTwoForm.patchValue({ 
      airConditionType: option.id,
      airConditionTypeDisplay: option.text
    });
    this.closeAllDropdowns();
  }
  onChangeClass(event: any, option: any) {
    this.stepTwoForm.patchValue({ 
      classType: option.class_id,
      classTypeDisplay: option.class_name
    });
    this.closeAllDropdowns();
  }
  onChangeFeature(event: any, option: string) {
    this.stepTwoForm.patchValue({ assetFeature: option });
    this.addFeatureId = option;
    this.isAssetIdEmpty = false;
    this.closeAllDropdowns();
  }
  onChangeDetailTitle(event: any, option: string) {
    this.stepTwoForm.patchValue({ assetDetailsTitleName: option });
    this.closeAllDropdowns();
  }

  // Value Selection Handlers
  onChangeAssetType(event: any, option: string) {
    this.stepOneForm.patchValue({ assetTypeName: option });
    this.closeAllDropdowns();
  }
  onChangeCurrency(event: any, option: string) {
    this.stepOneForm.patchValue({ currencyTypeName: option });
    this.closeAllDropdowns();
  }
  onChangeCategory(event: any, option: string) {
    this.stepOneForm.patchValue({ assetCategoryName: option });
    this.closeAllDropdowns();
  }
  onChangeOwnership(event: any, option: string) {
    this.stepOneForm.patchValue({ OwnershipType: option });
    this.closeAllDropdowns();
  }
  onChangeTransmission(event: any, option: string) {
    this.stepOneForm.patchValue({ transmissionType: option });
    this.closeAllDropdowns();
  }
  onChangeLocation(event: any, option: string) {
    this.stepOneForm.patchValue({ locationName: option });
    const droupDown1 = document.getElementById('detailsDroupDownLocation') as HTMLBodyElement;
    droupDown1.style.display = 'none';
  }
  onChangeSubBrand(event: any, option: string) {
    this.stepOneForm.patchValue({ subBrandType: option });
    const droupDown1 = document.getElementById('detailsDroupDownSubbrand') as HTMLBodyElement;
    droupDown1.style.display = 'none';
  }
  onChangeBuilder(event: any, option: string) {
    let builderId;
    this.buildersDetails.forEach((item: any) => {
      if (item.builder_name == option) {
        builderId = item.builder_id;
      }
    });
    this.stepTwoForm.patchValue({ builderName: option });
    const droupDown1 = document.getElementById('detailsDroupDownbuilder') as HTMLBodyElement;
    droupDown1.style.display = 'none';
  }

  toggleOutside(id: string) {
    const droupDown1 = document.getElementById(id) as HTMLBodyElement;
    if (droupDown1.style.display != 'none') {
      droupDown1.style.display = 'none';
    }
  }

  getCityLocationToDelateAPIJSON(loctionCityValue: any, type: any, id:number) {
    let cityLocationInfo = {
      "staff_id": "",
      "location_id": id
  };
    // let locations: any = [];
    // let  city_id = null;
    // if (type == 'CITY') {
    //   let city_name = loctionCityValue;
    //   this.cityDetails.forEach((item: any) => {
    //     if (item.label == loctionCityValue) {
    //       cityLocationInfo.location_id =item.city_id;
    //       // city_name = null;
    //       // item.child_locations.forEach((item1: any) => {
    //       //   locations.push(item1.location_id);
    //       // });
    //     }
    //     // item.locations.forEach((item1: any) => {
    //     //   if (item1.location_name == this.stepOneForm.controls['locationName'].value) {
    //     //     cityLocationInfo.locations = item1.location_id;
    //     //   }

    //     // });
    //   });
      
    // }
    // if (type == 'LOCATION') {
    //   let location = loctionCityValue;
    //   let city_name = this.stepOneForm.controls['cityName'].value;
    //   const index = this.cityDetails.findIndex((obj :any) => obj.label === city_name);
    //   let locationItems = this.cityDetails[index].child_locations;
    //   locationItems.forEach((item1: any) => {
    //     if (item1.label == location) {
    //       cityLocationInfo.location_id = item1.location_id;
    //     }
    //   });
    // }
    // cityLocationInfo.city_id = city_id;
    // cityLocationInfo.locations = locations;
    cityLocationInfo.staff_id = this.dataService.staffIdSubject.value;
    return cityLocationInfo;
  }

  removeCityLocation(event: Event, loctionCityValue: any, type: string, id:number): void {
    if (type == 'CITY') {
      const droupDown = document.getElementById('detailsDroupDown') as HTMLBodyElement;
      droupDown.style.display = 'none';

    } else if (type == 'LOCATION') {
      const droupDown1 = document.getElementById('detailsDroupDownLocation') as HTMLBodyElement;
      droupDown1.style.display = 'none';
    }
    this.isPageLoader = true;
    this.httpService.removeCityLocationApi(this.getCityLocationToDelateAPIJSON(loctionCityValue, type, id)).then(
      (response:any) => {
        if(response && response.response == 'Delete Location Sucessffully.'){
          let modalItem: ApiModal = {
            title: 'City or Location removed Successfuly',
            content: 'City or Location removed successfully. Please chaeck the list to verify the changes.',
            status: true,
            router: ''
          } as ApiModal
          this.dataService.modalUpdater(ModalTypes.SUCCESS_API).next(modalItem);
          this.isPageLoader = false;
          this.fetchDropdownValues();
        } else {
          let modalItem: ApiModal = {
            title: 'Sorry City or Location is not removed',
            content: response.response,
            status: true,
            router: ''
          } as ApiModal
          this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
          this.isPageLoader = false;
          this.fetchDropdownValues();
        }
       
      },
      (error) => {
        let modalItem: ApiModal = {
          title: 'Sorry City or Location is not removed',
          content: error,
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
        this.isPageLoader = false;
      }
    );
  }
  getBrandDelateAPIJSON(Value: any, id:number) {
    let builderInfo:any = {};
    builderInfo.brand_id = id;
    builderInfo.staff_id = this.dataService.staffIdSubject.value;
    return builderInfo;
  }
  removeBrand(event: Event, builderValue: string,id:number): void {
    this.isPageLoader = true;
    if(builderValue == 'BRAND'){
    const droupDown = document.getElementById('detailsDroupDownBrand') as HTMLBodyElement;
    droupDown.style.display = 'none';} 
    if(builderValue == 'SUBBRAND'){
      const droupDown = document.getElementById('detailsDroupDownSubbrand') as HTMLBodyElement;
      droupDown.style.display = 'none';} 

    this.httpService.removeBrandApi(this.getBrandDelateAPIJSON(builderValue,id)).then(
      (response:any) => {
        if(response && response.response == 'Delete Brand or Varient process has done Sucessffully.'){
          let modalItem: ApiModal = {
            title: 'Brand/Sub brand removed Successfuly',
            content: 'Brand/Sub brand removed successfully. Please chaeck the list to verify the changes.',
            status: true,
            router: ''
          } as ApiModal
          this.dataService.modalUpdater(ModalTypes.SUCCESS_API).next(modalItem);
          this.isPageLoader = false;
          this.fetchDropdownValues();
        } else {
          let modalItem: ApiModal = {
            title: 'Sorry Brand/Sub brand is not removed',
            content: response.response,
            status: true,
            router: ''
          } as ApiModal
          this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
          this.isPageLoader = false;
          this.fetchDropdownValues();
        }
      },
      (error) => {
        let modalItem: ApiModal = {
          title: 'Sorry Brand/Sub brand is not removed',
          content: error,
          status: true,
          router: ''
        } as ApiModal
        this.dataService.modalUpdater(ModalTypes.ERR_API).next(modalItem);
        this.isPageLoader = false;
      }
    );
  }

  // getIsValidPricePerShare() {
  //   return (undefined ==
  //     this.stepOneForm.controls['propertyPriceName'].value /
  //     this.stepOneForm.controls['totalSharesName'].value);
  // }
  public validateEmailInput(event: any) {
    const target = event?.target as HTMLInputElement;
    if (!target) return;
    const input = target.value;
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(input)) {
      this.isCorrectEmail = true;
    } else {
      this.isCorrectEmail = false;
    }
  }
}

export function greaterThan100(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value > 100) {
    return { greaterThan100: true };
  }
  return null;
}
