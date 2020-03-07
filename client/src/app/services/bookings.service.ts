import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { Contract } from '../model/contract';
import { environment } from '../../environments/environment'

const httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' })
  };

@Injectable()
export class BookingsService{
    readonly bookingsApiPath = "/api/bookings";

    constructor(private http: HttpClient) { }

    getBookings(): Observable<Contract> {
        // let headers = new HttpHeaders().set('Access-Control-Allow-Origin', '*');
        return this.http.get<Contract>(environment.apiBaseUrl + this.bookingsApiPath, httpOptions)
          .pipe(
            tap(() => console.log("fetched bookings")),
            catchError(this.handleError<Contract>('getBookings'))
          ) as Observable<Contract>;
      }

    private handleError<T>(action = "unknown") {
        return (error: HttpErrorResponse) : Observable<T> => {            
            console.error(error);
            const message = (error.error instanceof ErrorEvent) ? error.error.message : "Error " + error.status + ": " + error.error
            throw new Error(action + " failed: " + message);
        }
    }
}