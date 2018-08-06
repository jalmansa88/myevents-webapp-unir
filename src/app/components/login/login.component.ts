import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';

import { User } from '../../interfaces/user.interface';
import { LoginService } from '../../services/login.service';
import { RoleRouterService } from '../../services/role-router.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent {
  @ViewChild('f') public form: NgForm;

  email: string;
  password: string;
  msg: string;
  isError = false;
  loading = false;

  constructor(
    public loginService: LoginService,
    private userRouter: RoleRouterService
  ) {}

  loginWithEmail() {
    this.loading = true;
    this.loginService
      .loginEmail(this.email, this.password)
      .then((user: User) => {
        this.loading = false;
        this.isError = false;
        this.msg = 'success login';
        this.userRouter.routeUser(user);
      })
      .catch(err => {
        this.loading = false;
        this.isError = true;
        this.msg = err.message;
      });
  }

  resetForm() {
    this.msg = null;
    this.isError = false;
    this.form.resetForm();
  }
}
