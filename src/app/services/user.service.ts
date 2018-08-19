import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private db: AngularFirestore) { }

  add(user: User) {
    return this.db.collection('users').add({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      phone: user.phone,
    });
  }

  findByUid(uid: string) {
    return this.db.collection('users').doc(uid);
  }

  findUserByEmail(emailToFind: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection('users')
        .ref.where('email', '==', emailToFind)
        .limit(1)
        .get()
        .then(response => {
          if (response) {
            const user: User = response.docs[0].data();
            user.uid = response.docs[0].id;
            resolve(user);
          } else {
            reject('user not registered');
          }
        })
        .catch(err => {
          console.log(err);

          reject('user not registered');
        });
    });
  }

  async findByEventUid(event_uid: string) {
    const users: any[] = [];

    return new Promise((resolve, reject) => {
      this.db
        .collection('attendees')
        .ref.where('event_uid', '==', event_uid)
        .get()
        .then(attendees => {
          attendees.forEach((attendee: any) => {
            this.db
              .collection('users')
              .doc(attendee.data().user_uid)
              .ref.get()
              .then((user: any) => {
                const userAttendee = user.data();
                userAttendee.uid = attendee.data().user_uid;

                users.push(userAttendee);
              })
              .catch(err => {
                reject(err);
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
