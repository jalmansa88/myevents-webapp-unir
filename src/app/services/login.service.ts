import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { auth } from 'firebase';
import { AngularFirestore } from 'angularfire2/firestore';
import { User } from '../interfaces/user.interface';
import { TokenService } from './token.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  public user: User = {};
  token: any = {};

  constructor(private afAuth: AngularFireAuth,
              private tokenService: TokenService,
              private db: AngularFirestore,
              private router: Router) {

    this.afAuth.authState.subscribe(fbUser => {
      if (fbUser) {
        this.user = {
          uid: fbUser.uid,
          firstname: fbUser.displayName,
          email: fbUser.email,
          photoUrl: fbUser.photoURL,
        };
      }
    });
   }
  
  loginFacebook() {

    this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider)
      .then((data: any) => {
        console.log(data);
        this.router.navigate(['events']);
        this.db.collection('users').add({
          uid: data.user.uid,
          name: data.user.displayName,
          email: data.user.email,
          level: this.token.level
        });
      });
  }

  loginEmail(email: string, password: string) {
    // this.afAuth.auth.createUserWithEmailAndPassword('jalmansa88@gmail.com', '123457')
    //   .catch(err => console.error('account in use', err.message));
    this.afAuth.auth.fetchSignInMethodsForEmail('jalmansa88@gmail.com')
        .then(response => console.log('cool', response))
        .catch(err => console.error('email already registered', err));
  }

  logout() {
    this.user = {};
    this.afAuth.auth.signOut();
    this.router.navigate(['home']);
  }

  isLoggedIn() {
    return this.afAuth.auth.currentUser ? true : false;
  }
}
