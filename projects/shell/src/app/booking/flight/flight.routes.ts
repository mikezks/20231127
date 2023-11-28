import { Routes } from "@angular/router";
import { provideState } from "@ngrx/store";
import { provideEffects } from "@ngrx/effects";
import { FlightEditComponent } from "./features/flight-edit/flight-edit.component";
import { FlightSearchComponent } from "./features/flight-search/flight-search.component";
import { FlightBookingComponent } from "./features/flight-booking/flight-booking.component";
import { flightsResolverConfig } from "./logic/data-access/flight.resolver";
import { FlightTypeaheadComponent } from "./features/flight-typeahead/flight-typeahead.component";
import { ticketsFeature } from "./+state/reducer";


export const FLIGHT_ROUTES: Routes = [
  {
    path: '',
    component: FlightBookingComponent,
    providers: [
      provideState(ticketsFeature),
      provideEffects()
    ],
    children: [
      {
        path: '',
        redirectTo: 'search',
        pathMatch: 'full'
      },
      {
        path: 'search',
        component: FlightSearchComponent,
      },
      {
        path: 'edit/:id',
        component: FlightEditComponent,
        resolve: flightsResolverConfig
      },
      {
        path: 'typeahead',
        component: FlightTypeaheadComponent,
      },
    ]
  }
];

export default FLIGHT_ROUTES;
