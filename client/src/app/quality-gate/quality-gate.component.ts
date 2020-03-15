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
  
  qualityCheckInfo:Array<any> = [];
  // apiResponse:Contract;
  
  constructor(private service: BookingsService) { }

  ngOnInit() {
    console.log("Initialising quality gate")
    let bookings = this.service.getBookings();
    bookings.subscribe(response => {
      if (response){
        let paymentCounts = this.paymentCounter(response.bookings);
        console.log(paymentCounts)
        this.qualityCheckInfo = response.bookings.map(x => {return {
          ...x,
          qualityCheck:{ 
            invalidEmail: !this.emailCheck(x.email),
            amountTreshold: this.amountTreshold < x.amount,
            duplicatedPayment: paymentCounts[x.student_id] > 1
          },
          amountWithFees: x.amount + this.calculateFees(x.amount),
          overPayment: Math.abs(x.amount_received) - Math.abs(x.amount + this.calculateFees(x.amount)) > 0, // Abs values to handle negative payments   
          underPayment: Math.abs(x.amount_received) - Math.abs(x.amount + this.calculateFees(x.amount)) < 0 // Id., they can be introduced, so handle them 
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
   * Returns true if the mail is valid
   */  
  emailCheck = (mail) => {
    // local part: any set of a-zA-Z0-9!#$%&'*+/=?^_`{|}~- with no 2 consecutive . allowed
    // @ 
    // domain: groups of 0-63 a-zA-Z0-9 separated by . (labels), - are accepted but not at beggining or end of the label
    return /^[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
      .test(mail);
  }

  /**
   * Reducer that counts how many payments each student made, 
   * Takes an array of bookings as input
   * Returns an array with elements student_id -> payments
   */
  paymentCounter = (bookings) => {
    console.log(bookings);
    return bookings.reduce((p, c) => {
      if (p[c.student_id] === undefined)
        p[c.student_id] = 0;
      p[c.student_id]++;      
      return p;      
    }, {});
    
  }
  /**
   * Calculate fees based on the amount payed, according to reqs:
   * if the amount < 1000 USD: 5% fees
   * if the amount > 1000 USD AND < 10000 USD: 3% fees
   * if the amount > 10000 USD: 2% fees
   */
  calculateFees = (amount):any => {
    let fees = 0;
    if (amount > 10000)
      fees = amount * 0.02;
    else{
      if (amount > 1000)
        fees = amount * 0.03;
      else
        fees = amount * 0.05;
    }
    return (amount > 0 ) ? fees : 0; // Guessing no fees if it's a debit amount
  }
}
