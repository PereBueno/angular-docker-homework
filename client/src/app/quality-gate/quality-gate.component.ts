import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Contract } from '../model/contract';
import { BookingsService } from '../services/bookings.service';

@Component({
  selector: 'quality-gate',
  templateUrl: './quality-gate.component.html',
  styleUrls: ['./quality-gate.component.css'],
  providers: [BookingsService]
})
export class QualityGateComponent implements OnInit {
  readonly bookingsApiPath = "/api/bookings";
  readonly amountTreshold = 1000000;

  apiResponse:Contract;
  
  constructor(private service: BookingsService) { }

  ngOnInit() {
    console.log("Initialising quality gate")
    let bookings = this.service.getBookings();
    bookings.subscribe(response => {
      if (response){
        let paymentCounts = this.paymentCounter(response);
        response.bookings.map(x => {return {
          ...x, 
          invalidEmail: this.emailCheck(x.email),
          amountTreshold: this.amountTreshold < x.amount,
          duplicatedPayment: paymentCounts[''+x.student_id] == 1
        }});
      }
      else{
        console.log("Error fetching bookings");
      }
    })
    console.log("done");
  }

  /**
   * Checks email format is valid
   */  
  emailCheck = (mail) => {
    // local part: any set of those characters and symbols with no 2 consecutive . allowed
    // @ 
    // domain: groups of 0-63 a-Z0-9 separated by . (labels), - are accepted but not at beggining or end of the label
    return /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      .test(mail);
  }

  /**
   * Reducer that counts how many payments each student made, 
   * Takes an array of bookings as input
   * Returns an array with elements student_id -> payments
   */
  paymentCounter = (bookings) => {
    return bookings.reduce((p, c) => {
      if (!p.hasOwnProperty(c.student_id)){
        p[''+c.student_id] = 0;
      p[''+c.student_id]++;
      return p;
      }
    }, {});
  }
}
