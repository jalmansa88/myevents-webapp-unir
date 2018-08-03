import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../interfaces/user.interface';
import { EventsService } from '../../../services/events.service';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  user: User;
  events: any[];

  constructor(
    private loginService: LoginService,
    private router: Router,
    private eventService: EventsService
  ) {
    this.user = this.loginService.user;
  }

  ngOnInit() {
    // if (!this.user) {
    //   this.router.navigate(['home']);
    // }
    this.eventService
      .findByUserUid(this.user.uid)
      // .findByUserUid('yiABYcxALxkcT2w3KpOz')
      .then((result: any[]) => {
        console.log(result);

        this.events = result;
      })
      .catch(err => {
        console.error(err);
      });
  }
}
