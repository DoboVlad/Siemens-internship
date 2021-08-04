import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { MAIN_API_ENDPOINTS } from 'src/app/constants/endpoints';
import { ToastsServiceService } from 'src/app/shared/services/toasts.service';
import { environment } from 'src/environments/environment';
import { BookModel } from '../../books/model/book.modes';
import { cartModel } from '../model/cart-model';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private baseBooksUrl =
    environment.firebase.databaseURL + MAIN_API_ENDPOINTS.users;

  cartBooks: cartModel = {
    books: [],
    numberOfProducts: 0,
    subtotalPriceProducts: 0,
  };
  books: BookModel[] = [];
  bookId!: any;
  private userId!: string;

  private products = new BehaviorSubject<cartModel>(this.cartBooks);
  public products$ = this.products.asObservable();

  constructor(
    private http: HttpClient,
    private toastsService: ToastsServiceService
  ) {}

  setUserId(id: string) {
    this.userId = id;
  }

  getDataFromFirebaseDb(data: cartModel) {
    if (data.numberOfProducts === 0) {
      this.products.next(data);
    } else {
      this.cartBooks = { ...data };
      this.products.next(this.cartBooks);
      this.books = Object.values(this.cartBooks.books);
    }
  }

  sendCartBehaviorSubject(cartBook: cartModel) {
    this.products.next(this.cartBooks);
  }

  public addProduct(book: BookModel, id: string) {
    book = { ...book, quantity: 1, productId: id };

    if (this.objectExist(book)) {
      const key = this.getKeyByValue(this.books, book);
      this.books[key].quantity = this.books[key].quantity + 1;
      this.addBookToCart(book.price, 1).subscribe((res) => {
        this.toastsService.showSuccessToast('Book has been added!');
      });
    } else {
      this.books.push(book);
      this.addBookToCart(book.price, 1).subscribe((res) => {
        this.toastsService.showSuccessToast('Book has been added!');
      });
    }
    this.products.next(this.cartBooks);
  }

  resetBooksCart() {
    this.cartBooks = {
      books: [],
      numberOfProducts: 0,
      subtotalPriceProducts: 0,
    };
    this.products.next(this.cartBooks);
  }

  addBookToCart(price: number, product: number) {
    const addBookUrl = `${this.baseBooksUrl}/${this.userId}${MAIN_API_ENDPOINTS.cart}${MAIN_API_ENDPOINTS.json}`;

    this.cartBooks = {
      books: { ...this.books },
      numberOfProducts: this.cartBooks.numberOfProducts + +product,
      subtotalPriceProducts: this.cartBooks.subtotalPriceProducts + +price,
    };
    return this.http.put(addBookUrl, this.cartBooks);
  }

  updateCart(cartBook: cartModel) {
    const updateCartUrl = `${this.baseBooksUrl}/${this.userId}${MAIN_API_ENDPOINTS.cart}${MAIN_API_ENDPOINTS.json}`;
    return this.http.put(updateCartUrl, cartBook);
  }

  objectExist(newBook: BookModel): boolean {
    return Object.values(this.cartBooks?.books).some((book) =>
      book.title.includes(newBook.title)
    );
  }

  getCartFirebase(id: string) {
    const cartUrl = `${this.baseBooksUrl}/${id}${MAIN_API_ENDPOINTS.cart}${MAIN_API_ENDPOINTS.json}`;
    return this.http.get<cartModel>(cartUrl);
  }

  getKeyByValue(object: any, book: BookModel): any {
    return Object.keys(object).find((key) => object[key].title === book.title);
  }

  deleteProduct(product: BookModel) {
    this.books = this.books.filter((book) => book.title != product.title);
    this.cartBooks.books = { ...this.books };
    this.cartBooks.subtotalPriceProducts =
      this.cartBooks.subtotalPriceProducts - product.price * +product.quantity;
    this.cartBooks.numberOfProducts =
      this.cartBooks.numberOfProducts - +product.quantity;
    this.updateCart(this.cartBooks).subscribe((res) =>
      this.toastsService.showInfoToast('Book has been deleted!')
    );
    this.products.next(this.cartBooks);
  }

  deleteCart(id: string) {
    const cartUrl = `${this.baseBooksUrl}/${id}${MAIN_API_ENDPOINTS.cart}${MAIN_API_ENDPOINTS.json}`;

    this.books = [];
    this.cartBooks = {
      books: [],
      numberOfProducts: 0,
      subtotalPriceProducts: 0,
    };

    this.products.next(this.cartBooks);
    
    return this.http.put(cartUrl, {
      cart: [],
      numberOfProducts: 0,
      subtotalPriceProducts: 0,
    });
  }
}
