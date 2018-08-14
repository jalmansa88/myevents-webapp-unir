import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

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

  constructor(
    private router: Router,
    private regService: RegistrationService,
    public loginService: LoginService,
    public roleRouterService: RoleRouterService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    if (this.loginService.user) {
      this.roleRouterService.routeUser(this.loginService.user);
    }
  }

  registerWithFb() {
    this.showForm = false;
    this.loading = true;

    if (!this.token) {
      this.toastService.error(
        'Introduzca un Código de registro válido. Consulte al Administrador del evento'
      );
    }

    this.regService
      .withFacebook(this.token, this.user)
      .then(success => {
        this.toastService.success('Registro satisfactorio');
        this.router.navigate(['home']);
      })
      .catch(err => {
        if (err === 'invalid token') {
          this.toastService.error(
            'Introduzca un Código de registro válido. Consulte al Administrador del evento'
          );
        }
        this.loginService.logout();
      });
  }

  registerWithEmail() {
    this.loading = true;
    this.regService
      .withEmail(this.token, this.user)
      .then(response => {
        console.log(response);

        this.toastService.success('Registro satisfactoio');
        this.loading = false;
        this.router.navigate(['home']);
      })
      .catch(err => {
        this.toastService.error(err);
        this.loading = false;
      });
  }

  showEmailRegisterForm() {
    this.showForm = true;
  }
}
