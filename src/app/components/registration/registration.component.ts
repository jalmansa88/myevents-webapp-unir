import { Component } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { Router } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { NgForm } from '@angular/forms';
import { TokenService } from '../../services/token.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  
  user: User = {};
  fbToken: any = {};
  token: string;
  showForm = false;
  loading = false;
  confirmPass: string;

  invalidToken = false;
  errMsg: string;
  successMsg: string;

  constructor(private router: Router, private regService: RegistrationService, private tokenService: TokenService) { }

  registerWithFb(token) {
    this.showForm = false;
    
    this.checkToken()
      .then((result) => {
        this.fbToken = result;
        this.regService.withFacebook();
      }).catch((err) => {
        console.error(err);
        this.invalidToken = true;
    });
  }
  
  registerWithEmail() {
    this.checkToken()
      .then((result) => {
        this.fbToken = result;
        this.makeEmailRegistration();
      }).catch((err) => {
        this.invalidToken = true;
    });
  }

  makeEmailRegistration() {
    this.regService.withEmail(this.user.email, this.user.password)
      .then(response => { 
        this.successMsg = 'Registro satisfactorio';
        this.router.navigate(['home']);
      }).catch(err => this.errMsg = err);
  }

  makeFbRegistration() {
    
  }

  showEmailRegisterForm() {
    this.showForm = true;
  }

  checkToken(): Promise<any> {
      return new Promise((resolve, reject) => {
        this.tokenService.findToken(this.token)
          .subscribe(response => {
              if (response[0]) {
                resolve(response[0]);
              } else {
                reject('invalid token');
              }
          });
      });
  }
}
