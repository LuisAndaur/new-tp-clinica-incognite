import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LocalstorageService } from '../shared/services/localstorage.service';

export const authGuard: CanActivateFn = (route, state) => {
  
  const local = inject(LocalstorageService);
  const router = inject(Router);

  const usuario = local.getItem('usuario');
  if(usuario.id){
    return true;
  }
  router.navigate(["/error"]);
  return false;
};
