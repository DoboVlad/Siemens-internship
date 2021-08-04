import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  animate,
  AUTO_STYLE,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Observable } from 'rxjs';
import { ResizeService } from 'src/app/core/services/utility/resize/resize.service';
import { BookModel } from '../../model/book.modes';
import { CategoryModel } from '../../model/category';
import { AddBookService } from '../../services/add-book.service';
import { BookService } from '../../services/book.service';
import { CategoryService } from '../../services/category.service';
import { ModalService } from '../../services/modal.service';
import { BookLoadingService } from 'src/app/core/services/utility/loading-spinner/book-loading.service';
import { AuthService } from 'src/app/feature-modules/auth/services/auth.service';
import { ShoppingCartService } from 'src/app/feature-modules/shopping-cart/services/shopping-cart.service';
import { SearchBookService } from '../../services/search-book.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-books-list',
  templateUrl: './books-list.component.html',
  styleUrls: ['./books-list.component.scss'],
  animations: [
    trigger('collapse', [
      state('false', style({ height: AUTO_STYLE, visibility: AUTO_STYLE })),
      state('true', style({ height: '0', visibility: 'hidden' })),
      transition('false => true', animate(100 + 'ms ease-in')),
      transition('true => false', animate(200 + 'ms ease-out')),
    ]),
  ],
})
export class BooksListComponent implements OnInit {
  booksArray: BookModel[] = [];
  oneBook!: BookModel;
  isMobile$!: Observable<boolean>;
  isAddMobile!: boolean;
  isMobile!: boolean;
  collapsedCategories!: boolean;
  collapsedPrice!: boolean;
  collapsedAuthor!: boolean;
  books!: Observable<BookModel[]>;
  booksToDisplay$!: Observable<BookModel[]>;
  categories$: Observable<CategoryModel[]> =
    this.categoriesService.getCategories();
  isLoadingData$!: Observable<boolean>;
  categoriesSelectedArray: String[] = [];
  booksAuthors = this.bookService.getBooksAuthors();
  booksAuthorSelected: String[] = [];
  booksPriceRangeMin: number = 10;
  booksPriceRangeMax: number = 800;
  showFilterBooks!: boolean;
  authSource!: Observable<boolean>;
  isAdminRole!: boolean;
  searchedText: string = '';

  constructor(
    private bookService: BookService,
    private resizeService: ResizeService,
    private addedBookServie: AddBookService,
    private modalsService: ModalService,
    private bookLoadingService: BookLoadingService,
    private categoriesService: CategoryService,
    private authService: AuthService,
    private shoppingCartService: ShoppingCartService,
    private searchBookService: SearchBookService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.bookLoadingService.show();
    this.searchBookService.searchedText$.subscribe(
      (searchedText) => (this.searchedText = searchedText)
    );

    this.route.params.subscribe((res) => {
      this.searchBookService.setSearchedText('');
      this.searchedText = '';
    });

    this.isLoadingData$ = this.bookLoadingService.loading$;
    this.addedBookServie.addedBookAction$.subscribe((data) => {
      this.isAddMobile = false;
    });
    this.addedBookServie.addedBookAction$.subscribe((data) => {
      this.booksArray.push(data);
    });

    this.isMobile$ = this.resizeService.isMobile$;

    this.authSource = this.authService.isCurrentUserAdmin();

    this.bookService.getBooks().subscribe((books) => {
      this.booksArray = books;
      this.bookLoadingService.hide();
    });

    this.isMobile$.subscribe((data) => {
      this.isMobile = data;
      this.collapsedCategories = data ? true : false;
      this.collapsedPrice = data ? true : false;
      this.collapsedAuthor = data ? true : false;
    });

    this.showFilterBooks = true;
  }

  onClickActivateAddForm() {
    this.activateForm();
  }

  onToggleCategories() {
    this.collapsedCategories = !this.collapsedCategories;
  }

  onToggleAuthor() {
    this.collapsedAuthor = !this.collapsedAuthor;
  }

  onToggleFilterBooks() {
    this.showFilterBooks = !this.showFilterBooks;
  }

  onTogglePrice() {
    this.collapsedPrice = !this.collapsedPrice;
  }

  addBook(id: any) {
    this.isAddMobile = false;
    this.modalsService.closeForm();
    this.bookService.getBookById(id.name).subscribe((book) => {
      this.booksArray = [...this.booksArray, book];
    });
  }

  openForm(template: TemplateRef<any>) {
    this.modalsService.openForm(template);
  }

  closeForm() {
    this.modalsService.closeForm();
  }

  private activateForm() {
    this.isAddMobile = true;
  }

  onPropertyCheckboxChange(event: Event, property: String) {
    const propertyEvent = event.target as HTMLInputElement;

    if (propertyEvent.checked) {
      if (property === 'category')
        this.categoriesSelectedArray = [
          ...this.categoriesSelectedArray,
          propertyEvent.value,
        ];
      else if (property === 'author')
        this.booksAuthorSelected = [
          ...this.booksAuthorSelected,
          propertyEvent.value,
        ];
    } else {
      if (property === 'category')
        this.categoriesSelectedArray = this.categoriesSelectedArray.filter(
          (e) => e !== propertyEvent.value
        );
      else if (property === 'author')
        this.booksAuthorSelected = this.booksAuthorSelected.filter(
          (e) => e !== propertyEvent.value
        );
    }
  }

  onPriceMinSelected(event: Event) {
    this.booksPriceRangeMin = +(event.target as HTMLInputElement).value;
  }

  onPriceMaxSelected(event: Event) {
    this.booksPriceRangeMax = +(event.target as HTMLInputElement).value;
  }

  onOrderSelected(event: Event) {
    const order = event.target as HTMLInputElement;
    if (order.value === '') {
      this.bookService.getBooks().subscribe((books) => {
        this.booksArray = books;
      });
    }
  }
}
