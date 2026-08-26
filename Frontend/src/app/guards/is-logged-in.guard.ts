import { CanActivateFn, Router } from '@angular/router';
import { SaveuserService } from '../services/saveuser.service';
import { inject } from '@angular/core';

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const service = inject(SaveuserService)
  const user = service.getUser()
  const router = inject(Router)

  if (user) {
    if (user.role === 'ADMIN') {
      router.navigate(['/dashboard'])
    } else {
      router.navigate(['/home'])
    }
    return false
  } else {
    return true
  }
};
