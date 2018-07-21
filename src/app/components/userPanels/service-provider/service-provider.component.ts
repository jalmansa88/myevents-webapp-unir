import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.component.html',
  styleUrls: ['./service-provider.component.css']
})
export class ServiceProviderComponent implements OnInit {

  user: User;

  constructor(private loginService: LoginService,
    private router: Router) {

  this.user = this.loginService.user;
  }

  ngOnInit() {
    // if (!this.user) {
    //   this.router.navigate(['home']);
    // }

    
  }

}
