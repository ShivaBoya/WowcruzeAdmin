import { Component, OnInit, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpService } from 'src/app/shared/services/http.service';
import { SignInInput, SignInOutput, VerifySignInInput, EmailLoginInput, EmailLoginOutput } from 'src/app/shared/modals/login.modal';
import { Constant } from 'src/app/shared/modals/extra.modal';
import { DataService } from 'src/app/shared/services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  showModal: any = false;
  isLoggedIn: any = true;
  isOTP: any = false;
  userNotExist: boolean = false;
  myForm: any;
  isError: any;
  email: any = '';
  password: any = '';
  loginState: 'WELCOME' | 'SIGNIN' = 'WELCOME';

  constructor(
    private el: ElementRef,
    private httpService: HttpService,
    private dataService: DataService,
    private router: Router
  ) {
    this.myForm = new FormGroup({
      phonenumber: new FormControl(null, Validators.pattern('[0-9]{10}')),
    });

  }

  ngOnInit(): void {
    this.showModal = false;
  }

  enterSignIn() {
    this.loginState = 'SIGNIN';
  }

  isNumber(evt: any) {

    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

  signIn() {
    this.userNotExist = false;
    this.isError = false;
    if (this.email && this.password) {
      let loginParams = {
        email: this.email,
        password: this.password
      };
      (document.getElementById("loginLoaderSignInId") as HTMLBodyElement).style.display = "flex";
      this.httpService.loginWithEmail(loginParams).then(
        (response: any) => {
          (document.getElementById("loginLoaderSignInId") as HTMLBodyElement).style.display = "none";
          if (response.AuthenticationResult && response.AuthenticationResult.AccessToken) {
            localStorage.setItem('session', response.AuthenticationResult.AccessToken);
            localStorage.setItem('staff_id', response.AdminDetails.staff_id);
            this.dataService.staffIdSubject.next(response.AdminDetails.staff_id);
            this.router.navigate(['']);
          } else {
            this.isError = true;
          }
        },
        (error) => {
          (document.getElementById("loginLoaderSignInId") as HTMLBodyElement).style.display = "none";
          this.isError = true;
          if (error && error.includes('Registered')) {
            this.userNotExist = true;
          }
        }
      );
    }
  }

  close() {
    this.email = '';
    this.password = '';
    this.isLoggedIn = true;
    this.loginState = 'WELCOME';
    this.dataService.loginSubject.next(true);
  }
}

