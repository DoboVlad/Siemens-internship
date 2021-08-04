import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from 'src/app/feature-modules/auth/services/auth.service';
import { ShoppingCartService } from 'src/app/feature-modules/shopping-cart/services/shopping-cart.service';
import { BookModel } from 'src/app/feature-modules/books/model/book.modes';
import { WishListService } from 'src/app/feature-modules/shopping-cart/services/wish-list.service';
import { switchMap } from 'rxjs/operators';
import { User } from 'src/app/feature-modules/auth/model/user.model';
import {
  SiNewtonToastService,
  SiToastLocation,
  SiToastTypes,
} from '@simpl/newton-ng/toast';
import { cartModel } from 'src/app/feature-modules/shopping-cart/model/cart-model';
import { SearchBookService } from 'src/app/feature-modules/books/services/search-book.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, OnDestroy {
  isActivatedAccountMenu = false;
  isActivatedCart = false;
  isActivatedSearchBar = false;
  isMobileVersion = false;
  isAuthenticated = false;
  isActivatedWishList = false;
  isAuthenticatedSubscription!: Subscription;
  productsNumber!: number;
  searchText!: string;
  cartBook$ = this.addToCartService.products$;
  currentUser$: Observable<User> = this.authService.user$;
  wishListBooks!: Observable<BookModel[]>;
  subtotalPrice = '0';
  user!: User;

  cartBooks: cartModel = {
    books: [],
    numberOfProducts: 0,
    subtotalPriceProducts: 0,
  };

  private userId!: string;

  @HostListener('window:resize', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.isActivatedAccountMenu = false;
    this.isActivatedSearchBar = false;
    this.isMobileVersion = false;
    this.isActivatedCart = false;
  }

  constructor(
    private addToCartService: ShoppingCartService,
    private toastService: SiNewtonToastService,
    private authService: AuthService,
    private wishListService: WishListService,
    private searchBookService: SearchBookService
  ) {}

  ngOnInit(): void {
    this.isAuthenticatedSubscription = this.authService
      .isUserAuthenticated()
      .subscribe((authStatus) => {
        this.isAuthenticated = authStatus;
      });

    this.authService.user$
      .pipe(
        switchMap((isAuthenticated) => {
          this.userId = isAuthenticated.id;
          this.wishListService.setUserId(isAuthenticated.id);
          return this.wishListService.getBooksFromDB(isAuthenticated.id);
        })
      )
      .subscribe((data) => {
        if (!!this.userId) {
          this.wishListBooks =
            this.wishListService.getBooksFromWishListArray(data);
        }
      });

    this.authService.user$
      .pipe(
        switchMap((isAuthenticated) => {
          this.addToCartService.setUserId(isAuthenticated.id);
          return this.addToCartService.getCartFirebase(isAuthenticated.id);
        })
      )
      .subscribe((data) => this.addToCartService.getDataFromFirebaseDb(data));
  }

  transformFromObjectToArray(val: BookModel[]) {
    return Object.values(val);
  }

  subtotalPriceWithFormatCurrency(total: number) {
    return total.toLocaleString('ro-RO', {
      style: 'currency',
      currency: 'RON',
    });
  }

  setSearchedBookName() {
    this.searchBookService.setSearchedText(this.searchText);
  }

  showInfoToast() {
    this.toastService.showToast({
      content: 'Book has been deleted!',
      type: SiToastTypes.INFO,
      timeout: 1000,
      location: SiToastLocation.BOTTOM,
    });
  }

  toggleAccountMenu() {
    this.isActivatedAccountMenu = !this.isActivatedAccountMenu;
  }

  toggleSearchBar() {
    this.isActivatedSearchBar = !this.isActivatedSearchBar;
  }

  toggleMenuHamburger() {
    this.isMobileVersion = !this.isMobileVersion;
  }

  closeAccountMenu() {
    this.isActivatedAccountMenu = false;
  }

  ngOnDestroy() {
    this.isAuthenticatedSubscription.unsubscribe();
  }

  onLogOut() {
    this.wishListService.clear();
    this.authService.logout();
  }

  toggleCart() {
    this.isActivatedCart = !this.isActivatedCart;
  }

  onToggleWishList() {
    this.isActivatedWishList = !this.isActivatedWishList;
  }

  deleteProduct(product: BookModel) {
    this.addToCartService.deleteProduct(product);
  }

  deleteProductFromWishList(bookToDelete: BookModel): void {
    this.wishListService
      .deleteBookFromWishList(bookToDelete.productId)
      .subscribe();
    this.showInfoToast();
  }
}
