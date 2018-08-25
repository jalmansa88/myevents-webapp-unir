import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { User } from '../../../interfaces/user.interface';
import { EventsService } from '../../../services/events.service';
import { LoginService } from '../../../services/login.service';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.css']
})
export class EventAdminComponent implements OnInit {
  event: any;
  user: User;
  token: string;
  // TODO: move to DB
  roles = [
    {
      name: 'Temporal',
      level: 0
    },
    {
      name: 'User',
      level: 1
    },
    {
      name: 'VIP',
      level: 2
    }
  ];

  constructor(
    private router: Router,
    private loginService: LoginService,
    private tokenService: TokenService,
    private eventsService: EventsService,
    private activatedRoute: ActivatedRoute,
    private toastService: ToastrService
  ) {}

  ngOnInit() {
    this.user = this.loginService.user;

    // if (!this.user) {
    //   this.router.navigate(['home']);
    // }
    this.activatedRoute.params.subscribe(params => {
      this.eventsService
        .findByUid(params.uid)
        .then((result: any) => {
          result.tokenrole = this.roles[0].level;

          this.event = result;
        })
        .catch(err => {});
    });
  }

  generateToken(event: any) {
    event.loading = true;

    this.tokenService
      .generate(event.uid, event.tokenrole)
      .then((result: any) => {
        delete event.loading;

        this.token = result.token;
      })
      .catch(err => {
        console.log(err);

        delete event.loading;
        this.toastService.error(err);
      });
  }
}
