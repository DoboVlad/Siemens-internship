import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoggedInGuard } from './services/guards/logged-in.guard/logged-in.guard';

const routes: Routes = [
  {
    path: 'registration',
    component: RegistrationComponent,
    // canActivate: [LoggedInGuard]
  },
  {
    path: 'login',
    component: LoginComponent,
    // canActivate: [LoggedInGuard]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
