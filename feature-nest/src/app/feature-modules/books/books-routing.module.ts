import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BookComponent } from './components/book/book.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { BooksListComponent } from './components/books-list/books-list.component';
import { BooksGuard } from './services/guards/books-guard.guard';
import { AuthGuard } from '../auth/services/guards/auth.guard/auth.guard';
const routes: Routes = [
  {
    path: '',
    component: BooksListComponent,
  },
  {
    path: 'books',
    component: BooksListComponent,
  },

  {
    path: 'book-component',
    component: BookComponent,
  },
  {
    path: ':id',
    component: BookDetailComponent,
    canActivate: [BooksGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BooksRoutingModule {}
