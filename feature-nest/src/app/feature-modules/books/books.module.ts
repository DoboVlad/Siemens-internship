import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookComponent } from './components/book/book.component';
import { BooksListComponent } from './components/books-list/books-list.component';
import { BookDetailComponent } from './components/book-detail/book-detail.component';
import { BooksRoutingModule } from './books-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { BookEditComponent } from './components/book-edit/book-edit.component';
import { BookFormComponent } from './components/shared/book-form/book-form.component';
import { BookAddComponent } from './components/book-add/book-add.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { environment } from 'src/environments/environment';
import { SharedModule } from 'src/app/shared/shared.module';
import { FilterPipe } from '../pipes/filter.pipe';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { SiNewtonFormGroupModule } from '@simpl/newton-ng/form-group';
import { CoreModule } from 'src/app/core/core.module';
import { RatingDisplayComponent } from './components/shared/rating-display/rating-display.component';
import { SiNewtonToastService } from '@simpl/newton-ng/toast';
import { HeartFunctionalityComponent } from './components/shared/heart-functionality/heart-functionality.component';
import { BookDeleteComponent } from './components/book-delete/book-delete.component';
import { SearchPipe } from '../pipes/search.pipe';


@NgModule({
  declarations: [
    BookComponent,
    BooksListComponent,
    BookDetailComponent,
    BookFormComponent,
    BookAddComponent,
    BookEditComponent,
    FilterPipe,
    RatingDisplayComponent,
    HeartFunctionalityComponent,
    BookDeleteComponent,
    SearchPipe,
  ],

  imports: [
    CommonModule,
    BooksRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireStorageModule,
    AngularFireDatabaseModule,
    SharedModule,
    CoreModule,
    TypeaheadModule.forRoot(),
    SiNewtonFormGroupModule,
  ],

  providers: [SiNewtonToastService],
})
export class BooksModule {}
