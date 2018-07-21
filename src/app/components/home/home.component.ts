import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { RoleRouterService } from '../../services/role-router.service';

declare var $;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: []
})
export class HomeComponent implements OnInit {
  
  isLoginWithEmail = false;
  errorMsg: string;

  constructor(public loginService: LoginService,
              private roleRouterService: RoleRouterService) { }

  ngOnInit() { 
    if (this.loginService.user) {
      this.roleRouterService.routeUser(this.loginService.user);
    }

    $('.close').click(function() {
      $('#errorAlert').alert('close');
  });
  }

  loginFacebook() {
    this.loginService.loginFacebook()
    .then((result) => {
      this.roleRouterService.routeUser(this.loginService.user);
    })
    .catch((err) => {
      this.errorMsg = err;
    });
  }

  openEmailRegistrationForm() {
    this.isLoginWithEmail = true;
  }
}
