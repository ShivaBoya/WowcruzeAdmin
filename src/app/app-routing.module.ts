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
import { AdminManagementComponent } from './core-components/admin-management/admin-management.component';
import { UserManagementComponent } from './core-components/user-management/user-management.component';
import { AddAdminComponent } from './core-components/admin-management/add-admin-page/add-admin-page.component';
import { MyProfileComponent } from './core-components/my-profile/my-profile.component';
import { EditAdminComponent } from './core-components/admin-management/edit-admin-page/edit-admin-page.component';

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
      {path: 'admin-management', component: AdminManagementComponent},
      {path: 'user-management', component: UserManagementComponent},
      {path: 'add-admin', component: AddAdminComponent},
      {path: 'my-profile', component: MyProfileComponent},
      {path: 'edit-admin/:id', component: EditAdminComponent},
      
    ],
  
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
