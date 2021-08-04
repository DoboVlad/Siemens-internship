import { ActivatedRoute, Router } from '@angular/router';
import {
  Component,
  ElementRef,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BookModel } from '../../model/book.modes';
import { BookService } from '../../services/book.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ResizeService } from 'src/app/core/services/utility/resize/resize.service';
import { EditBookService } from '../../services/edit-book.service';
import { ModalService } from '../../services/modal.service';
import { BookLoadingService } from 'src/app/core/services/utility/loading-spinner/book-loading.service';
import { noImage } from 'src/app/constants/images';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReviewModel } from '../../model/rating';
import { RatingService } from '../../services/rating.service';
import { User } from 'src/app/feature-modules/auth/model/user.model';
import { AuthService } from 'src/app/feature-modules/auth/services/auth.service';
import { switchMap } from 'rxjs/operators';

import { ShoppingCartService } from 'src/app/feature-modules/shopping-cart/services/shopping-cart.service';
import { BookRecommended } from 'src/app/shared/model/book-recomended';
import { WishListService } from 'src/app/feature-modules/shopping-cart/services/wish-list.service';
import {
  SiNewtonToastService,
  SiToastLocation,
  SiToastTypes,
} from '@simpl/newton-ng/toast';

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.scss'],
})
export class BookDetailComponent implements OnInit {
  @ViewChild('booksList') booksListContent!: ElementRef;

  noImage = noImage;
  editedBook!: BookModel;
  isEditMobile!: boolean;
  productId!: string;
  modalRef!: BsModalRef;
  isMobile$!: Observable<boolean>;
  currentBook!: BookModel;
  editedBook$!: Observable<BookModel>;
  isLoadingData$!: Observable<boolean>;
  editedBookFromForm$!: Observable<BookModel>;
  showMore = false;
  currentUser$: Observable<User> = this.authService.user$;
  user!: User;
  userReview!: FormGroup;
  bookReviews: ReviewModel[] = [];
  isUserAuth: boolean = false;
  nrOfRatings: number = 0;
  isAdminRole!: boolean;
  authSource!: Observable<boolean>;
  recommendedBooks: ReviewModel[] = [];
  recommendedBooksArrayFromDb: BookRecommended[] = [];
  recommendedBooksSorted: BookModel[] = [];
  userId!: string;
  book!: BookModel;

  private bookRecommended = new BehaviorSubject<BookRecommended[]>(
    this.recommendedBooksArrayFromDb
  );
  public bookRecommended$ = this.bookRecommended.asObservable();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private service: BookService,
    private resizeService: ResizeService,
    private editedBookService: EditBookService,
    private modalsService: ModalService,
    private bookLoadingService: BookLoadingService,
    private ratingService: RatingService,
    private authService: AuthService,
    private addToCartService: ShoppingCartService,
    private bookService: BookService,
    private toastService: SiNewtonToastService,
    private addToWishListService: WishListService
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.params.id;

    this.ratingService.getRatings().subscribe((data: ReviewModel[]) => {
      data.forEach((review) => this.recommendedBooks.push(review));
      this.recommendedBooks.forEach((review: ReviewModel) => {
        if (
          this.recommendedBooksArrayFromDb.some(
            (book) => book.id === review.bookId
          )
        ) {
          const index = this.recommendedBooksArrayFromDb.findIndex(
            (book) => book.id === review.bookId
          );
          this.recommendedBooksArrayFromDb[index].rating =
            +this.recommendedBooksArrayFromDb[index].rating + +review.rate;
        } else {
          if (this.productId !== review.bookId)
            this.recommendedBooksArrayFromDb.push({
              id: review.bookId,
              rating: review.rate,
            });
        }
      });
      this.recommendedBooksArrayFromDb.sort((book1, book2) =>
        book1.rating > book2.rating ? -1 : 1
      );
      this.recommendedBooksArrayFromDb
        .slice(0, 10)
        .forEach((book) =>
          this.bookService
            .getBookById(book.id)
            .subscribe((res) =>
              this.recommendedBooksSorted.push({ ...res, id: book.id })
            )
        );
    });

    this.userReview = new FormGroup({
      rate: new FormControl('', Validators.required),
      comment: new FormControl('', [Validators.required]),
      userId: new FormControl('', Validators.required),
      bookId: new FormControl(this.productId, Validators.required),
    });

    this.bookLoadingService.show();
    this.isLoadingData$ = this.bookLoadingService.loading$;

    this.isMobile$ = this.resizeService.isMobile$;

