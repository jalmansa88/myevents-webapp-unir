import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor(private db: AngularFirestore, private http: HttpClient) {  }
  
  findToken(tokenValueToFind: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db.collection('tokens', ref => ref.where('value', '==', tokenValueToFind).limit(1)).valueChanges()
        .subscribe(response => response.length !== 0 ? resolve(response[0]) : reject('invalid token') );
    });
  }

  generate(eventId: string, role: number) {

    const baseUrl = 'https://us-central1-myevents-unir.cloudfunctions.net/api/token';

    return new Promise((resolve, reject) => {
      if (role < 1 || role > 4) {
        reject('not a valid role');
      }

      let params = new HttpParams();

      params = params.set('eventid', eventId);
      params = params.set('role', String(role));
      console.log('calling to token api');
      
      resolve(this.http.get(baseUrl, { params: params }).toPromise());
    });


  }

  generateForTemporalAccess(eventId: string, minutes: number) {

  }
}
