import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleRouterService {
  constructor(private router: Router) {}

  routeUser(user: User) {
    if (user.isSP) {
      this.router.navigate(['serviceprovider']);
    } else {
      this.router.navigate(['events']);
    }
  }
}
