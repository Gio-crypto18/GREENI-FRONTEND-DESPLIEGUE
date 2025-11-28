import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from "@angular/router";
import { Loginservice } from "../app/services/loginservice";
import { inject } from "@angular/core";


/*
export const seguridadGuard: CanActivateFn = (route, state) => {
    const lService=inject(Loginservice)
    const router=inject(Router)
    const rpta=lService.verificar();
    if(!rpta){
      router.navigate(['/login']);
      return false;
    }
    return rpta;
};
*/
export const guardGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const lService = inject(Loginservice);
  const router = inject(Router);

  const autenticado = lService.verificar();
  const rolUser = lService.showRole();
  const rolesPermitidos: string[] = route.data['rol'] || [];

  if (!autenticado) {
    router.navigate(['/login']);
    return false;
  }

  if (rolesPermitidos.length > 0 && !rolesPermitidos.includes(rolUser)) {
    router.navigate(['/unauthorized']); // evita redirigir a inicio, para no renderizarlo a la fuerza
    return false;
  }

  return true;
};