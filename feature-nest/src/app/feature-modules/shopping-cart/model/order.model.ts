import { BookModel } from "../../books/model/book.modes";

export interface Order {
    userId: number;
    email: string;
    firstName: string;
    lastName: string;
    country: string;
    city: string;
    state: string;
    address: string;
    phone: string;
    shippingMethod: string;
    books: BookModel[];
    totalPrice: number;
}