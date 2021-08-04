import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShoppingCartRoutingModule } from './shopping-cart-routing.module';
import { ShoppingCartComponent } from './shopping-cart/shopping-cart.component';
import { CartItemComponent } from './cart-item/cart-item.component';
import { BookDetailCartPopoverComponent } from './components/book-detail-cart-popover/book-detail-cart-popover.component';
import { OrderComponent } from './components/order/order.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { WishlistPopoverComponent } from './components/wishlist-popover/wishlist-popover.component';


@NgModule({
  declarations: [
    BookDetailCartPopoverComponent,
    OrderComponent,
    ShoppingCartComponent,
    CartItemComponent,
    WishlistPopoverComponent
  ],
  imports: [
    CommonModule,
    ShoppingCartRoutingModule,
    ReactiveFormsModule,
    SharedModule
  ],
  exports: [BookDetailCartPopoverComponent, WishlistPopoverComponent]
})
export class ShoppingCartModule { }
