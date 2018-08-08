import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { User } from '../../../interfaces/user.interface';
import { EventsService } from '../../../services/events.service';
import { LoginService } from '../../../services/login.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit, AfterContentChecked {
  user: User;
  events: any[];
  error = false;
  msg: string;
  token: string;
  dataRecovered: boolean;
  rendered: boolean;
  userSubscription: Subscription;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private eventService: EventsService,
    private tokenService: TokenService
  ) {}

  ngOnInit() {
    this.dataRecovered = false;
    this.rendered = false;
    this.userSubscription = this.loginService.userObservable.subscribe(user => {
      this.user = user;

      // if (!this.user) {
      //   this.router.navigate(['home']);
      // }
    });
  }

  ngAfterContentChecked() {
    if (!this.user) {
      this.user = this.loginService.user;
    }
    if (this.user && !this.dataRecovered) {
      this.eventService
        .findByUserUid(this.user.uid)
        .then((result: any[]) => {
          this.events = result;
          this.dataRecovered = true;
        })
        .catch(err => {
          console.error(err);
        });
    }
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
        this.events.push(result);

        this.msg = 'Registrado al evento correctamente';
      })
      .catch(err => {
        console.log(err);

        this.msg = err;
        this.error = true;
      });
  }

  unsubscribeUserFromEvent(i: number) {
    const event_uid = this.events[i].uid;
    console.log(this.events);
    console.log('indice', i);

    console.log('trying to unsubscribe of event', event_uid);
    this.eventService
      .unsubscribeUserFromEvent(this.user.uid, event_uid)
      .then(result => {
        this.events = this.events.filter(event => event.uid !== event_uid);
      })
      .catch(err => {});
  }
}
