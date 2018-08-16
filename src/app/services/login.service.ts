import { Injectable, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import * as firebase from 'firebase';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';

import { User } from '../interfaces/user.interface';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService implements OnDestroy {
  public user: User;

  public userObservable = new Subject<User>();

  constructor(
    private afAuth: AngularFireAuth,
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private toastService: ToastrService
  ) {
    this.afAuth.auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
    this.userObservable.asObservable();
    this.authUserCheck();
  }

  private async authUserCheck() {
    this.afAuth.authState.subscribe(authUser => {
      if (authUser && authUser.isAnonymous) {
        this.userObservable.next(this.user);
      } else if (authUser && authUser.email) {
        this.userService
          .findUserByEmail(authUser.email)
          .then((result: User) => {
            this.user = result;
            this.userObservable.next(result);
          })
          .catch(err => {
            this.toastService.error(err);
            throw err;
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
          this.toastService.error(err);
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

  temporalLogin(token: string) {
    let resultToken: any;

    return new Promise((resolve, reject) => {
      this.tokenService
        .findToken(token)
        .then((tokenResponse: any) => {
          resultToken = tokenResponse;
          if (resultToken.role !== 0) {
            reject('Not a temporal token');
          } else {
            return this.afAuth.auth.signInAnonymously();
          }
        })
        .then(() => {
          this.user = this.user = {
            firstname: 'Anonymous',
            role: 0,
            events: resultToken.eventId
          };
          return this.authUserCheck();
        })
        .then(() => {
          resolve(this.user);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  async isAdmin() {
    return this.user && this.user.role === 3;
  }

  ngOnDestroy(): void {
    this.logout();
  }
}
