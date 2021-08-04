import { EventEmitter } from '@angular/core';
import { Component, Input, OnInit, Output } from '@angular/core';
import { BookModel } from '../../books/model/book.modes';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {

  @Input() book!: any;
  @Output() deleteBook = new EventEmitter<BookModel>();
  
  showMore = false;
  
  constructor() { }
  
  ngOnInit(): void {
  }

  toggleShowMore(){
    this.showMore = !this.showMore;
  }

  emitBook(){
    this.deleteBook.emit(this.book);
  }

}
