import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { HttpService } from '../../services/http.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  activeMenu: string = 'assets';
  adminProfile: any = null;

  constructor(
    private router: Router, 
    private dataService: DataService,
    private httpService: HttpService
  ) { }

  ngOnInit(): void {
    this.updateActiveMenu();
    this.router.events.subscribe(() => {
      this.updateActiveMenu();
    });
    this.getAdminProfile();
  }

  getAdminProfile() {
    this.httpService.fetchAdminProfile().then(
      (res: any) => {
        if (res && res.adminDetails) {
          this.adminProfile = res.adminDetails;
          // Parse permissions if string
          if (typeof this.adminProfile.permissions === 'string') {
            this.adminProfile.permissions = JSON.parse(this.adminProfile.permissions);
          }
          // Parse profile_pic if string
          if (typeof this.adminProfile.profile_pic === 'string' && this.adminProfile.profile_pic.startsWith('{')) {
            this.adminProfile.profile_pic = JSON.parse(this.adminProfile.profile_pic);
          }
        }
      },
      (err) => {
        console.error("Error fetching admin profile:", err);
      }
    );
  }

  updateActiveMenu() {
    const url = this.router.url;
    if (url.includes('my-profile')) {
      this.activeMenu = 'profile';
    } else if (url.includes('user-management')) {
      this.activeMenu = 'users';
    } else if (url.includes('admin-management') || url.includes('add-admin')) {
      this.activeMenu = 'admins';
    } else {
      this.activeMenu = 'assets';
    }
  }

  navigate(path: string, menu: string) {
    this.activeMenu = menu;
    this.router.navigate([path]);
  }

  logOut() {
    localStorage.removeItem('staff_id');
    localStorage.removeItem('session');
    this.dataService.staffIdSubject.next('');
    this.router.navigate(['/login']);
  }
}
