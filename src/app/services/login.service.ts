import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { User } from '../interfaces/user.interface';
import { Router } from '@angular/router';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public user: User;
  token: any;

  constructor(private afAuth: AngularFireAuth,
              private userService: UserService,
              private router: Router) { }
  
  loginFacebook() {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider)
      .then((authUser) => {
        return this.userService.findUserByEmail(authUser.user.email);
      })
      .then((user) => {
        if (!user) {
          throw 'account not registered';
        }
        this.user = user;
      })
      .then(() => {
        resolve('loggedin');
      })
      .catch((err) => {
        console.error(err);
        this.afAuth.auth.currentUser.delete();
        reject(err);
      });
    });
  }

  loginEmail(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logout() {
    this.user = null;
    this.afAuth.auth.signOut();
    this.router.navigate(['home']);
  }

  public isLoggedIn() {
    this.afAuth.authState.subscribe((user) => user).unsubscribe();
  }
}
