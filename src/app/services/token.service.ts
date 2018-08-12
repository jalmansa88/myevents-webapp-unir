import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  TOKEN_EXPIRATION_MINUTES = 60;

  constructor(private db: AngularFirestore, private http: HttpClient) {}

  findToken(tokenValueToFind: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.db
        .collection('tokens')
        .ref.where('value', '==', tokenValueToFind)
        .limit(1)
        .get()
        .then((response: any) => {
          if (response.docs.length) {
            const token = response.docs[0].data();

            const minutes = (Date.now() / 1000 - token.timestamp) / 60;

            if (minutes > 60) {
              reject('Expired Token');
            }

            resolve(token);
          } else {
            reject('invalid token');
          }
        })
        .catch(err => {
          console.log(err);
        });
    });
  }
  // findToken(tokenValueToFind: string): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     this.db
  //       .collection('tokens', ref =>
  //         ref.where('value', '==', tokenValueToFind).limit(1)
  //       )
  //       .valueChanges()
  //       .subscribe(
  //         response =>
  //           response.length !== 0
  //             ? resolve(response[0])
  //             : reject('invalid token')
  //       );
  //   });
  // }

  generate(eventId: string, role: number) {
    const baseUrl =
      'https://us-central1-myevents-unir.cloudfunctions.net/api/token';

    return new Promise((resolve, reject) => {
      if (role < 0 || role > 4) {
        return reject('not a valid role');
      }

      let params = new HttpParams();

      params = params.set('eventid', eventId);
      params = params.set('role', String(role));

      resolve(this.http.get(baseUrl, { params: params }).toPromise());
    });
  }

  generateForTemporalAccess(eventId: string, minutes: number) {}
}
