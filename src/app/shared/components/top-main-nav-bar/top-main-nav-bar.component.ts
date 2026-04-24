import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-top-main-nav-bar',
  templateUrl: './top-main-nav-bar.component.html',
  styleUrls: ['./top-main-nav-bar.component.scss']
})

export class TopMainNavBarComponent implements OnInit {

  currentTopMenu: any;
  staff_id: string | null = null;
  constructor(
    private dataService: DataService,
    private router: Router
  ) {
  }
  ngOnInit(): void {
    this.currentTopMenu = 1;
    this.initialObserver();
    this.staff_id = this.dataService.staffIdSubject.value;

    if (this.router.url.includes('/view-buyers')) {
      this.currentTopMenu = 2;
    } else if (this.router.url.includes('/kyc-list')) {
      this.currentTopMenu = 3;
    }
    else {
      this.currentTopMenu = 1;
    }
  }

  initialObserver(): void {
    this.dataService.staffIdObserver().subscribe(
      res => {
        this.staff_id = res;
      },
      error => {
        console.log(error);
      }
    );
  }

  currentMenuCheck(id: any) {
    this.currentTopMenu = id;
    if (this.currentTopMenu == 2) {
      this.dataService.buyersListingFiltersSubject.value.asset_id = null;
    }
  }

  logOut() {
    localStorage.removeItem('staff_id');
    localStorage.removeItem('wallet');
    this.staff_id = null;
    this.dataService.staffIdSubject.next('');
    this.router.navigate(['/login']);
  }
}
