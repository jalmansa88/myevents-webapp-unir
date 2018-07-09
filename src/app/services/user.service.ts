import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private db: AngularFirestore) { }

  findUserByEmail(emailToFind: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection('users', ref => ref.where('email', '==', emailToFind).limit(1)).valueChanges()
        .subscribe(response => { 
          resolve(response);
          reject('user not registered');
        });
      });
    }
}
