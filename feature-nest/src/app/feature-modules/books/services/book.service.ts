import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MAIN_API_ENDPOINTS } from 'src/app/constants/endpoints';
import { environment } from 'src/environments/environment';
import { BookModel } from '../model/book.modes';
import { map, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private baseBooksUrl =
    environment.firebase.databaseURL + MAIN_API_ENDPOINTS.books;

  private bookAuthors = new Set<String>();
  constructor(private http: HttpClient) {}

  public getBooks() {
    const getBooksUrl = `${this.baseBooksUrl}${MAIN_API_ENDPOINTS.json}`;

    return this.http.get<{ [key: string]: BookModel }>(getBooksUrl).pipe(
      map((books) => {
        const booksArray: BookModel[] = [];
        for (const key in books) {
          if (books.hasOwnProperty(key)) {
            booksArray.push({ ...books[key], id: key });
            this.bookAuthors.add(books[key].author);
          }
        }
        return booksArray;
      })
    );
  }

  public getBooksAuthors(): Set<String> {
    const getBooksUrl = `${this.baseBooksUrl}${MAIN_API_ENDPOINTS.json}`;
    this.http
      .get<BookModel>(getBooksUrl)
      .pipe(tap((books) => this.bookAuthors.add(books.author)));

    return this.bookAuthors;
  }

  public getBookById(bookId: string) {
    const url = `${this.baseBooksUrl}/${bookId}${MAIN_API_ENDPOINTS.json}`;

    return this.http.get<BookModel>(url);
  }

  public deleteBookById(bookId: string): Observable<BookModel> {
    const url = `${this.baseBooksUrl}/${bookId}${MAIN_API_ENDPOINTS.json}`;

    return this.http.delete<BookModel>(url)
  }

  public addBook(book: BookModel) {
    const url = `${this.baseBooksUrl}${MAIN_API_ENDPOINTS.json}`;

    return this.http.post<any>(url, book);
  }

  public editBook(bookId: string, book: BookModel) {
    const updateBookUrl = `${this.baseBooksUrl}/${bookId}${MAIN_API_ENDPOINTS.json}`;
    return this.http.put(updateBookUrl, book);
  }

  
}
