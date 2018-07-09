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

  registerWithFb() {
    this.showForm = false;
    this.regService.withFacebook(this.token, this.user);
  }
  
  registerWithEmail() {
    this.regService.withEmail(this.token, this.user)
      .then(response => { 
        this.successMsg = 'Registro satisfactorio';
        this.router.navigate(['home']);
      }).catch(err => {
        this.errMsg = err;
        this.invalidToken = true;
      });
  }

  showEmailRegisterForm() {
    this.showForm = true;
  }
}
