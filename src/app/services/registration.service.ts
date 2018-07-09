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
          private db: AngularFirestore,
          private router: Router) { }


  withFacebook() {
  
    this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider)
      .then((data: any) => {
        console.log(data);
        this.router.navigate(['home']);
          // this.db.collection('users').add({
        //   uid: data.user.uid,
        //   name: data.user.displayName,
        //   email: data.user.email,
        //   level: this.token.level
        // });
      });
  }

  withEmail(email: string, password: string) {
    // this.afAuth.auth.createUserWithEmailAndPassword('jalmansa88@gmail.com', '123457')
    //   .catch(err => console.error('account in use', err.message));
    this.afAuth.auth.fetchSignInMethodsForEmail('jalmansa88@gmail.com')
        .then(response => console.log('cool', response))
        .catch(err => console.error('email already registered', err));
  }

  checkToken(token: string) {
    this.tokenService.findToken(token)
      .subscribe((fbToken: any) => {
        this.token.value = fbToken[0].value;
        this.token.level = fbToken[0].level;
    });
  }
}
