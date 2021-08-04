import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable} from 'rxjs';
import { map} from 'rxjs/operators';
import { MAIN_API_ENDPOINTS } from 'src/app/constants/endpoints';
import { environment } from 'src/environments/environment';
import { BookModel } from '../../books/model/book.modes';

@Injectable({
  providedIn: 'root'
})
export class WishListService {

  public wishListBooks: BookModel[] = [];
  private baseBooksUrl = environment.firebase.databaseURL + MAIN_API_ENDPOINTS.users;
  private  userId!: string;
  private wishListProductsSubject = new BehaviorSubject<BookModel[]>(this.wishListBooks);
  public wishListProducts$ = this.wishListProductsSubject.asObservable();
  
  constructor(private http: HttpClient) { }
  
  public addBookToWishList(book: BookModel, bookId: string) {
    const addBookToWishListUrl = `${this.baseBooksUrl}/${this.userId}/wishlist${MAIN_API_ENDPOINTS.json}`;
    book.productId =  bookId;
    this.wishListBooks = [...this.wishListBooks, book];
    this.wishListProductsSubject.next(this.wishListBooks);
    return this.http.post(addBookToWishListUrl, book);
  }

  public getBooksFromWishList(): Observable<BookModel[]> {
    const getBooksUrl = `${this.baseBooksUrl}/${this.userId}/wishlist${MAIN_API_ENDPOINTS.json}`;
    return this.http.get<{ [key: string]: BookModel }>(getBooksUrl).pipe(
      map((data) => {
        let booksArray: BookModel[] = [];
        for(const key in data){
          if(data.hasOwnProperty(key)){        
            booksArray = [...this.wishListBooks, { ...data[key], id: key }];     
          }
        }
        return booksArray;
      }
    ));
  }

  public getBooksFromWishListArray(books:BookModel[]): Observable<BookModel[]> {
      for(const key in books){
        if(books.hasOwnProperty(key)){        
          this.wishListBooks = [...this.wishListBooks, { ...books[key], id: key }];
          this.wishListProductsSubject.next(this.wishListBooks);
        }
      }
      return this.wishListProducts$;
  }

  public getBooksFromDB(userId: string): Observable<BookModel[]> {
    const getBooksUrl = `${this.baseBooksUrl}/${userId}/wishlist${MAIN_API_ENDPOINTS.json}`;
    return this.http.get<BookModel[]>(getBooksUrl);
  }

  public deleteBookFromWishList( bookId: string) {
    const deleteBooksUrl = `${this.baseBooksUrl}/${this.userId}/wishlist/${MAIN_API_ENDPOINTS.json}`;
    this.wishListBooks = [...this.wishListBooks.filter(book => book.productId != bookId)];
    this.wishListProductsSubject.next(this.wishListBooks);
    return this.http.put(deleteBooksUrl,this.wishListBooks);
  }

  public clear(): void {
    this.wishListProductsSubject.next([]);
    this.wishListBooks = [];
  }

  public isBookInWishList(bookAddeId: string): boolean {
    if(this.wishListBooks.length === 0) return false;
    return this.wishListBooks.some((book) =>
      book.productId === bookAddeId
    );
  }
  
  public setUserId(id:string): void {
    this.userId = id;
  }

}
