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
  msg: string;
  isError = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.findByEvent(this.eventId)
      .then((result) => {
        this.users = result;
      }).catch((err) => {
        this.onError('Error buscando usuarios para este evento: ' + err);
      });
  }

  update(user: any) {
    return this.userService.update(user)
        .then((result) => {
          this.onSuccess('Usuario actualizado correctamente');
        }).catch((err) => {
          this.onError(err);
        });
  }

  delete(i: number) {
    return this.userService.delete(this.users[i].uid)
        .then((result) => {
          this.onSuccess('Usuario eliminado del evento correctamente');
          this.users.splice(i, 1);
          
        }).catch((err) => {
          this.onError('Error borrando user: ' + err);
        });
  }

  onSuccess(msg: string) {
    this.isError = false;
    this.msg = msg;
  }

  onError(msg: string) {
    this.isError = true;
    this.msg = msg;
  }

}
