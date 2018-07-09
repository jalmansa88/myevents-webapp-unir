import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(public db: AngularFirestore) {  }

  findToken(tokenValueToFind: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection('tokens', ref => ref.where('value', '==', tokenValueToFind).limit(1)).valueChanges()
        .subscribe(response => response.length !== 0 ? resolve(response[0]) : reject('invalid token') );
    });
  }
}
