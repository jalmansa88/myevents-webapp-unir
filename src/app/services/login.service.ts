import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { Subject } from 'rxjs';

import { User } from '../interfaces/user.interface';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public user: User;

  public userObservable = new Subject<User>();
  token: any;

  constructor(
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private router: Router
  ) {
    this.userObservable.asObservable();
    this.authUserCheck();
  }

  private authUserCheck() {
    this.afAuth.authState.subscribe(authUser => {
      if (authUser && authUser.email) {
        this.userService
          .findUserByEmail(authUser.email)
          .then((result: User) => {
            this.user = result;
            this.userObservable.next(result);
          })
          .catch(err => {
            console.error(err);
          });
      } else {
        this.userObservable.next(null);
      }
    });
  }

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
    return new Promise((resolve, reject) => {
      this.afAuth.auth
        .signInWithEmailAndPassword(email, password)
        .then(authUser => {
          return this.userService.findUserByEmail(authUser.user.email);
        })
        .then(result => {
          this.user = result;
          resolve(this.user);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  logout() {
    this.user = null;
    this.afAuth.auth.signOut();
    this.router.navigate(['home']);
  }
}
