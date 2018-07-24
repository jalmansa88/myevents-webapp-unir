import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private db: AngularFirestore) { }

  getAll() {
    return this.db.collection('events').snapshotChanges()
      .pipe(map((snapshot: any) => {
        return snapshot.map(this.mapToEvent);
      })
    );
  }

  findByUid(uid: string) {
    return this.db.collection('events').doc(uid).snapshotChanges()
      .pipe(map((snapshot: any) => {
        const event = snapshot.payload.data();
        event.uid = snapshot.payload.id;
        return event;
    }));
  }

  mapToEvent = doc => {
    const event = doc.payload.doc.data();
    event.uid = doc.payload.doc.id;
    
    return event;
  }
}
