import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { User } from '../../interfaces/user.interface';
import { EventsService } from '../../services/events.service';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users-events-list',
  templateUrl: './users-events-list.component.html',
  styleUrls: ['./users-events-list.component.css']
})
export class UsersEventsComponent implements OnInit {
  @Input()
  event_uid: string;

  // attendee
  users: any[] = [];
  indexToDelete: number;

  constructor(
    private userService: UserService,
    private eventService: EventsService,
    private toastService: ToastrService,
    public loginService: LoginService
  ) {}

  ngOnInit() {
    this.userService
      .findByEventUid(this.event_uid)
      .then((result: User[]) => {
        this.users = result;
      })
      .catch(err => {
        this.toastService.error(
          'Error buscando usuarios para este evento: ' + err
        );
      });
  }

  update(user: User) {
    return this.userService
      .update(user)
      .then(result => {
        this.toastService.success('Usuario actualizado correctamente');
      })
      .catch(err => {
        this.toastService.error(err);
      });
  }

  // No se usa por ahora. Se hace desuscribe
  delete(i: number) {
    return this.userService
      .delete(this.users[i].uid)
      .then(result => {
        console.log('borrado user');

        this.toastService.success('Usuario eliminado del evento correctamente');
        this.users.splice(i, 1);
      })
      .catch(err => {
        this.toastService.error('Error borrando user: ' + err);
      });
  }

  unsubscribeFromEvent() {
    this.eventService
      .unsubscribeUserFromEvent(
        this.users[this.indexToDelete].uid,
        this.event_uid
      )
      .then(result => {
        this.toastService.success('Usuario dado de baja correctamente');
        this.users.splice(this.indexToDelete, 1);
      })
      .catch(err => {
        this.toastService.error('Error dando de baja al User: ' + err);
      });
  }

  setUserToDelete(i: number) {
    this.indexToDelete = i;
  }
}
