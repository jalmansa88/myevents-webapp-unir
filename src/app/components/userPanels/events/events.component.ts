import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../../../interfaces/user.interface';
import { EventsService } from '../../../services/events.service';
import { LoginService } from '../../../services/login.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  user: User;
  events: any[];
  error = false;
  msg: string;
  token: string;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private eventService: EventsService,
    private tokenService: TokenService
  ) {
    this.user = this.loginService.user;
  }

  ngOnInit() {
    // if (!this.user) {
    //   this.router.navigate(['home']);
    // }
    this.eventService
      .findByUserUid(this.user.uid)
      .then((result: any[]) => {
        console.log(result);
        this.events = result;
      })
      .catch(err => {
        console.error(err);
      });
  }

  registerInNewEvent() {
    console.log(this.token);

    this.tokenService
      .findToken(this.token)
      .then(token => {
        return this.eventService.addAttendeeToEvent(
          this.user.uid,
          token.eventId
        );
      })
      .then(result => {
        console.log(result);

        this.msg = 'Registrado al evento correctamente';
      })
      .catch(err => {
        console.log(err);

        this.msg = err;
        this.error = true;
      });
  }
}
