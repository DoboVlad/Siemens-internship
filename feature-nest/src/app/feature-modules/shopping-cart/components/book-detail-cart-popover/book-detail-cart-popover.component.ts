import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BookModel } from 'src/app/feature-modules/books/model/book.modes';

@Component({
  selector: 'app-book-detail-cart-popover',
  templateUrl: './book-detail-cart-popover.component.html',
  styleUrls: ['./book-detail-cart-popover.component.scss'],
})
export class BookDetailCartPopoverComponent implements OnInit {
  @Input() book!: BookModel;
  @Output() deleteBook = new EventEmitter<BookModel>();

  constructor() {}

  emitBook() {
    this.deleteBook.emit(this.book);
  }

  ngOnInit(): void {}
}
