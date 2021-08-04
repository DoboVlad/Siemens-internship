import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'books',
    loadChildren: () =>
      import('./feature-modules/books/books.module').then((m) => m.BooksModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./feature-modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'shoppingcart',
    loadChildren: () =>
      import('./feature-modules/shopping-cart/shopping-cart.module').then((m) => m.ShoppingCartModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
