import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root'
})
export class RoleRouterService {
  constructor(private router: Router) {}

  routeUser(user: User) {
    if (user.role <= 3) {
      this.router.navigate(['events']);
    } else if (user.role === 4) {
      this.router.navigate(['serviceprovider']);
    } else {
      console.error('Rol no válido');
    }
  }
}
