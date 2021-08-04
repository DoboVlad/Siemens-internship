import { Component, Input, OnChanges, OnInit } from '@angular/core';
import {
  SiNewtonToastService,
  SiToastLocation,
  SiToastTypes,
} from '@simpl/newton-ng/toast';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BookLoadingService } from 'src/app/core/services/utility/loading-spinner/book-loading.service';
import { AuthService } from '../../auth/services/auth.service';
import { BookModel } from '../../books/model/book.modes';
import { cartModel } from '../model/cart-model';
import { ShoppingCartService } from '../services/shopping-cart.service';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  cartBooks: cartModel = {
    books: [],
    numberOfProducts: 0,
    subtotalPriceProducts: 0,
  };

  books: BookModel[] = [];
  isLoadingData$!: Observable<boolean>;

  private products = new BehaviorSubject<cartModel>(this.cartBooks);
  public products$ = this.products.asObservable();

  constructor(
    private shoppingcartService: ShoppingCartService,
    private toastService: SiNewtonToastService,
    private loadingService: BookLoadingService,
    private authService: AuthService
  ) {}

  public userId = '';

  ngOnInit(): void {
    this.loadingService.show();
    this.isLoadingData$ = this.loadingService.loading$;

    this.authService.user$
      .pipe(
        switchMap((data) => {
          return this.shoppingcartService.getCartFirebase(data.id);
        })
      )
      .subscribe((data) => {
        console.log(data);
        this.cartBooks = data;
        this.books = Object.values(this.cartBooks.books);
        this.loadingService.hide();
      });
  }

  transformFromObjectToArray(val: any) {
    return Object.values(val);
  }

  deleteBook(product: BookModel) {
    this.shoppingcartService.deleteProduct(product);
    this.books = this.books.filter((book) => book.title !== product.title);
    this.cartBooks.books = this.books;
    this.cartBooks.subtotalPriceProducts =
      this.cartBooks.subtotalPriceProducts - product.price * +product.quantity;
    this.cartBooks.numberOfProducts =
      this.cartBooks.numberOfProducts - +product.quantity;
    this.products.next(this.cartBooks);
  }

  showInfoToast() {
    this.toastService.showToast({
      content: 'Book has been deleted!',
      type: SiToastTypes.INFO,
      timeout: 1000,
      location: SiToastLocation.BOTTOM,
    });
  }
}
