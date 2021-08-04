import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from './feature-modules/auth/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'feature-nest';
  autoLoginSub!: Subscription;

  constructor(private authService: AuthService){}

  ngOnInit() {
    this.autoLoginSub = this.authService.autoLogin().subscribe(user => {
      if(!!Object.keys(user).length) {
        this.authService.saveUserData(user.users[0].email, user.users[0].localId, this.authService.getToken(), 3600);
      }
    });
  }

  ngOnDestroy() {
    this.autoLoginSub.unsubscribe();
  }
}
