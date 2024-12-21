import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { FlightComponent } from "./flight/flight.component";
import { DetailComponent } from "./detail/detail.component";
import { ContactComponent } from "./contact/contact.component";
import { AppComponent } from "./app.component";


import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

@NgModule({
  declarations: [
    AppComponent,
    FlightComponent,
    DetailComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/flight', pathMatch: 'full' },
      { path: 'contact', component: ContactComponent },
      { path: 'detail/:id', component: DetailComponent },
      { path: 'flight', component: FlightComponent },
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }