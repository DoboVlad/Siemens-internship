import { BookModel } from '../../books/model/book.modes';

export interface cartModel {
  books: BookModel[];
  numberOfProducts: number;
  subtotalPriceProducts: number;
}
