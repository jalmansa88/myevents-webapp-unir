import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';

import { User } from '../interfaces/user.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public user: User;
  token: any;

  constructor(
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private router: Router
  ) {}

  loginFacebook() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth
        .signInWithPopup(new auth.FacebookAuthProvider())
        .then(authUser => {
          return this.userService.findUserByEmail(authUser.user.email);
        })
        .then(user => {
          if (!user) {
            throw 'account not registered';
          }
          this.user = user;
        })
        .then(() => {
          resolve('loggedin');
        })
        .catch(err => {
          console.error(err);
          this.afAuth.auth.currentUser.delete();
          reject(err);
        });
    });
  }

  loginEmail(email: string, password: string) {
    return this.afAuth.auth
      .signInWithEmailAndPassword(email, password)
      .then(authUser => {
        return this.userService.findUserByEmail(authUser.user.email);
      })
      .then(result => {
        this.user = result;
        return this.user;
      })
      .catch(err => {
        console.error(err);
      });
  }

  logout() {
    this.user = null;
    this.afAuth.auth.signOut();
    this.router.navigate(['home']);
  }

  public isLoggedIn() {
    this.afAuth.authState.subscribe(user => user).unsubscribe();
  }
}
