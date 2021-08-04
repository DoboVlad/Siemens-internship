import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookModel } from '../model/book.modes';


@Injectable({
  providedIn: 'root',
})
export class EditBookService {

  constructor() {}

  private subject = new BehaviorSubject(<BookModel>{});
  
  setEditedBook(book: BookModel){
    this.subject.next(book);
  }

  clear(){
    this.subject.next(<BookModel>{});
  }

  getEditedBook(): Observable<BookModel>{
    return this.subject.asObservable();
  }
 
}
