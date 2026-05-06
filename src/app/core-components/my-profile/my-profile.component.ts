import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.scss']
})
export class MyProfileComponent implements OnInit {
  adminProfile: any = null;
  errorMessage: string = '';

  permissionList = [
    { key: 'view_admin', label: 'View Admins' },
    { key: 'add_admin', label: 'Add Admin' },
    { key: 'edit_admin', label: 'Edit Admin' },
    { key: 'delete_admin', label: 'Delete Admin' },
    { key: 'view_asset', label: 'View Assets' },
    { key: 'create_new_asset', label: 'Add Asset' },
    { key: 'edit_asset', label: 'Edit Asset' },
    { key: 'delete_asset', label: 'Delete Asset' },
    { key: 'view_user_profile', label: 'View Users' },
    { key: 'create_new_user', label: 'Add User' },
    { key: 'edit_user_profile', label: 'Edit User' },
    { key: 'delete_user', label: 'Delete User' },
    { key: 'overview_access', label: 'Overview Access' },
    { key: 'transactions_access', label: 'Transactions Access' }
  ];

  constructor(private httpService: HttpService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile() {
    this.spinner.show();
    this.httpService.fetchAdminProfile().then(
      (res: any) => {
        if (res && res.adminDetails) {
          this.adminProfile = res.adminDetails;
          // Parse permissions if string
          if (typeof this.adminProfile.permissions === 'string') {
            try {
              this.adminProfile.permissions = JSON.parse(this.adminProfile.permissions);
            } catch (e) {
              console.error("Error parsing permissions", e);
            }
          }
          // Parse profile_pic if string
          if (typeof this.adminProfile.profile_pic === 'string' && this.adminProfile.profile_pic.startsWith('{')) {
            try {
              this.adminProfile.profile_pic = JSON.parse(this.adminProfile.profile_pic);
            } catch (e) {
              console.error("Error parsing profile_pic", e);
            }
          }
        }
        this.spinner.hide();
      },
      (err) => {
        console.error(err);
        this.errorMessage = "Failed to load profile details.";
        this.spinner.hide();
      }
    );
  }
}
