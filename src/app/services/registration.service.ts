import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { TokenService } from './token.service';
import { AngularFirestore } from 'angularfire2/firestore';
import { auth } from 'firebase';
import { User } from '../interfaces/user.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class RegistrationService {
  
  token: any = {};
  authData: any = {};

  constructor(
          private afAuth: AngularFireAuth,
          private tokenService: TokenService,
          private db: AngularFirestore,
          private userService: UserService) { }

  withFacebook(formToken: string, user: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {

      this.tokenService.findToken(formToken)
        .then(result => {
          this.token.role = result.role;
          this.token.value = result.value;
          this.token.eventId = result.eventId;
          this.token.timestamp = result.timestamp;
        })
        .then(() => {
          return this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider);
        })
        .then(authData => {
          this.authData = authData;
          return this.userService.findUserByEmail(authData.user.email);
        })
        .then((userInDb) => {
            return this.saveAccountInDBIfNotExist(userInDb);
        })
        .then(() => {
          resolve('Registro satisfactorio');
        })
        .catch(err => {
            if (this.afAuth.auth.currentUser) {
              console.log(this.afAuth.auth.currentUser);
              this.afAuth.auth.currentUser.delete();
            }
            reject(err);
          });
      });
  }

  saveAccountInDBIfNotExist(userInDb: any): Promise<any> {
      return new Promise<any>((accept, reject) => {
        if (!userInDb) {
          return this.db.collection('users').add({
              // uid: this.authData.user.uid,
              name: this.authData.user.displayName,
              email: this.authData.user.email,
              role: this.token.role,
              events: this.token.eventId
            });
        } else {
          reject('email was already registered');
        }
      });
  }

  withEmail(formToken: string, user: User): Promise<any> {
    return this.tokenService.findToken(formToken)
        .then((tokenResult) => {
          this.token.value = tokenResult.value;
          this.token.role = tokenResult.rolel;
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
              role: this.token.role
              // TODO: link con el evento
            });
        })
        .then(() => {
            this.afAuth.auth.signOut();
        })
        .catch(err => {
          return Promise.reject(err);
        });
  }
}
