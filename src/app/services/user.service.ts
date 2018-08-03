import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: AngularFirestore) {}

  findUserByEmail(emailToFind: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection('users', ref =>
          ref.where('email', '==', emailToFind).limit(1)
        )
        .snapshotChanges()
        .subscribe(response => {
          if (response) {
            const user: User = response[0].payload.doc.data();
            user.uid = response[0].payload.doc.id;
            resolve(user);
          } else {
            reject('user not registered');
          }
        });
    });
  }

  findByEventUid(event_uid: string) {
    const users: any[] = [];
    return new Promise((resolve, reject) => {
      this.db
        .collection('attendees', ref => ref.where('event_uid', '==', event_uid))
        .snapshotChanges()
        .subscribe((attendeesSnaps: any) => {
          attendeesSnaps.forEach((attendeeSnapshot: any) => {
            this.db
              .collection('users')
              .doc(attendeeSnapshot.payload.doc.data().user_uid)
              .valueChanges()
              .subscribe((user: any) => {
                console.log(
                  'user find by event uid',
                  attendeeSnapshot.payload.doc.data().user_uid
                );
                console.log('user found', user);

                user.uid = attendeeSnapshot.payload.doc.data().user_uid;
                users.push(user);
              });
          });
        });
      resolve(users);
    });
  }

  mapToUser = doc => {
    const user = doc.payload.doc.data();
    user.uid = doc.payload.doc.id;
    return user;
  };

  delete(uid: string) {
    return this.db
      .collection('users')
      .doc(uid)
      .delete();
  }

  update(user: any) {
    return this.db
      .collection('users')
      .doc(user.uid)
      .set(user);
  }
}
