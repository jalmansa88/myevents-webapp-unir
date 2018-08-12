import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent {
  constructor(
    public loginService: LoginService,
    private toastService: ToastrService
  ) {}

  logout() {
    this.toastService.warning('Deslogado correctamente');
    this.loginService.logout();
  }
}
