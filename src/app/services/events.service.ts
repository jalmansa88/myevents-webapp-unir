import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  constructor(private db: AngularFirestore) {}

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
    const events: any[] = [];
    return new Promise((resolve, reject) => {
      this.db
        .collection('attendees', ref => ref.where('user_uid', '==', user_uid))
        .snapshotChanges()
        .subscribe((attendeesSnaps: any) => {
          attendeesSnaps.forEach((attendeeSnapshot: any) => {
            this.db
              .collection('events')
              .doc(attendeeSnapshot.payload.doc.data().event_uid)
              .valueChanges()
              .subscribe(event => {
                events.push(event);
              });
          });
        });
      resolve(events);
    });
  }
}
