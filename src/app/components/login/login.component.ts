import { Component, ViewChild } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { NgForm } from '@angular/forms';
import { RoleRouterService } from '../../services/role-router.service';
import { User } from '../../interfaces/user.interface';

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
  msg: string;
  isError = false;
  loading = false;

  constructor(public loginService: LoginService,
              private userRouter: RoleRouterService) { }

  loginWithEmail() {
    this.loading = true;
    this.loginService.loginEmail(this.email, this.password)
      .then((user: User) => {
          console.log(user);
          
          this.loading = false;
          this.isError = false;
          this.msg = 'success login';
          this.userRouter.routeUser(user);
      }).catch((err) => { 
          this.loading = false;
          this.isError = true;
          this.msg = err;
      });
  }

  resetForm() {
    this.msg = null;
    this.isError = false;
    this.form.resetForm();
  }

}
