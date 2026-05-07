import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/shared/services/http.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DataService } from 'src/app/shared/services/data.service';
import { ModalTypes, ApiModal } from 'src/app/shared/modals/modal.modal';

@Component({
  selector: 'app-add-admin',
  templateUrl: './add-admin-page.component.html',
  styleUrls: ['./add-admin-page.component.scss']
})
export class AddAdminComponent implements OnInit {
  profile: any = {
    name: '',
    email: '',
    password: '',
    dob: '',
    country_code: '+91',
    mobile: '',
    gender: 'Male',
    active: 1,
    profile_pic: null
  };

  permissions: any = {
    add_admin: false,
    create_new_asset: false,
    create_new_user: false,
    delete_admin: false,
    delete_asset: false,
    delete_user: false,
    edit_admin: false,
    edit_asset: false,
    edit_user_profile: false,
    overview_access: false,
    transactions_access: false,
    view_admin: false,
    view_asset: false,
    view_user_profile: false
  };


  permissionList: any[] = [];
  errorMessage: string = '';

  constructor(
    private httpService: HttpService,
    private spinner: NgxSpinnerService,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.fetchPermissions();
  }

  fetchPermissions() {
    this.httpService.getAllPermissions().then((res: any) => {
      if (res && Array.isArray(res)) {
        this.permissionList = res.map(p => ({
          key: p.permission_name,
          label: this.formatLabel(p.permission_name)
        }));
        
        // Initialize permissions object dynamically
        this.permissionList.forEach(p => {
          this.permissions[p.key] = false;
        });
      }
    }).catch(err => {
      console.error("Error fetching permissions:", err);
    });
  }

  formatLabel(key: string): string {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
    if (!this.profile.name || !this.profile.email || !this.profile.password || !this.profile.mobile) {
      this.errorMessage = "Please fill all required fields.";
      return;
    }

    this.spinner.show();
    const payload = {
      profile: this.profile,
      permissions: this.permissions
    };

    this.httpService.addAdmin(payload).then(
      (res: any) => {
        this.spinner.hide();
        this.dataService.modalUpdater(ModalTypes.SUCCESS_API).next({
          title: "Success",
          content: "Administrator created successfully.",
          status: true,
          call: () => {
            this.router.navigate(['/admin-management']);
          }
        } as ApiModal);
      },
      (err) => {
        this.spinner.hide();
        this.errorMessage = typeof err === 'string' ? err : "Failed to add admin.";
        
        // Show Global Error Modal
        this.dataService.modalUpdater(ModalTypes.ERR_API).next({
          title: "Registration Error",
          content: this.errorMessage,
          status: true
        } as ApiModal);
      }
    );
  }
}
