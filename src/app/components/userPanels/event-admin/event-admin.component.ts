import { Component, OnInit } from '@angular/core';
import { User } from '../../../interfaces/user.interface';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { TokenService } from '../../../services/token.service';
import { EventsService } from '../../../services/events.service';

@Component({
  selector: 'app-event-admin',
  templateUrl: './event-admin.component.html',
  styleUrls: ['./event-admin.component.css']
})
export class EventAdminComponent implements OnInit {
  
  // TODO: make it string
  events: any[] = [];
  isEventLoaded = false;

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

  constructor(private loginService: LoginService,
              private tokenService: TokenService,
              private router: Router,
              private eventsService: EventsService) {
  
    this.user = this.loginService.user;

    if (!this.user) {
      this.router.navigate(['home']);
    }
    
    this.eventsService.findByUid(this.user.events)
      .subscribe(result => {
          result.tokenrole = this.roles[0].level;
          
          this.events.push(result);
          this.isEventLoaded = true;
      });
  }

  ngOnInit() {
    
  }
  
  generateToken(eventId: string, role: number) {
    console.log('event id', eventId);
    console.log('role', role);
    

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
