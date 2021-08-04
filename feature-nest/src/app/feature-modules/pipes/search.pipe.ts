import { Pipe, PipeTransform } from '@angular/core';
import { BookModel } from '../books/model/book.modes';

@Pipe({
  name: 'search',
})
export class SearchPipe implements PipeTransform {
  transform(items: Array<any>, searchText: string): Array<any> {
    return items.filter((book) => this.search(book, searchText));
  }

  search(book: BookModel, searchText: string) {
    if (searchText) {
      if (
        book.author.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
      )
        return true;
      if (
        book.category
          .toLocaleLowerCase()
          .includes(searchText.toLocaleLowerCase())
      )
        return true;
      if (
        book.title.toLocaleLowerCase().includes(searchText.toLocaleLowerCase())
      )
        return true;
      return false;
    }

    return true;
  }
}
