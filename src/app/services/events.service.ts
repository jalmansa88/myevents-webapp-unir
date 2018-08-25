import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

import { LoginService } from './login.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(
    private db: AngularFirestore,
    private userService: UserService,
    private loginService: LoginService
  ) {}

  getAll() {
    return this.db
      .collection('events')
      .snapshotChanges()
      .pipe(
        map((snapshot: any) => {
          return snapshot.map(this.mapToEvent);
        })
      );
  }

  save(event: any) {
    return this.db.collection('events').add(event);
  }

  // findByUid(uid: string) {
  //   return this.db
  //     .collection('events')
  //     .doc(uid)
  //     .snapshotChanges()
  //     .pipe(
  //       map((snapshot: any) => {
  //         const event = snapshot.payload.data();
  //         event.uid = snapshot.payload.id;
  //         return event;
  //       })
  //     );
  // }
  findByUid(uid: string) {
    return new Promise((resolve, reject) => {
      this.db
        .collection('events')
        .doc(uid)
        .ref.get()
        .then(resultDoc => {
          const event = resultDoc.data();
          event.uid = resultDoc.id;
          resolve(event);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  mapToEvent = doc => {
    const event = doc.payload.doc.data();
    event.uid = doc.payload.doc.id;

    return event;
  };

  findByUserUid(user_uid: string) {
    const events: any[] = [];
    const eventsRole: Map<string, number> = new Map();

    return new Promise((resolve, reject) => {
      this.db
        .collection('attendees')
        .ref.where('user_uid', '==', user_uid)
        .get()
        .then((attendeesSnaps: any) => {
          attendeesSnaps.forEach((attendeeSnapshot: any) => {
            this.db
              .collection('events')
              .doc(attendeeSnapshot.data().event_uid)
              .ref.get()
              .then((eventSnap: any) => {
                const event = eventSnap.data();
                event.uid = eventSnap.id;
                event.role = attendeeSnapshot.data().role;
                events.push(event);

                eventsRole.set(event.uid, event.role);
              })
              .catch(err => {
                reject(err);
              });
          });
        })
        .catch(err => {
          reject(err);
        });
      this.loginService.user.eventRolesMap = eventsRole;

      resolve(events);
    });
  }

  addAttendeeToEvent(user_uid: string, event_uid: string, role: number) {
    return new Promise((resolve, reject) => {
      this.userService
        .findByUid(user_uid)
        .ref.get()
        .then(user => {
          if (!user) {
            reject('Invalid User UID');
          }
          return this.db
            .collection('events')
            .doc(event_uid)
            .ref.get();
        })
        .then(event => {
          if (!event) {
            reject('Invalid Event UID');
          }
          return event;
        })
        .then((event: any) => {
          this.db.collection('attendees').add({
            user_uid: user_uid,
            event_uid: event_uid,
            role: role
          });
          const e = event.data();
          e.uid = event.id;
          resolve(e);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  unsubscribeUserFromEvent(user_uid: string, event_uid: string) {
    return new Promise((resolve, reject) => {
      this.db
        .collection('attendees')
        .ref.where('user_uid', '==', user_uid)
        .where('event_uid', '==', event_uid)
        .limit(1)
        .get()
        .then((result: any) => {
          resolve(
            this.db
              .collection('attendees')
              .doc(result.docs[0].id)
              .delete()
          );
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
