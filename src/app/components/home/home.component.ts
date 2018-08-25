import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { User } from '../../interfaces/user.interface';
import { LoginService } from '../../services/login.service';
import { RoleRouterService } from '../../services/role-router.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['../registration/registration.component.css']
})
export class HomeComponent implements OnInit {
  isLoginWithEmail = false;
  tempToken: string;
  user: User;
  userObservable;

  constructor(
    public loginService: LoginService,
    private roleRouterService: RoleRouterService,
    private toastService: ToastrService
  ) {
    this.userObservable = loginService.userObservable.subscribe(user => {
      this.user = user;
      if (this.loginService.user) {
        this.roleRouterService.routeUser(this.loginService.user);
      }
    });
  }

  ngOnInit() {
    if (this.user) {
      this.roleRouterService.routeUser(this.user);
    }
  }

  loginFacebook() {
    this.loginService
      .loginFacebook()
      .then(result => {
        this.roleRouterService.routeUser(this.loginService.user);
      })
      .catch(err => {
        this.toastService.error(err);
      });
  }

  openEmailRegistrationForm() {
    this.isLoginWithEmail = true;
  }

  temporalAccess() {
    this.loginService
      .temporalLogin(this.tempToken)
      .then(result => {
        this.roleRouterService.routeUser(this.loginService.user);
      })
      .catch(err => {
        this.toastService.error(err);
      });
  }
}
