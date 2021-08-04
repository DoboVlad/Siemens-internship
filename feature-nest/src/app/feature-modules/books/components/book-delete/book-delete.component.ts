import { Component, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BookService } from '../../services/book.service';
import { BookModel } from '../../model/book.modes';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastsServiceService } from 'src/app/shared/services/toasts.service';

@Component({
  selector: 'app-book-delete',
  templateUrl: './book-delete.component.html',
  styleUrls: ['./book-delete.component.scss']
})

export class BookDeleteComponent {
  modalRef!: BsModalRef;
  editedBook$!: Observable<BookModel>;
  bookId!: string;
  isDeleteConfirmationShown: boolean = false;
  bookTitle: any;
  isAdmin: boolean = false;
  
  constructor(
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService,
    private toastr: ToastsServiceService
    ) {
      this.bookId = this.route.snapshot.params.id;
    }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  onOkDelete() {
    this.deleteBook();
    this.modalRef.hide();
  }
  
  onCancelDelete() {
    this.isDeleteConfirmationShown = false;
  }

  private deleteBook() {
    this.bookService.deleteBookById(this.bookId).subscribe(() => {
      this.router.navigate(['books']);
      this.toastr.showInfoToast('Book deleted');
    })
  }
  
}
