import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SaveuserService } from '../services/saveuser.service';
import { Location } from '@angular/common';

export const isAdminGuard: CanActivateFn = (route, state) => {

  const service = inject(SaveuserService)
  const user = service.getUser()
  const router = inject(Router)
  console.log(user.role)
  if (user) {
    if (user.role === 'ADMIN') {
      return true;
    } else {
      router.navigate(['/home'])
      return false
    }
  }else{
      router.navigate(['/login'])
      return false;
  }
};
