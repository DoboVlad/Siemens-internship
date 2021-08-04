import { Pipe, PipeTransform } from '@angular/core';
import { BookModel } from 'src/app/feature-modules/books/model/book.modes';


@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(items: Array<any>, bookCategories: any[], bookAuthor: any[], priceRangeMin: any, priceRangeMax: any): Array<any> {
    return items.filter(
        (book) => this.isPriceInRange(book,priceRangeMin,priceRangeMax) 
                  && (bookAuthor.length !=0 ? this.isSameAuthor(book, bookAuthor): true)
                  && (bookCategories.length != 0 ? this.isSameCategory(book, bookCategories): true));
  
    }

isPriceInRange(book:BookModel, min:number, max:number){
  return +book.price <= max && +book.price >= min;
}

isSameAuthor(book: BookModel, selectedBookAuthors: String[]){
  for(let bookAuthor of selectedBookAuthors){
    if(bookAuthor === book.author){
      return true;
    }
  }
return false;
}

isSameCategory(book: BookModel, selectedBookCategory: String[]){
 
    for(let bookCategory of selectedBookCategory){
        if(bookCategory === book.category){
          return true;
        }
      }
    return false;
}

}
