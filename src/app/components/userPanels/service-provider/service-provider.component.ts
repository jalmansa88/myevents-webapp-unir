import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { Router } from '@angular/router';
import { User } from '../../../interfaces/user.interface';
import { EventsService } from '../../../services/events.service';
import { map } from 'rxjs/operators';
import { TokenService } from '../../../services/token.service';

@Component({
  selector: 'app-service-provider',
  templateUrl: './service-provider.component.html',
  styleUrls: ['./service-provider.component.css']
})
export class ServiceProviderComponent implements OnInit {
  
  user: User;
  events: any[];


  constructor(private loginService: LoginService,
              private eventService: EventsService,
              private tokenService: TokenService,
              private router: Router) {
  

  this.user = this.loginService.user;
  }

  ngOnInit() {
    if (!this.user) {
      this.router.navigate(['home']);
    }
    
    this.eventService.getAll()
      .subscribe((result: any) => {
        this.events = result;
      });
    }
  
  generateToken(event: any) {
    // ROLE 3 is a Event Administrator.
    this.tokenService.generate(event.uid, 3)
      .then((result: any) => {
        event.tokenvalue = result.token;
      })
      .catch((err) => {
        console.error(err);
    });
  }

  newEvent() {
    this.events.push({isNew: true});
  }

  saveEvent(event: any) {
    delete event.isNew;
    this.events.pop();
    this.eventService.save(event)
      .then((result) => {
        // this.events.push(result);
      }).catch((err) => {
        
      });
  }

}
