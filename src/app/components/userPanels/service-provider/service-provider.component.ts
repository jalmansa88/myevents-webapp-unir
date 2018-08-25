import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { User } from '../../../interfaces/user.interface';
import { EventsService } from '../../../services/events.service';
import { LoginService } from '../../../services/login.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.component.html',
  styleUrls: ['./service-provider.component.css']
})
export class ServiceProviderComponent implements OnInit {
  user: User;
  events: any[];
  sptoken: string;

  constructor(
    private loginService: LoginService,
    private eventService: EventsService,
    private tokenService: TokenService,
    private router: Router,
    private toastService: ToastrService
  ) {
    this.user = this.loginService.user;
  }

  ngOnInit() {
    if (!this.user) {
      this.router.navigate(['home']);
    }

    this.eventService.getAll().subscribe((result: any) => {
      this.events = result;
    });
  }

  generateToken(event: any) {
    event.loading = true;
    // ROLE 3 is a Event Administrator.
    this.tokenService
      .generate(event.uid, 3)
      .then((result: any) => {
        event.tokenvalue = result.token;
        delete event.loading;
      })
      .catch(err => {
        this.toastService.error(err);
        delete event.loading;
      });
  }

  newEvent() {
    this.events.push({ isNew: true });
  }

  saveEvent(event: any) {
    delete event.isNew;
    this.events.pop();
    this.eventService
      .save(event)
      .then(result => {})
      .catch(err => {
        this.toastService.error(err);
      });
  }

  cancel(event: any) {
    this.events.pop();
  }

  generateSPToken() {
    this.tokenService
      .generate(null, 4)
      .then((result: any) => {
        this.sptoken = result.token;
      })
      .catch(err => {
        this.toastService.error(err.error);
      });
  }
}
