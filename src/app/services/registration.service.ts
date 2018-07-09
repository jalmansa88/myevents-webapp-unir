import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { TokenService } from './token.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { auth } from 'firebase';
import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  
  token: any = {};

  constructor(
          private afAuth: AngularFireAuth,
          private tokenService: TokenService,
          private db: AngularFirestore,
          private userService: UserService) { }


  withFacebook(formToken: string, user: any): Promise<any> {
      return this.tokenService.findToken(formToken)
          .then(result => {
            this.token.value = result.value;
            this.token.level = result.level;
          })
          .then(() => {
            return this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider);
          })
          .then(authData => {
            console.log(authData);
            this.userService.findUserByEmail(authData.user.email)
            .then((accounts) => {
              if (accounts.length === 0) {
                console.log('fb: saving user in DB ', user);
                this.db.collection('users').add({
                    uid: authData.user.uid,
                    name: authData.user.displayName,
                    email: authData.user.email,
                    level: this.token.level
                  });
              } else {
                console.log('email was already registered');
              }
            });
          });
  }

  withEmail(formToken: string, user: User): Promise<any> {
    return this.tokenService.findToken(formToken)
        .then((tokenResult) => {
          this.token.value = tokenResult.value;
          this.token.level = tokenResult.level;
        })
        .then(() => {
          return this.afAuth.auth.createUserWithEmailAndPassword(user.email, user.password);
        })
        .then((authResult) => {
            this.db.collection('users').add({
              uid: authResult.user.uid,
              firstname: user.firstname,
              lastname: user.lastname,
              email: user.email,
              phone: user.phone,
              level: this.token.level
              // TODO: link con el evento
            });
        })
        .then(() => {
            this.afAuth.auth.signOut();
        });
  }

  
}
