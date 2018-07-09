import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(public db: AngularFirestore) {  }

  findToken(tokenValueToFind: string): Observable<any> {
    return this.db.collection('tokens', ref => ref.where('value', '==', tokenValueToFind).limit(1)).valueChanges();
  }
}
