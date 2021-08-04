import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RecommendedBooksService } from 'src/app/shared/services/recommended-books.service';
import { RatingService } from '../../../services/rating.service';

@Component({
  selector: 'app-rating-display',
  templateUrl: './rating-display.component.html',
  styleUrls: ['./rating-display.component.scss'],
})
export class RatingDisplayComponent implements OnInit, OnChanges {
  constructor(
    private ratingService: RatingService,
    private recommendedBooksService: RecommendedBooksService
  ) {}

  @Input() bookId!: string;
  @Input() nrRatings!: number;
  avgRate!: Observable<any>;
  stars!: Observable<number[]>;
  nrOfRatings: number = 0;

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateAvgRating();
    this.setBooksRecommendedRatings();
  }

  calculateAvgRating() {
    this.stars = this.ratingService.getBookRatingsScore(this.bookId);
    this.avgRate = this.stars.pipe(
      map((ratings) => {
        if (ratings.length != 0) this.nrOfRatings = ratings.length;
        return ratings.length
          ? (ratings.reduce((total, val) => +total + +val) / ratings.length) *
              20
          : 0;
      })
    );
  }

  setBooksRecommendedRatings() {
    let bookRating = {
      id: '',
      rating: 0,
    };
    let sumOfRatings = 0;
    // this.ratingService.getBookRatingsScore(this.bookId).subscribe((res) => {
    //   res.forEach((rating) => (sumOfRatings = +sumOfRatings + +rating));
    //   bookRating.rating = sumOfRatings;
    //   bookRating.id = this.bookId;
     
    //   this.recommendedBooksService.setBookRecommended(bookRating);
    // });
  }
}
