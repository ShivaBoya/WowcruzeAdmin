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


  permissionList: any[] = [];
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
      this.fetchPermissions();
      this.fetchAdminDetails();
    } else {
      this.router.navigate(['/admin-management']);
    }
  }

  fetchPermissions() {
    this.httpService.getAllPermissions().then((res: any) => {
      if (res && Array.isArray(res)) {
        this.permissionList = res.map(p => ({
          key: p.permission_name,
          label: this.formatLabel(p.permission_name)
        }));
      }
    }).catch(err => {
      console.error("Error fetching permissions:", err);
    });
  }

  formatLabel(key: string): string {
    return key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
