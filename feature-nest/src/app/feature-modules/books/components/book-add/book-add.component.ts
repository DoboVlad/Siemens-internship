import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastsServiceService } from 'src/app/shared/services/toasts.service';
import { BookModel } from '../../model/book.modes';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-book-add',
  templateUrl: './book-add.component.html',
  styleUrls: ['./book-add.component.scss'],
})
export class BookAddComponent implements OnInit {
  @Input() modalRef!: BsModalRef;
  @Output() bookFormValues = new EventEmitter<any>();
  formModalRef: any;
  
  constructor(private bookService: BookService, private toastService: ToastsServiceService) {}

  ngOnInit(): void {}
  
  addBook(book: BookModel) {
    this.bookService.addBook(book).subscribe((bookId) => {
      this.bookFormValues.emit(bookId);
      this.toastService.showSuccessToast('Book has been added!');
    });
  }
}
