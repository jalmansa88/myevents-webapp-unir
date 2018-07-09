import { Component } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { Router } from '@angular/router';
import { RegistrationService } from '../../services/registration.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent {
  f: NgForm;
  user: User = {};
  token: string;
  showForm = false;
  loading = false;
  confirmPass: string;

  constructor(private router: Router, private regService: RegistrationService) { }

  registerWithFb(token) {
    this.showForm = false;
    this.regService.withFacebook();
  }
  
  registerWithEmail(token) {
    
  }

  showEmailRegisterForm() {
    this.showForm = true;
  }
}
