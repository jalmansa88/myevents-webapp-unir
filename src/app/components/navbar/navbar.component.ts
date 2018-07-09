import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: []
})
export class NavbarComponent {

  constructor(public loginService: LoginService) { }

  logout() {
    this.loginService.logout();
  }

}
