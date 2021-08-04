import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MAIN_API_ENDPOINTS } from 'src/app/constants/endpoints';
import { environment } from 'src/environments/environment';
import { Order } from '../../model/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  baseUrl: string = environment.firebase.databaseURL + MAIN_API_ENDPOINTS.orders + MAIN_API_ENDPOINTS.json;

  constructor(private http: HttpClient) { }

  orderProducts(order: Order) {
    return this.http.post(this.baseUrl, order);
  }
}
