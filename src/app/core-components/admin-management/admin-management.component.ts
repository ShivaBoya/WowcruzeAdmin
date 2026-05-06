import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss']
})
export class AdminManagementComponent implements OnInit {
  admins: any[] = [];
  searchInput: string = '';
  errorMessage: string = '';

  constructor(
    private httpService: HttpService, 
    private spinner: NgxSpinnerService,
    private router: Router
  ) { }

  ngOnInit(): void {
    const staffId = localStorage.getItem('staff_id');
    if (!staffId) {
      this.errorMessage = "Session expired. Please login again.";
      return;
    }
    this.fetchAdmins();
  }

  fetchAdmins() {
    this.spinner.show();
    this.errorMessage = '';
    const filters = {
      searchInput: this.searchInput
    };
    this.httpService.getAdmins(filters).then(
      (res: any) => {
        if (res && res.admins) {
          this.admins = res.admins.map((admin: any) => {
            // Parse permissions if string
            if (typeof admin.permissions === 'string') {
              try {
                admin.permissions = JSON.parse(admin.permissions);
              } catch (e) {
                console.error("Error parsing permissions", e);
              }
            }
            // Parse profile_pic if string
            if (typeof admin.profile_pic === 'string' && admin.profile_pic.startsWith('{')) {
              try {
                admin.profile_pic = JSON.parse(admin.profile_pic);
              } catch (e) {
                console.error("Error parsing profile_pic", e);
              }
            }
            return admin;
          });
        } else {
          this.admins = [];
        }
        this.spinner.hide();
      },
      (err) => {
        console.error("Fetch admins error:", err);
        this.errorMessage = typeof err === 'string' ? err : "Failed to load admins.";
        this.spinner.hide();
      }
    );
  }

  onSearch() {
    this.fetchAdmins();
  }

  addAdmin() {
    this.router.navigate(['/add-admin']);
  }

  editAdmin(id: string) {
    this.router.navigate(['/edit-admin', id]);
  }
}
