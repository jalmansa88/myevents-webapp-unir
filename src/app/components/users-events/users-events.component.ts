import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-events',
  templateUrl: './users-events.component.html',
  styleUrls: ['./users-events.component.css']
})
export class UsersEventsComponent implements OnInit {
  
  @Input() eventId: string;

  users: any[] = [];
  
  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.findByEvent(this.eventId)
      .then((result) => {
        console.log(result);
        
        this.users = result;
      }).catch((err) => {
        console.error(err);
        
      });
  }

}
