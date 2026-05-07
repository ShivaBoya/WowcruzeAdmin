import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { DataService } from 'src/app/shared/services/data.service';
import { ModalTypes, ApiModal } from 'src/app/shared/modals/modal.modal';


@Component({
  selector: 'app-admin-management',
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss']
})
export class AdminManagementComponent implements OnInit {
  admins: any[] = [];
  searchInput: string = '';
  errorMessage: string = '';
  currentStaffId: string | null = null;

  constructor(
    private httpService: HttpService, 
    private spinner: NgxSpinnerService,
    private router: Router,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    this.currentStaffId = localStorage.getItem('staff_id');
    if (!this.currentStaffId) {
      this.errorMessage = "Session expired. Please login again.";
      return;
    }
    this.fetchAdmins();
  }

  deleteAdmin(targetStaffId: string) {
    if (targetStaffId == this.currentStaffId) {
      this.dataService.modalUpdater(ModalTypes.ERR_API).next({
        title: "Action Restricted",
        content: "You cannot delete your own account.",
        status: true
      } as ApiModal);
      return;
    }

    const modalItem: ApiModal = {
      title: 'Confirm Deletion',
      content: `Are you sure you want to delete Admin ID: ${targetStaffId}? This action cannot be undone.`,
      status: true,
      call: () => {
        this.spinner.show();
        this.httpService.deleteAdmin(targetStaffId).then(
          (res: any) => {
            this.spinner.hide();
            this.dataService.modalUpdater(ModalTypes.SUCCESS_API).next({
              title: "Deleted",
              content: "Administrator has been successfully removed.",
              status: true,
              call: () => {
                this.fetchAdmins();
              }
            } as ApiModal);
          },
          (err) => {
            this.spinner.hide();
            this.dataService.modalUpdater(ModalTypes.ERR_API).next({
              title: "Deletion Failed",
              content: typeof err === 'string' ? err : "Failed to delete administrator.",
              status: true
            } as ApiModal);
          }
        );
      }
    } as ApiModal;
    this.dataService.modalUpdater(ModalTypes.CONFIRM_API).next(modalItem);
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

        if (this.errorMessage.includes("Not Authorized")) {
          this.errorMessage = ''; // Clear banner to show only popup
          this.dataService.modalUpdater(ModalTypes.ERR_API).next({
            title: "Access Denied",
            content: "You do not have permission to view or manage administrators.",
            status: true
          } as ApiModal);
        }
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
