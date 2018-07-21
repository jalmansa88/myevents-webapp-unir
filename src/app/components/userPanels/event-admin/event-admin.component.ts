import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user.interface';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.css']
})
export class EventAdminComponent implements OnInit {

  user: User;

  constructor(private loginService: LoginService,
              private router: Router) {
  
    this.user = this.loginService.user;
  }

  ngOnInit() {
  }

}
