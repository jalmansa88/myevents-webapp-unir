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
                events.push(event);
              })
              .catch(err => {
                reject(err);
              });
          });
        })
        .catch(err => {
          reject(err);
        });
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
          return this.db
            .collection('events')
            .doc(event_uid)
            .ref.get();
        })
        .then(event => {
          console.log(event);

          if (!event) {
            reject('Invalid Event UID');
          }
          return event;
        })
        .then((event: any) => {
          this.db.collection('attendees').add({
            user_uid: user_uid,
            event_uid: event_uid
          });
          console.log(event.data());

          resolve(event.data());
        })
        .catch(err => {
          reject(err);
        });
    });
  }
}
