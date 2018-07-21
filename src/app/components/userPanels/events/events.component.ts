import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { User } from '../../../interfaces/user.interface';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  
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
