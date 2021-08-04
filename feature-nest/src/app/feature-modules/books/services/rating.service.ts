import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MAIN_API_ENDPOINTS } from 'src/app/constants/endpoints';
import { environment } from 'src/environments/environment';
import { ReviewModel } from '../model/rating';

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  
  private ratingsUrl = environment.firebase.databaseURL + MAIN_API_ENDPOINTS.ratings;
  reviewId: string = '';

  constructor(private http: HttpClient) { }
  
  public addRating(rating: ReviewModel): Observable<Object>{
    const ratingUrl = `${this.ratingsUrl}${MAIN_API_ENDPOINTS.json}`;
    return this.http.post(ratingUrl, rating);
  }

  public editReview(reviewId: string, review: ReviewModel):Observable<Object> {
    const editReviewUrl = `${this.ratingsUrl}/${reviewId}${MAIN_API_ENDPOINTS.json}`;
   
    return this.http.put(editReviewUrl, review);
  }

  public getRatings(): Observable<ReviewModel[]> {
    const ratingUrl = `${this.ratingsUrl}${MAIN_API_ENDPOINTS.json}`;
    return this.http.get<{[key: string]: ReviewModel}>(ratingUrl).pipe(
      map((reviews) =>{
        const reviewsArray: ReviewModel[] = [];
        for(const key in reviews){
          if(reviews.hasOwnProperty(key)){
            reviewsArray.push({...reviews[key], id: key});
          }
        }
        return reviewsArray;
      })
    )
  }

  getUserOrBookRatings(ratingType: string, id?: string):Observable<ReviewModel[]> {
    const ratingUrl = `${this.ratingsUrl}${MAIN_API_ENDPOINTS.json}`;
    return this.http.get<{ [key: string]: ReviewModel}>(ratingUrl).pipe(
      map((reviews) => {
          const reviewsArray: ReviewModel[] = [];
          for(const key in reviews){
            if(ratingType === 'user'){
              if(reviews[key].userId === id)
              reviewsArray.push({...reviews[key], id:key});
            }
            else if(ratingType === 'book'){
              if(reviews[key].bookId === id)
                reviewsArray.push({...reviews[key], id:key});
            }
            else{
              if(reviews.hasOwnProperty(key)){
                reviewsArray.push({...reviews[key], id: key});
              }
            }
          }
          return reviewsArray;
      })
    );
  }

  public getBookRatingsScore(bookId: string):Observable<number[]> {
    const ratingUrl = `${this.ratingsUrl}${MAIN_API_ENDPOINTS.json}`;
    return this.http.get<{ [key: string]: ReviewModel}>(ratingUrl).pipe(
      map((reviews) => {
          const reviewsArray: number[] = [];
          for(const key in reviews){
            if(reviews[key].bookId === bookId)
            reviewsArray.push(reviews[key].rate);
          }
          return reviewsArray;
        })
      );
  }

  public isBookRatedByUser(bookId: string, userId: string):Observable<boolean> {
    const ratingUrl = `${this.ratingsUrl}${MAIN_API_ENDPOINTS.json}`;
    return this.http.get<{ [key: string]: ReviewModel}>(ratingUrl).pipe(
      map((reviews) => {
          const reviewsArray: ReviewModel[] = [];
          for(const key in reviews){
            if(reviews[key].bookId === bookId && reviews[key].userId === userId)
            {
              reviewsArray.push({...reviews[key], id:key});
              this.reviewId = key;
            }
          }
          const isRated = reviewsArray.length>=1 ;
          return isRated;
        })
      );
  }

}
