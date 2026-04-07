import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SaveuserService } from '../services/saveuser.service';

export const userGuard: CanActivateFn = (route, state) => {

  const service = inject(SaveuserService)
  const user = service.getUser()
  const router = inject(Router)

  if (user) {
    return true;
  } else {
    router.navigate(['/login'])
    return false;
  }
};
