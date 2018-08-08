import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../interfaces/user.interface';
import { LoginService } from '../../services/login.service';
import { RegistrationService } from '../../services/registration.service';
import { RoleRouterService } from '../../services/role-router.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  user: User = {};
  token: string;
  showForm = false;
  loading = false;

  invalidToken = false;
  isError = false;
  msg: string;

  constructor(
    private router: Router,
    private regService: RegistrationService,
    public loginService: LoginService,
    public roleRouterService: RoleRouterService
  ) {}

  ngOnInit() {
    if (this.loginService.user) {
      this.roleRouterService.routeUser(this.loginService.user);
    }
  }

  registerWithFb() {
    this.showForm = false;
    this.loading = true;
    this.isError = false;

    if (!this.token) {
      this.msg =
        'Introduzca un Código de registro válido. Consulte al Administrador del evento';
      this.isError = true;
    }

    this.regService
      .withFacebook(this.token, this.user)
      .then(success => {
        console.log('exito', success);
        this.msg = 'Registro satisfactorio';
        this.router.navigate(['home']);
      })
      .catch(err => {
        if (err === 'invalid token') {
          this.msg =
            'Introduzca un Código de registro válido. Consulte al Administrador del evento';
          this.isError = true;
        }
        this.loginService.logout();
        console.log(this.loginService.user);
        console.error(err);
      });
  }

  registerWithEmail() {
    this.loading = true;
    this.isError = false;
    this.regService
      .withEmail(this.token, this.user)
      .then(response => {
        console.log(response);

        this.msg = 'Registro satisfactorio';
        this.loading = false;
        this.router.navigate(['home']);
      })
      .catch(err => {
        console.error(err);

        this.isError = true;
        this.msg = err;
        this.loading = false;
      });
  }

  showEmailRegisterForm() {
    this.showForm = true;
  }
}
