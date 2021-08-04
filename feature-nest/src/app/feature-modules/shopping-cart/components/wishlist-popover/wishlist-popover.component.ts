import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BookModel } from 'src/app/feature-modules/books/model/book.modes';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-wishlist-popover',
  templateUrl: './wishlist-popover.component.html',
  styleUrls: ['./wishlist-popover.component.scss']
})
export class WishlistPopoverComponent implements OnInit {
  @Input() book!: BookModel;
  @Output() emitBook = new EventEmitter<BookModel>();
 
  constructor(private addToCartService: ShoppingCartService, private route: Router) { }

  ngOnInit(): void {
  }

  addBookToCart(event: any){
    event.stopPropagation();
    this.addToCartService.addProduct(this.book, this.book.productId);
  }

  emitBookToDelete() {
    this.emitBook.emit(this.book);
  }

  changeBookRoute(bookId: string){
    this.route.navigateByUrl(`/books/${bookId}`);
  }
 
}
