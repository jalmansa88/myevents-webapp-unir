import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'role'
})
export class RolePipe implements PipeTransform {
  role: string[] = ['anonymous', 'user', 'vip', 'admin', 'provider'];

  transform(role: number): any {
    return this.role[role];
  }
}
