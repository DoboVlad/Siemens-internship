import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { MAIN_API_ENDPOINTS } from 'src/app/constants/endpoints';
import { AuthResponseData } from '../model/auth-response-model';
import { AngularFireAuth } from '@angular/fire/auth';
import { defer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { RegisterDataModel } from '../model/register-model';
import 'firebase/database';
import { User } from '../model/user.model';
import { Router } from '@angular/router';
import { roles } from 'src/app/constants/role';
import { ToastsServiceService } from 'src/app/shared/services/toasts.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUsersUrl =
    environment.firebase.databaseURL + MAIN_API_ENDPOINTS.users;

  private userSource = new BehaviorSubject<User>(<User>{});
  public user$ = this.userSource.asObservable();

  tokenExpirationTimer!: any;

  constructor(
    private httpClient: HttpClient,
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastrService: ToastsServiceService
  ) {}

  login(email: string, password: string) {
    return this.httpClient
      .post<AuthResponseData>(MAIN_API_ENDPOINTS.login, {
        email: email,
        password: password,
        returnSecureToken: true,
      })
      .pipe(
        catchError((errorResponse) => {
          let errorMessage = 'An unknown error occured!';

          if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(errorMessage);
          } else {
            errorMessage = 'Email or password is incorrect';
          }

          return throwError(errorMessage);
        }),
        tap((resData) => {
          this.saveUserData(
            email,
            resData.localId,
            resData.idToken,
            +resData.expiresIn
          );
        })
      );
  }

  saveUserData(
    email: string,
    localId: string,
    idToken: string,
    expiresIn: number
  ) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const currentUser: User = {
      email,
      id: localId,
      token: idToken,
      tokenExpirationDate: expirationDate,
    };
    this.checkUserRole(currentUser).subscribe((admin) => {
      if (admin) {
        currentUser.role = roles.ADMIN;
      } else {
        currentUser.role = roles.USER;
      }
    this.userSource.next(currentUser);
  });
    if(document.cookie.length == 0) {
      this.autoLogout(expiresIn * 1000);
      document.cookie = 'token' + '=' + idToken + ';';
    }
  }

  autoLogin() {
    const cookieSotrage = document.cookie.split(';');
    let idToken;
    if (cookieSotrage.length == 2) {
      idToken = cookieSotrage[1].split('=')[1];
    } else idToken = cookieSotrage[0].split('=')[1];
    if (!idToken) {
      return of(<User>{});
    }
    return this.getUserData(idToken);
  }

  getToken() {
    const cookieSotrage = document.cookie.split(';');
    return cookieSotrage[0].split('=')[1];
  }

  getUserData(idToken: string) {
    return this.httpClient.post<any>(MAIN_API_ENDPOINTS.userData, {
      idToken: idToken,
    });
  }

  isUserAuthenticated() {
    return this.user$.pipe(
      map((user) => {
        const isAuthenticated = !!Object.keys(user).length;
        if (isAuthenticated) return true;
        else return false;
      })
    );
  }

  isCurrentUserAdmin() {
    return this.user$.pipe(
      map((user) => {
        const isAdmin = user.role == 'ADMIN' ? true : false;
        if (isAdmin) return true;
        else return false;
      })
    );
  }

  checkUserRole(user: User) {
    return this.httpClient
      .get<any>(
        environment.firebase.databaseURL +
          MAIN_API_ENDPOINTS.role +
          MAIN_API_ENDPOINTS.json
      )
      .pipe(
        map((admin) => {
          const isAdmin = user.email == admin.email ? true : false;
          if (isAdmin) return true;
          else return false;
        })
      );
  }

  getUserById(userId: string) {
    const getUserByIdUrl = `${this.baseUsersUrl}/${userId}${MAIN_API_ENDPOINTS.json}`;
    return this.httpClient.get<RegisterDataModel>(getUserByIdUrl);
  }

  createUser(emai: string, password: string, userData: RegisterDataModel) {
    return defer(async () => {
      const cred = await this.afAuth.createUserWithEmailAndPassword(
        emai,
        password
      );
      return cred.user;
    }).pipe(
      switchMap((user) => {
        return this.addUserDb(
          {
            ...userData,
            userId: user?.uid,
            cart: {
              numberOfProducts: 0,
              subtotalPriceProducts: 0,
            },
          },
          user?.uid
        );
      })
    );
  }

  private addUserDb(user: RegisterDataModel, id: string | undefined) {
    const url = `${this.baseUsersUrl}/${id}${MAIN_API_ENDPOINTS.json}`;
    return this.httpClient.put(url, user);
  }

  logout() {
    this.userSource.next(<User>{});
    this.deleteAllCookies();

    // if we logout manually, we have to clear the timer to not logout twice
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(['/auth/login']);
    this.toastrService.showSuccessToast('Logged out succesfully!');
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
      this.toastrService.showInfoToast('Token expired');

    }, expirationDuration);
  }

  deleteAllCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
  }
}
