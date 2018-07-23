import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private db: AngularFirestore) { }

  getAll() {
    return this.db.collection('events').snapshotChanges();
  }
}
