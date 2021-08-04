import { Injectable, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { BookModel } from '../model/book.modes';
import { BookService } from './book.service';
import { EditBookService } from './edit-book.service';

@Injectable({
  providedIn: 'root',
})
export class ModalService {

  newBook!: BookModel;
  formModalRef!: BsModalRef;
  confirmModalRef!: BsModalRef;
  private book = new BehaviorSubject(<BookModel>{});
  public bookBehaviorSubject$ = this.book.asObservable();
 

  constructor(
    private modalService: BsModalService,
    private service: BookService,
    private editedBookService: EditBookService
  ) {}

  setBook(newBook: BookModel) {
    this.book.next(newBook);
  }

  openForm(template: TemplateRef<any>) {
    this.formModalRef = this.modalService.show(template);
  }

  closeForm() {
    this.formModalRef.hide();
  }

  openConfirmModal(template: TemplateRef<any>) {
    this.confirmModalRef = this.modalService.show(template);
  }

  closeConfirmModal() {
    this.confirmModalRef.hide();
  }

  updateBook(bookId: string, book: BookModel) {
    this.service.editBook(bookId, book).subscribe((data) => {
      this.editedBookService.setEditedBook(book);
    });
  }
}
