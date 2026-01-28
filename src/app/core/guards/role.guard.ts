import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class RoleGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const expectedRoles = route.data['roles'] as Array<string>;

        return this.authService.currentUser$.pipe(
            take(1),
            map(user => {
                if (!user) {
                    this.router.navigate(['/login']);
                    return false;
                }

                if (expectedRoles && !expectedRoles.includes(user.role)) {
                    this.router.navigate(['/home']);
                    return false;
                }

                return true;
            })
        );
    }
}
