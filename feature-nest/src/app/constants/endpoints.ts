import { environment } from "src/environments/environment";

export const MAIN_API_ENDPOINTS = {
    books: '/books',  
    cart:'/cart',
    json: '.json',
    categories: '/categories',
    orders:'/orders',
    login: 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.firebase.apiKey,
    users: '/users',
    ratings: '/ratings',
    role: '/admin',
    userData: 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=' + environment.firebase.apiKey,
  
}
