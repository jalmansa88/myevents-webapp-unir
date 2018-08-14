import { Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { User } from '../../interfaces/user.interface';
import { LoginService } from '../../services/login.service';
import { RoleRouterService } from '../../services/role-router.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: []
})
export class LoginComponent {
  @ViewChild('f')
  public form: NgForm;

  email: string;
  password: string;
  loading = false;

  constructor(
    public loginService: LoginService,
    private userRouter: RoleRouterService,
    private toastService: ToastrService
  ) {}

  loginWithEmail() {
    this.loading = true;
    this.loginService
      .loginEmail(this.email, this.password)
      .then((user: User) => {
        this.loading = false;
        this.toastService.success('Success Login');
        this.userRouter.routeUser(user);
      })
      .catch(err => {
        this.loading = false;
        this.toastService.error(err.message);
        this.loginService.logout();
      });
  }

  resetForm() {
    this.form.resetForm();
  }
}
