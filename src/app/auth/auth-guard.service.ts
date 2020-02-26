import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) =>
      this.authService.user.subscribe(user => {
          if (user) {
            resolve(true);
          } else {
            resolve(false);
          }
        }
      )
    );
  }

// async IsLoggedIn(): Promise<boolean> {
//   try {
//     await new Promise((resolve, reject) =>
//       firebase.auth().onAuthStateChanged(
//         user => {
//           if (user) {
//             resolve(user);
//           } else {
//             reject('no user logged in');
//           }
//         },
//         error => reject(error)
//       )
//     );
//     return true;
//   } catch (error) {
//     return false;
//   }
// }
}
