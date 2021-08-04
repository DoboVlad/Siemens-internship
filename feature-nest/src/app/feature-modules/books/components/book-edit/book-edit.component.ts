import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ToastsServiceService } from 'src/app/shared/services/toasts.service';
import { BookModel } from '../../model/book.modes';
import { BookService } from '../../services/book.service';
import { EditBookService } from '../../services/edit-book.service';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.scss'],
})
export class BookEditComponent implements OnInit {
  @Input() book!: BookModel;
  @Output() onEmitValues = new EventEmitter();

  private bookId!: string;

  isLoadingData$!: Observable<boolean>;

  constructor(
    private service: BookService,
    private editedBookService: EditBookService,
    private route: ActivatedRoute,
    private toastrService: ToastsServiceService
   
  ) {
    this.bookId = this.route.snapshot.params.id;
  }

  ngOnInit(): void {
    
  }

  updateBook(book: BookModel) {
    this.service.editBook(this.bookId, book).subscribe((data) => {
      this.editedBookService.setEditedBook(book);
      this.toastrService.showSuccessToast('Book edited succesfully!');
      
    });
  }
  emitValues(data: BookModel) {
    this.onEmitValues.emit(data);
  }
}
