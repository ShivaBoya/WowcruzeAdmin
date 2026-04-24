import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddPropertyPageComponent } from './core-components/add-property-page/add-property-page.component';
import { MainPageComponent } from "./core-components/main-page/main-page.component";
import { PropertiesListingsComponent } from './core-components/properties-listings/properties-listings.component';
import { AuthGuard } from './guards/auth.guard';
import { LoginComponent } from './core-components/login/login.component';
import { LoginGuard } from './guards/login.guard';
import { UserListComponent } from './core-components/user-list/user-list.component';
import { BuyersProfileComponent } from './core-components/buyers-profile/buyers-profile.component';
import { ViewBuyersComponent } from './core-components/view-buyers/view-buyers.component';

const routes: Routes = [
  {
    path: 'login', component: LoginComponent, canActivate: [LoginGuard]
  },
  {
    path: '', component: MainPageComponent,
    children: [
      { path: '', component: PropertiesListingsComponent, pathMatch: 'full' },
      { path: 'add-property', component: AddPropertyPageComponent, pathMatch: 'full' },
      { path: 'property-details/:id', component: AddPropertyPageComponent, pathMatch: 'full' },
      { path: 'kyc-list', component: UserListComponent, pathMatch: 'full'},
      {path: 'profile/:id', component: BuyersProfileComponent},
      {path: 'view-buyers', component: ViewBuyersComponent},
      {path: 'view-buyers/:id', component: ViewBuyersComponent},
      
    ],
  
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
