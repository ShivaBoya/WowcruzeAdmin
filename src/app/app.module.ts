import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgxSpinnerModule } from "ngx-spinner";
import { PropertiesListingsComponent } from './core-components/properties-listings/properties-listings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './core-components/login/login.component';
import { AddPropertyPageComponent } from './core-components/add-property-page/add-property-page.component';
import { MdbAccordionModule } from 'mdb-angular-ui-kit/accordion';
import { MdbCarouselModule } from 'mdb-angular-ui-kit/carousel';
import { MdbCheckboxModule } from 'mdb-angular-ui-kit/checkbox';
import { MdbCollapseModule } from 'mdb-angular-ui-kit/collapse';
import { MdbDropdownModule } from 'mdb-angular-ui-kit/dropdown';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';
import { MdbPopoverModule } from 'mdb-angular-ui-kit/popover';
import { MdbRadioModule } from 'mdb-angular-ui-kit/radio';
import { MdbRangeModule } from 'mdb-angular-ui-kit/range';
import { MdbRippleModule } from 'mdb-angular-ui-kit/ripple';
import { MdbScrollspyModule } from 'mdb-angular-ui-kit/scrollspy';
import { MdbTabsModule } from 'mdb-angular-ui-kit/tabs';
import { MdbTooltipModule } from 'mdb-angular-ui-kit/tooltip';
import { MdbValidationModule } from 'mdb-angular-ui-kit/validation';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TopMainNavBarComponent } from './shared/components/top-main-nav-bar/top-main-nav-bar.component';
import { MainPageComponent } from './core-components/main-page/main-page.component';
import { FilterPropertiesComponent } from './core-components/properties-listings/filter-properties/filter-properties.component';
import { ModalComponent } from './shared/components/modal/modal.component';
import { HttpService } from './shared/services/http.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { UserListComponent } from './core-components/user-list/user-list.component';
import { BuyersProfileComponent } from './core-components/buyers-profile/buyers-profile.component';
import { DatePipe } from '@angular/common';
import { ViewBuyersComponent } from './core-components/view-buyers/view-buyers.component';
import { BuyersFilterComponent } from './core-components/view-buyers/buyers-filter/buyers-filter.component';
import { KycFilterComponent } from './core-components/user-list/kyc-filter/kyc-filter.component';

@NgModule({
  declarations: [
    AppComponent,
    PropertiesListingsComponent,
    LoginComponent,
    AddPropertyPageComponent,
    TopMainNavBarComponent,
    MainPageComponent,
    FilterPropertiesComponent,
    ModalComponent,
    UserListComponent,
    BuyersProfileComponent,
    ViewBuyersComponent,
    BuyersFilterComponent,
    KycFilterComponent,
  ],
  imports: [
    BrowserModule,
    NgxSpinnerModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    MdbAccordionModule,
    MdbCarouselModule,
    MdbCheckboxModule,
    MdbCollapseModule,
    MdbDropdownModule,
    MdbFormsModule,
    MdbModalModule,
    MdbPopoverModule,
    MdbRadioModule,
    MdbRangeModule,
    MdbRippleModule,
    MdbScrollspyModule,
    MdbTabsModule,
    MdbTooltipModule,
    MdbValidationModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [HttpService, DatePipe],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
