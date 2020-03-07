import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { QualityGateComponent } from './quality-gate/quality-gate.component';
import { BookingsService } from './services/bookings.service';

@NgModule({
  declarations: [
    AppComponent,
    QualityGateComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    BookingsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
