import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment'
import { Contract } from '../model/contract';
import { BookingsService } from '../services/bookings.service';
import { overrideComponentView } from '@angular/core/src/view';

const UNDERPAYMENT = "UNDER";
const OVERPAYMENT = "OVER";

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
        this.qualityCheckInfo = response.bookings.map(x => {          
          let paymentExcess = this.checkOverUnderPayment(x.amount, x.amount_received);
          return {
            ...x,
            qualityCheck:{ 
              invalidEmail: !this.emailCheck(x.email),
              amountTreshold: this.amountTreshold < x.amount,
              duplicatedPayment: paymentCounts[x.student_id] > 1
            },
            amountWithFees: x.amount + this.calculateFees(x.amount),
            overPayment: OVERPAYMENT === paymentExcess, 
            underPayment: UNDERPAYMENT === paymentExcess
        }});
      }
      else{
        console.error("Error fetching bookings");
      }
    })
    console.log("done");
  }

  /**
   * Method to check over-under payments.
   * Fees are excluded from the calculation, as reqs say "over-payment happens when the user pays more than the tuition amount we introduced"
   * so it's not included here.
   * Works also for negative values, no idea if they make sense (a refund?) but they can be introduced in the form
   * Returns UNDERPAYMENT in the expected value is less than the actual, OVERPAYMENT if actual is bigger than expected or
   * 'EQUALS' if both values are the same
   */
  checkOverUnderPayment = (expected, actual) => {
    let result = "EQUALS";                
    if (expected < actual)
      result = UNDERPAYMENT;
    else if (expected > actual)
      result = OVERPAYMENT
    return result;
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
