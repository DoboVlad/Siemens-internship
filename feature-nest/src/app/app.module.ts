import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsModalRef, ModalModule } from 'ngx-bootstrap/modal';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { AuthModule } from './feature-modules/auth/auth.module';

import { BooksModule } from './feature-modules/books/books.module';
import { ShoppingCartModule } from './feature-modules/shopping-cart/shopping-cart.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    CoreModule,
    BooksModule,
    FormsModule,
    ReactiveFormsModule,
    ShoppingCartModule,
    ModalModule.forRoot(),
    AuthModule,
  ],
  providers: [BsModalRef],
  bootstrap: [AppComponent],
})
export class AppModule {}
