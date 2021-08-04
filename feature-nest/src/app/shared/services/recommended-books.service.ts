import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MAIN_API_ENDPOINTS } from 'src/app/constants/endpoints';
import { environment } from 'src/environments/environment';
import { BookRecommended } from '../model/book-recomended';

@Injectable({
  providedIn: 'root',
})
export class RecommendedBooksService {
  booksRecommended: BookRecommended[] = [];
  constructor(private http: HttpClient) {}

  private baseRating =
    environment.firebase.databaseURL +
    MAIN_API_ENDPOINTS.ratings +
    MAIN_API_ENDPOINTS.json;

  setBookRecommended(book: BookRecommended) {
    this.booksRecommended.push(book);
    this.booksRecommended.sort((one, two) =>
      one.rating > two.rating ? -1 : 1
    );
  }

  getRatings(){

    return this.http.get(this.baseRating);
  }

  getBooksRecommended() {
    return this.booksRecommended;
  }
}
