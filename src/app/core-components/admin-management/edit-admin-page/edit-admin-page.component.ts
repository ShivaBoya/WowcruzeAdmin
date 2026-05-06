import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/shared/services/data.service';
import { ModalTypes, ApiModal } from 'src/app/shared/modals/modal.modal';

@Component({
  selector: 'app-edit-admin',
  templateUrl: './edit-admin-page.component.html',
  styleUrls: ['./edit-admin-page.component.scss']
})
export class EditAdminComponent implements OnInit {
  staffId: string | null = null;
  profile: any = {
    staff_id: '',
    name: '',
    email: '',
    password: '',
    dob: '',
    country_code: '+91',
    mobile: '',
    gender: 'Male',
    active: 1,
    profile_pic: null,
    permissions: {}
  };

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

  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private httpService: HttpService,
    private spinner: NgxSpinnerService,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.staffId = this.route.snapshot.paramMap.get('id');
    if (this.staffId) {
      this.fetchAdminDetails();
    } else {
      this.router.navigate(['/admin-management']);
    }
  }

  fetchAdminDetails() {
    this.spinner.show();
    // Reusing fetch-admin-profile to get details by ID
    this.httpService.fetchAdminProfileByID(this.staffId!).then(
      (res: any) => {
        if (res && res.profile) {
          const details = res.profile;
          this.profile = {
            staff_id: details.staff_id,
            name: details.name,
            email: details.email,
            password: details.password || '', // Decrypted password from get-admin-details
            dob: details.dob ? details.dob.split('T')[0] : '',
            country_code: details.country_code || '+91',
            mobile: details.mobile,
            gender: details.gender || 'Male',
            active: details.active,
            profile_pic: typeof details.profile_pic === 'string' ? JSON.parse(details.profile_pic) : details.profile_pic,
            permissions: typeof details.permissions === 'string' ? JSON.parse(details.permissions) : details.permissions
          };
        }
        this.spinner.hide();
      },
      (err) => {
        this.spinner.hide();
        this.errorMessage = "Failed to load admin details.";
      }
    );
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profile.profile_pic = {
          base64: e.target.result,
          extension: file.name.split('.').pop(),
          file_type: file.type
        };
      };
      reader.readAsDataURL(file);
    }
  }

  goBack() {
    this.router.navigate(['/admin-management']);
  }

  onSubmit() {
    if (!this.profile.name || !this.profile.email || !this.profile.mobile) {
      this.errorMessage = "Please fill all required fields.";
      return;
    }

    this.spinner.show();
    // Note: backend editAdmin expects permissions INSIDE profile object
    const payload = {
      profile: this.profile
    };

    this.httpService.editAdmin(payload).then(
      (res: any) => {
        this.spinner.hide();
        this.dataService.modalUpdater(ModalTypes.SUCCESS_API).next({
          title: "Success",
          content: "Admin details updated successfully.",
          status: true,
          call: () => {
            this.router.navigate(['/admin-management']);
          }
        } as ApiModal);
      },
      (err) => {
        this.spinner.hide();
        this.errorMessage = typeof err === 'string' ? err : "Failed to update admin.";
        this.dataService.modalUpdater(ModalTypes.ERR_API).next({
          title: "Update Error",
          content: this.errorMessage,
          status: true
        } as ApiModal);
      }
    );
  }
}
