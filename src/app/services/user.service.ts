import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore) { }

  findUserByEmail(emailToFind: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection('users', ref => ref.where('email', '==', emailToFind).limit(1)).valueChanges()

      .subscribe(response => { 
          if (response) {
            resolve(response[0]);
          } else {
            reject('user not registered');
          } 
      });
    });
  }

  findByEvent(eventId: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection('users', ref => ref.where('events', '==', eventId)).snapshotChanges()
        .pipe(map((snapshot: any) => {
          return snapshot.map(this.mapToUser);
        }))
        .subscribe(response => {
            if (response) {
              return resolve(response);
            
            }
            return reject('error finding event by id');
        });
    });
  }

  mapToUser = doc => {
    const user = doc.payload.doc.data();
    user.uid = doc.payload.doc.id;
    return user;
  }

  delete(uid: string) {
    return this.db.collection('users').doc(uid).delete();
  }

  update(user: any) {
    return this.db.collection('users').doc(user.uid).set(user);
  }
}
