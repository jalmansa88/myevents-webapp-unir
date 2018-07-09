import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent {

  constructor(public loginService: LoginService) { }

  loginFacebook() {
    console.log('Login with Facebook');
    this.loginService.loginFacebook();
  }

  loginEmail() {
    console.log('Login with email');
    this.loginService.loginEmail('a@b.com', '1234');
  }
}
