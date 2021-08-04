import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SiNewtonToastService, SiToastLocation, SiToastTypes } from '@simpl/newton-ng/toast';
import { AuthService } from 'src/app/feature-modules/auth/services/auth.service';
import { WishListService } from 'src/app/feature-modules/shopping-cart/services/wish-list.service';
import { BookModel } from '../../../model/book.modes';

@Component({
  selector: 'app-heart-functionality',
  templateUrl: './heart-functionality.component.html',
  styleUrls: ['./heart-functionality.component.scss']
})

export class HeartFunctionalityComponent implements OnInit, OnChanges {
  @Input() book!: BookModel;
  @Input() nrBooksFromWishList!: number;
  isUserAuth: boolean = false;

  constructor(
    private wishListService: WishListService, 
    private router: Router,
    private authService: AuthService,
    private toastService: SiNewtonToastService,
    ){}

  ngOnInit(): void {
    this.authService.isUserAuthenticated().subscribe(data => {this.isUserAuth = data});
  }

  ngOnChanges(): void {
    this.book.isInWishList = this.wishListService.isBookInWishList(this.book.id);
  }
  
  showInfoToast(message: string): void {
    this.toastService.showToast({
      content: message,
      type: SiToastTypes.INFO,
      timeout: 1000,
      location: SiToastLocation.BOTTOM,
    });
  }

  addBookToWishList(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if(this.isUserAuth) {
        if(!this.wishListService.isBookInWishList(this.book.id))
        { 
        
          this.wishListService.addBookToWishList(this.book, this.book.id).subscribe(
            () => {this.book.isInWishList = true; 
                   this.showInfoToast("Book has been added in Wishlist!");});
        }
    } else 
        this.router.navigate(['/auth/login']);
  }
  
  deleteBookToWishList(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    
    this.wishListService.deleteBookFromWishList(this.book.id).subscribe(
      () =>  {this.book.isInWishList = false;
              this.showInfoToast("Book has been removed!");}
    );
  }

}
