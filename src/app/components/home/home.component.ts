import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LoginService } from '../../services/login.service';
import { RoleRouterService } from '../../services/role-router.service';

declare var $;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent implements OnInit {
  isLoginWithEmail = false;
  tempToken: string;

  constructor(
    public loginService: LoginService,
    private roleRouterService: RoleRouterService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    if (this.loginService.user) {
      this.roleRouterService.routeUser(this.loginService.user);
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
