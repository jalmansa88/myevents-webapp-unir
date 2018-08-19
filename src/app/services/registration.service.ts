import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';
import { auth } from 'firebase';

import { User } from '../interfaces/user.interface';
import { EventsService } from './events.service';
import { TokenService } from './token.service';
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
    private userService: UserService,
    private eventsService: EventsService
  ) { }

  withFacebook(formToken: string, user: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.tokenService
        .findToken(formToken)
        .then(result => {
          console.log('token result', result);

          this.token.role = result.role;
          this.token.value = result.value;
          this.token.eventId = result.eventId;
        })
        .then(() => {
          return this.afAuth.auth.signInWithPopup(
            new auth.FacebookAuthProvider()
          );
        })
        .then(authData => {
          this.authData = authData;
          return this.userService.findUserByEmail(authData.user.email);
        })
        .then(userInDb => {
          return this.saveAccountInDBIfNotExist(userInDb);
        })
        .then(saveResponse => {
          console.log('saveresponse facebook', saveResponse);
          this.eventsService.addAttendeeToEvent(
            saveResponse.id,
            this.token.eventId,
            this.token.role
          );
        })
        .then(() => {
          resolve('Registro satisfactorio');
        })
        .catch(err => {
          if (this.afAuth.auth.currentUser) {
            this.afAuth.auth.currentUser.delete();
          }
          reject(err);
        });
    });
  }

  saveAccountInDBIfNotExist(userInDb: any): Promise<any> {
    return new Promise<any>((accept, reject) => {
      if (!userInDb) {

        const newUser: User = {
          firstname: this.authData.additionalUserInfo.profile.first_name,
          lastname: this.authData.additionalUserInfo.profile.last_name,
          email: this.authData.additionalUserInfo.profile.email,
          phone: this.authData.user.phonNumber
            ? this.authData.user.phonNumber
            : '',
        };

        return this.userService.add(newUser);
      } else {
        reject('Email was already registered.');
      }
    });
  }

  withEmail(formToken: string, user: User): Promise<any> {
    return this.tokenService
      .findToken(formToken)
      .then(tokenResult => {
        if (tokenResult.role === 0) {
          throw new Error('Un Token temporal no es válido para el registro.');
        }
        this.token = {
          value: tokenResult.value,
          role: tokenResult.role,
          eventId: tokenResult.eventId
        };
      })
      .then(() => {
        return this.afAuth.auth.createUserWithEmailAndPassword(
          user.email,
          user.password
        );
      })
      .then(() => {

        const newUser = {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
        };

        return this.userService.add(newUser)
      })
      .then(saveResponse => {
        this.eventsService.addAttendeeToEvent(
          saveResponse.id,
          this.token.eventId,
          this.token.role
        );
      })
      .then(() => {
        return this.afAuth.auth.signOut();
      })
      .then(() => Promise.resolve('success'))
      .catch(err => {
        return Promise.reject(err);
      });
  }
}
