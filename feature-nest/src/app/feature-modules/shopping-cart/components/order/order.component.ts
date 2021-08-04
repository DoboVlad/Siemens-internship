import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { regex } from 'src/app/constants/regex';
import { AuthService } from 'src/app/feature-modules/auth/services/auth.service';
import { BookModel } from 'src/app/feature-modules/books/model/book.modes';
import { ToastsServiceService } from 'src/app/shared/services/toasts.service';
import { Order } from '../../model/order.model';
import { OrderService } from '../../services/order-services/order.service';
import { ShoppingCartService } from '../../services/shopping-cart.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  cartBooks!: BookModel[];
  initialSubTotalPrice!: number;
  transportPrice = 0;
  totalPrice!: number;
  orderDetails!: Order;
  currentUserId!: string;
  orderForm: FormGroup = new FormGroup({
    'email': new FormControl(null,
      [Validators.required,
       Validators.pattern(regex.email)
      ]),
    'firstName': new FormControl(null,
    [
      Validators.required,
      Validators.pattern(regex.firstName)
    ]),
    'lastName': new FormControl(null,
      [
        Validators.required,
        Validators.pattern(regex.lastName)
      ]),
    'phone': new FormControl(null,
      [
        Validators.required,
        Validators.pattern(regex.phone)
      ]),
    'state': new FormControl(null,
      Validators.required),
    'county': new FormControl(null,
        Validators.required),
    'city': new FormControl(null,
          Validators.required),
    'address': new FormControl(null,
      Validators.required),
    'shippingMethod': new FormControl(null,
      Validators.required)
  });

  constructor(private authService: AuthService, private cartService: ShoppingCartService,
    private orderService: OrderService, private router: Router, private toastr: ToastsServiceService) { }

  ngOnInit(): void {

    this.authService.getUserData(this.authService.getToken()).pipe(
      switchMap((data) => {
        this.currentUserId = data.users[0].localId;
        return this.authService.getUserById(data.users[0].localId);
      })
    ).subscribe(data => {
      this.orderForm.patchValue({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
      });
    });

    this.cartService.products$.subscribe(data => {
      this.cartBooks = (Object.values(data.books));
      this.initialSubTotalPrice = data.subtotalPriceProducts;
      this.totalPrice = data.subtotalPriceProducts;
    })
  }

  onSetPrice(additionalPrice: number) {
    this.totalPrice = this.totalPrice == this.initialSubTotalPrice ? this.totalPrice + additionalPrice : this.initialSubTotalPrice;
    this.transportPrice = additionalPrice;
  }

  onSubmit() {
    this.orderDetails = {...this.orderForm.value};
    this.orderDetails.books = this.cartBooks;
    this.orderDetails.totalPrice = this.totalPrice;

    this.orderService.orderProducts(this.orderDetails).subscribe(data => {
      this.cartService.books = [];
      this.cartService.deleteCart(this.currentUserId).subscribe();
      this.router.navigate(['/books']);
      this.toastr.showInfoToast('Your order has been placed. Thank you');
    })
  }
}