import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { TokenService } from './token.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { auth } from 'firebase';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  
  token: any;

  constructor(
          private afAuth: AngularFireAuth,
          private tokenService: TokenService,
          private db: AngularFirestore) { }


  withFacebook(): Promise<any> {
      this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider)
        .then((data: any) => {
            console.log(data);
            
              // this.db.collection('users').add({
            //   uid: data.user.uid,
            //   name: data.user.displayName,
            //   email: data.user.email,
            //   level: this.token.level
            // });
        });
  }

  withEmail(email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  checkToken(token: string) {
    this.tokenService.findToken(token)
      .subscribe((fbToken: any) => {
        this.token.value = fbToken[0].value;
        this.token.level = fbToken[0].level;
    });
  }

  isEmailAlreadyRegistered(email: string) {
    this.afAuth.auth.fetchSignInMethodsForEmail(email)
        .then(response => {
          if (response) {
            return true;
          } else {
            return false;
          }
        })
        .catch(err => console.error('an error occurred', err));
  }
}
