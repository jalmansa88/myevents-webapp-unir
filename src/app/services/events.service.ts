import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private db: AngularFirestore, private userService: UserService) {}

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

  findByUid(uid: string) {
    return this.db
      .collection('events')
      .doc(uid)
      .snapshotChanges()
      .pipe(
        map((snapshot: any) => {
          const event = snapshot.payload.data();
          event.uid = snapshot.payload.id;
          return event;
        })
      );
  }

  mapToEvent = doc => {
    const event = doc.payload.doc.data();
    event.uid = doc.payload.doc.id;

    return event;
  };

  findByUserUid(user_uid: string) {
    let events: any[] = [];
    console.log(events);

    return new Promise((resolve, reject) => {
      console.log(events);

      this.db
        .collection('attendees', ref => ref.where('user_uid', '==', user_uid))
        .snapshotChanges()
        .subscribe((attendeesSnaps: any) => {
          events = [];
          attendeesSnaps.forEach((attendeeSnapshot: any) => {
            this.db
              .collection('events')
              .doc(attendeeSnapshot.payload.doc.data().event_uid)
              .valueChanges()
              .subscribe((event: any) => {
                console.log(events);
                event.uid = attendeeSnapshot.payload.doc.data().event_uid;
                events.push(event);
                console.log('pushing', event);
              });
          });
        });
      console.log('all events', events);

      resolve(events);
    });
  }

  addAttendeeToEvent(user_uid: string, event_uid: string) {
    return new Promise((resolve, reject) => {
      this.userService
        .findByUid(user_uid)
        .ref.get()
        .then(user => {
          if (!user) {
            reject('Invalid User UID');
          }
          return this.db.collection('events').ref.get();
        })
        .then(event => {
          if (!event) {
            reject('Invalid Event UID');
          }
        })
        .then(() => {
          resolve(
            this.db.collection('attendees').add({
              user_uid: user_uid,
              event_uid: event_uid
            })
          );
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
