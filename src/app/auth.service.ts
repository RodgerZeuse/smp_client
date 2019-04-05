import {Injectable} from '@angular/core';
import {
  NavigationEnd,
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  ActivatedRoute
} from '@angular/router';
import {UserProfile} from './store/user-profile';
@Injectable({providedIn: 'root'})
export class AuthService implements CanActivate {
  currentUrl : string;
  previousUrl : string;
  constructor(private userProfile : UserProfile, public router : Router) {
    this.currentUrl = this.router.url;

  }
  canActivate(route : ActivatedRouteSnapshot, state : RouterStateSnapshot) : boolean {
    if(!this.userProfile.isLogin && !route.children[0].params["id"]) {
      this
        .router
        .navigate(['membership']);
      return false;
    } else if (this.userProfile.isLogin) {
      this
        .router
        .events
        .subscribe(event => {
          if (event instanceof NavigationEnd) {
            this.previousUrl = this.currentUrl;
            this.currentUrl = event.url;
            if (this.previousUrl) {
              this
                .router
                .navigateByUrl(this.previousUrl);
              return false;
            } else {
              return true;
            }
          };
        });

    }

    return true;

  }
}
