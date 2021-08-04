import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MAIN_API_ENDPOINTS } from 'src/app/constants/endpoints';
import { environment } from 'src/environments/environment';
import { BookModel } from '../model/book.modes';
import { map } from 'rxjs/operators';

import { Observable, Subject } from 'rxjs';

import { BookService } from './book.service';

@Injectable({
  providedIn: 'root',
})
export class AddBookService {
  private baseBooksUrl =
    environment.firebase.databaseURL + MAIN_API_ENDPOINTS.books;
  private addedBookSubject = new Subject<BookModel>();
  addedBookAction$ = this.addedBookSubject.asObservable();

  constructor(private booksService: BookService, private http: HttpClient) {}

  updateBooksList(newBook: BookModel) {
    this.addedBookSubject.next(newBook);
  }

  public getBooks() {
    const getBooksUrl = `${this.baseBooksUrl}${MAIN_API_ENDPOINTS.json}`;

    return this.http.get<{ [key: string]: BookModel }>(getBooksUrl).pipe(
      map((books) => {
        const booksArray: BookModel[] = [];
        for (const key in books) {
          if (books.hasOwnProperty(key)) {
            booksArray.push({ ...books[key], id: key });
          }
        }
        for (let i = 0; i < booksArray.length; i++) {
          this.addedBookSubject.next(booksArray[i]);
        }
      })
    );
  }
  
  addBook(book:BookModel){
    this.addedBookSubject.next()
  }
}
