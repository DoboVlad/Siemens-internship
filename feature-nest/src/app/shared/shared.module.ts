import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderByPipe } from './pipes/order-by.pipe';
import { BookLoaderComponent } from './components/book-loader/book-loader.component';

@NgModule({
  declarations: [OrderByPipe,BookLoaderComponent],
  imports: [
    CommonModule,
   
  ],
  exports:[
    OrderByPipe,
    BookLoaderComponent,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SharedModule {}
