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
    // if (!this.user) {
    //   this.router.navigate(['home']);
    // }
    
    this.eventService.getAll()
      .pipe(map((snapshot: any) => {
        return snapshot.map(this.mapToEvent);
      }))
      .subscribe((result: any) => {
        this.events = result;
      });
    }
    
    mapToEvent = doc => {
      const event = doc.payload.doc.data();
      event.uid = doc.payload.doc.id;
      
      return event;
    }
    
    generateToken(event: any) {
      // ROLE 3 is a Event Administrator.
      this.tokenService.generate(event.uid, 3)
        .then((result: any) => {
          event.token = result.token;
        })
        .catch((err) => {
          console.error(err);
      });
    }
}
