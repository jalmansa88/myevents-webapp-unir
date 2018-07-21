import { Component, ViewChild } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { NgForm } from '@angular/forms';
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
  errMsg: string;
  successMsg: string;

  constructor(public loginService: LoginService,
              private userRouter: RoleRouterService) { }

  loginWithEmail() {
    this.loading = true;
    this.loginService.loginEmail(this.email, this.password)
      .then((result) => {
          this.loading = false;
          this.successMsg = 'success login';
          this.userRouter.routeUser(this.loginService.user);
      }).catch((err) => { 
          this.loading = false;
          this.errMsg = err;
      });
  }

  resetForm() {
    this.errMsg = null;
    this.form.resetForm();
  }

}
