import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SiNewtonHeader2Module } from '@simpl/newton-ng/header2';
import { BooksRoutingModule } from '../feature-modules/books/books-routing.module';
import { FooterComponent } from './footer/footer.component';
import { ClickOutsideDirective } from './navbar/directives/click-outside.directive';
import { NavbarComponent } from './navbar/navbar.component';
import { ScrollToTopComponent } from './components/scroll-to-top/scroll-to-top.component';
import { ScrollToTopDirDirective } from './directives/scroll-to-top-dir.directive';
import { ShoppingCartModule } from '../feature-modules/shopping-cart/shopping-cart.module';

@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    ScrollToTopComponent,
    ScrollToTopDirDirective,
    ClickOutsideDirective,
  ],
  imports: [
    CommonModule,
    SiNewtonHeader2Module,
    FormsModule,
    ReactiveFormsModule,
    BooksRoutingModule,
    ShoppingCartModule
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    ScrollToTopComponent,
    ScrollToTopDirDirective,
  ],
})
export class CoreModule {}