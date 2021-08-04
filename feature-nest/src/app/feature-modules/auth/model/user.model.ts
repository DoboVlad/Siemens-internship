import { BookModel } from "../../books/model/book.modes";

export interface User {
    email: string;
    id: string;
    token: string;
    tokenExpirationDate: Date;
    role?: string;
    wishList?: BookModel[];
}
