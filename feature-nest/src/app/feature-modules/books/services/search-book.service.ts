import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchBookService {
  searchText: string = '';

  constructor() {}

  private searchedText = new BehaviorSubject(this.searchText);
  public searchedText$ = this.searchedText.asObservable();

  public setSearchedText(name: string) {
    this.searchText = name;
    this.searchedText.next(this.searchText);
  }

  public getSearchedText() {
    return this.searchText;
  }
}