    this.authSource = this.authService.isCurrentUserAdmin();

    this.route.params
      .pipe(
        switchMap((param) => {
          this.productId = param.id;

          return this.service.getBookById(param.id);
        }),

        switchMap((book) => {
          this.book = book;

          return this.ratingService.getUserOrBookRatings(
            'book',
            this.productId
          );
        })
      )
      .subscribe((data) => {
        this.editedBookService.setEditedBook(this.book);

        this.bookLoadingService.hide();

        this.bookReviews = data;
      });

    this.editedBook$ = this.editedBookService.getEditedBook();
    this.editedBookFromForm$ = this.modalsService.bookBehaviorSubject$;

    this.currentUser$
      .pipe(
        switchMap((data) => {
          this.user = data;
          return this.authService.getUserById(data.id);
        })
      )
      .subscribe();

    this.ratingService.getUserOrBookRatings('user', this.user.id).subscribe();

    this.authService.isUserAuthenticated().subscribe((data) => {
      this.isUserAuth = data;
    });
  }

  showSuccessToast() {
    this.toastService.showToast({
      content: 'Book has been added!',
      type: SiToastTypes.SUCCESS,
      location: SiToastLocation.BOTTOM,
    });

    this.ratingService
      .getUserOrBookRatings('book', this.productId)
      .subscribe((data: any[]) => (this.bookReviews = data));
  }

  onDeleteCurrentBook(book: BookModel) {
    console.log(book);
  }

  showAlreadyInWshListToast() {
    this.toastService.showToast({
      content: 'Book already in wishlist!',
      type: SiToastTypes.SUCCESS,
      location: SiToastLocation.BOTTOM,
    });
  }

  toggleShowDescription() {
    this.showMore = !this.showMore;
  }

  openForm(template: TemplateRef<any>) {
    this.modalsService.openForm(template);
  }

  setEditFormValues(newBook: BookModel) {
    this.modalsService.setBook(newBook);
  }

  closeForm() {
    this.modalsService.closeForm();
  }

  openConfirmModal(template: TemplateRef<any>) {
    this.modalsService.openConfirmModal(template);
  }

  closeConfirmModal() {
    this.modalsService.closeConfirmModal();
  }

  setCurrentBook(book: BookModel) {
    this.isEditMobile = true;
    this.modalsService.setBook(book);
  }

  submit(book: BookModel) {
    this.modalsService.closeConfirmModal();
    this.modalsService.updateBook(this.productId, book);
  }

  getFormValues(data: BookModel) {
    this.currentBook = data;
  }

  redirectLogin() {
    this.router.navigate(['auth/login']);
  }

  ratingSubmit(): void {
    this.userReview.get('userId')?.patchValue(this.user.id);
    this.ratingService
      .isBookRatedByUser(this.productId, this.user.id)
      .pipe(
        switchMap((data) => {
          if (data === true)
            return this.ratingService.editReview(
              this.ratingService.reviewId,
              this.userReview.value
            );
          else return this.ratingService.addRating(this.userReview.value);
        })
      )
      .subscribe(() => {
        const bookIndex = this.bookReviews.findIndex(
          (el) => el.userId === this.user.id
        );
        if (bookIndex != -1) {
          let newBookReviews = [...this.bookReviews];
          newBookReviews[bookIndex] = this.userReview.value;
          this.bookReviews = [...newBookReviews];
        } else {
          this.bookReviews = [...this.bookReviews, this.userReview.value];
        }
        this.nrOfRatings += 1;
      });
    this.modalsService.closeForm();
  }

  public scrollRight(): void {
    this.booksListContent.nativeElement.scrollTo({
      left: this.booksListContent.nativeElement.scrollLeft + 150,
      behavior: 'smooth',
    });
  }

  public scrollLeft(): void {
    this.booksListContent.nativeElement.scrollTo({
      left: this.booksListContent.nativeElement.scrollLeft - 150,
      behavior: 'smooth',
    });
  }

  addToCart(book: BookModel) {
    // this.bookLoadingService.show();
    if (this.isUserAuth) {
      this.addToCartService.addProduct(book, this.productId);
    } else this.router.navigate(['/auth/login']);
  }

  addToWishList(book: BookModel): void {
    if (this.isUserAuth) {
      if (!this.addToWishListService.isBookInWishList(this.productId))
        this.addToWishListService
          .addBookToWishList(book, this.productId)
          .subscribe(() => this.showSuccessToast());
      else {
        this.showAlreadyInWshListToast();
      }
    } else this.router.navigate(['/auth/login']);
  }
}
