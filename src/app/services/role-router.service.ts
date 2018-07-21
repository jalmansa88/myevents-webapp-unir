import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleRouterService {

  constructor(private router: Router) { }

  routeUser(user: User) {
    console.log('enrutando', user);
    
    if (user.role <= 2) {
      this.router.navigate(['events']);
      console.log('role <2');

    } else if (user.role === 3) {
      this.router.navigate(['eventadmin']);
      console.log('role 3');
  
    } else if (user.role === 4) {
      this.router.navigate(['serviceprovider']);
      console.log('role 3');

    } else {
      console.error('wtf?, que rol es este omg');
      
    }
  }
}
