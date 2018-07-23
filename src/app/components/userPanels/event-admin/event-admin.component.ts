import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user.interface';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { RoleRouterService } from '../../../services/role-router.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.css']
})
export class EventAdminComponent implements OnInit {

  user: User;
  token: string;

  constructor(private loginService: LoginService,
              private roleRouterService: RoleRouterService,
              private tokenService: TokenService,
              private router: Router) {
  
    this.user = this.loginService.user;

    // if (!this.user) {
    //   this.router.navigate(['home']);
    // }
  }

  ngOnInit() {
  }
  
  generateToken(eventId: string, role: number) {
     
    this.tokenService.generate(eventId, role)
      .then((result: any) => {
        console.log('token', result);
        
        this.token = result.token;
      })
      .catch((err) => {
        console.error(err);
    });
  }

}
