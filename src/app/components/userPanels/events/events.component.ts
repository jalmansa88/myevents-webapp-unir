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
  ) {}

  async ngOnInit() {
    this.user = await this.loginService.user;
    // if (!this.user) {
    //   this.router.navigate(['home']);
    // }
    this.eventService
      // .findByUserUid('wVRHjd8TVMD334RY8Rj3')
      .findByUserUid(this.user.uid)
      .then((result: any[]) => {
        this.events = result;
      })
      .catch(err => {
        console.error(err);
      });
  }

  registerInNewEvent() {
    this.tokenService
      .findToken(this.token)
      .then(token => {
        return this.eventService.addAttendeeToEvent(
          this.user.uid,
          token.eventId
        );
      })
      .then((result: any) => {
        console.log(result);
        this.events.push(result);

        this.msg = 'Registrado al evento correctamente';
      })
      .catch(err => {
        console.log(err);

        this.msg = err;
        this.error = true;
      });
  }
}
