import { Component, Input, OnInit } from '@angular/core';

import { User } from '../../interfaces/user.interface';
import { EventsService } from '../../services/events.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-events',
  templateUrl: './users-events.component.html',
  styleUrls: ['./users-events.component.css']
})
export class UsersEventsComponent implements OnInit {
  @Input() event_uid: string;

  users: User[] = [];
  msg: string;
  isError = false;

  constructor(
    private userService: UserService,
    private eventService: EventsService
  ) {}

  ngOnInit() {
    this.userService
      .findByEventUid(this.event_uid)
      .then((result: User[]) => {
        this.users = result;
      })
      .catch(err => {
        this.onError('Error buscando usuarios para este evento: ' + err);
      });
  }

  update(user: User) {
    return this.userService
      .update(user)
      .then(result => {
        this.onSuccess('Usuario actualizado correctamente');
      })
      .catch(err => {
        this.onError(err);
      });
  }

  delete(i: number) {
    return this.userService
      .delete(this.users[i].uid)
      .then(result => {
        this.onSuccess('Usuario eliminado del evento correctamente');
        this.users.splice(i, 1);
      })
      .catch(err => {
        this.onError('Error borrando user: ' + err);
      });
  }

  unsubscribeFromEvent(i: number) {
    this.eventService.unsubscribeUserFromEvent(
      this.users[i].uid,
      this.event_uid
    );
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
