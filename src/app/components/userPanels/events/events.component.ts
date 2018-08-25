import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  token: string;
  userToUnsubscribe: number;
  dataRecovered: boolean;
  rendered: boolean;
  userSubscription: Subscription;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private eventService: EventsService,
    private tokenService: TokenService,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.dataRecovered = false;
    this.rendered = false;

    console.log('user en events', this.user);

    this.userSubscription = this.loginService.userObservable.subscribe(user => {
      this.user = user;

      if (!this.user) {
        this.router.navigate(['home']);
      }

      console.log('user en events subscriber', this.user);

      if (this.user && !this.user.email) {
        // is anonymous
        this.eventService
          .findByUid(this.user.guestEvent)
          .then((result: any[]) => {
            this.events = result;
          });
      } else if (this.user) {
        this.eventService
          .findByUserUid(this.user.uid)
          .then((result: any[]) => {
            this.events = result;
            this.dataRecovered = true;
          })
          .catch(err => {
            this.toastService.error(err);
          });
      }
    });
  }

  ngAfterContentChecked() {
    if (!this.user) {
      this.user = this.loginService.user;
    }
    if (
      // is anonymous case
      this.user &&
      !this.user.email &&
      !this.events &&
      !this.dataRecovered
    ) {
      this.eventService
        .findByUid(this.user.guestEvent)
        .then((result: any[]) => {
          this.events = new Array(result);
        });

      this.dataRecovered = true;
    }
    if (this.user && !this.events && !this.dataRecovered) {
      this.eventService
        .findByUserUid(this.user.uid)
        .then((result: any[]) => {
          this.events = result;
          this.dataRecovered = true;
        })
        .catch(err => {
          this.toastService.error(err);
        });
    }
  }

  registerInNewEvent() {
    this.tokenService
      .findToken(this.token)
      .then(token => {
        return this.eventService.addAttendeeToEvent(
          this.user.uid,
          token.eventId,
          token.role
        );
      })
      .then((result: any) => {
        this.events.push(result);

        this.toastService.success('Registrado al evento correctamente');
      })
      .catch(err => {
        this.toastService.error(err);
      });
  }

  unsubscribeUserFromEvent() {
    const event_uid = this.events[this.userToUnsubscribe].uid;
    this.eventService
      .unsubscribeUserFromEvent(this.user.uid, event_uid)
      .then(result => {
        this.toastService.success('Dado de baja del Evento correctamente');
        this.events = this.events.filter(event => event.uid !== event_uid);
      })
      .catch(err => {});
  }

  setUserToDelete(index: number) {
    this.userToUnsubscribe = index;
  }
}
