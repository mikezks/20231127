import { ticketsFeature } from './reducer';
import { createSelector } from "@ngrx/store";

export const selectFilteredFlights = createSelector(
  // Selectors
  ticketsFeature.selectFlights,
  ticketsFeature.selectHide,
  // Projector
  (flights, hide) => flights.filter(
    flight => !hide.includes(flight.id)
  )
);
