import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { noImage } from 'src/app/constants/images';
import { AuthService } from 'src/app/feature-modules/auth/services/auth.service';
import { WishListService } from 'src/app/feature-modules/shopping-cart/services/wish-list.service';
import { BookModel } from '../../model/book.modes';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.scss'],
})
export class BookComponent implements OnInit, OnDestroy {
  @Input() book!: BookModel;
  @Input() index!: number;
  noImage = noImage;
  isUserAuth: boolean = false;
  nrBooksFromWishList: number = 0;
  wishListSubscription!: Subscription;

  constructor(
    private wishListService: WishListService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.isUserAuthenticated().subscribe((data) => {
      this.isUserAuth = data;
    });
    this.wishListSubscription = this.wishListService.wishListProducts$
      .pipe(
        tap((books) => {
          this.nrBooksFromWishList = books.length;
        })
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.wishListSubscription.unsubscribe();
  }

  navigateToBookDetail(bookid: string): void {
    this.router.navigate([`${bookid}`]);
  }
}
