import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Contract } from '../model/contract';
import { BookingsService } from './bookings.service';

const workingCall:Contract = {bookings:[
    { 
        reference: "A",
        amount: 1,
        amount_received: 2,
        country_from: "Country",
        sender_full_name: "Full name",
        sender_address: "Address",
        school: "School",
        currency_from: "CCY",
        student_id: 123,
        email: "working@mail.com"
    },
    { 
        reference: "B",
        amount: 10,
        amount_received: 21,
        country_from: "Another Country",
        sender_full_name: "Not so Full name",
        sender_address: "Not a real Address",
        school: "Some School",
        currency_from: "GBP",
        student_id: 120,
        email: "not-working..becase-of-the-dots@mail.com"
    }
]}
describe("BookingsService", () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
          imports: [],
          declarations: [
            BookingsService
          ],
        }).compileComponents();
      }));

    it("should return a booking list", () => {
        const service = TestBed.createComponent(BookingsService);
        service.debugElement.componentInstance
    })
});