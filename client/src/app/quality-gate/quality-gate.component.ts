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
  bookingsApiPath = "/api/bookings"

  apiResponse:Contract;
  
  constructor(private service: BookingsService) { }

  ngOnInit() {
    console.log("Initialising quality gate")
    let bookings = this.service.getBookings();
    bookings.subscribe(response => {
      if (response)
        console.log(response);
      else{
        console.log("Error fetching bookings");
      }
    })
    console.log("done");
  }

}
