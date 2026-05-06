import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/shared/services/http.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: any[] = [];
  page: number = 1;
  pageSize: number = 10;
  totalUsers: number = 0;
  searchInput: string = '';

  constructor(private httpService: HttpService, private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers() {
    this.spinner.show();
    const filters = {
      searchInput: this.searchInput
    };
    this.httpService.getUsers(filters, this.page, this.pageSize).then(
      (res: any) => {
        this.users = res.users;
        this.totalUsers = res.total_users;
        this.spinner.hide();
      },
      (err) => {
        console.error(err);
        this.spinner.hide();
      }
    );
  }

  onSearch() {
    this.page = 1;
    this.fetchUsers();
  }

  onPageChange(event: any) {
    this.page = event;
    this.fetchUsers();
  }
}
