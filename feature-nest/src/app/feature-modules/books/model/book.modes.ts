export interface BookModel {
  [x: string]: any;
  productId: string;
  title: string;
  price: number;
  author: string;
  category: string;
  publishingHouse: string;
  description: string;
  imageUrl: string;
  quantity: number;
  isInWishList?:boolean;
}
