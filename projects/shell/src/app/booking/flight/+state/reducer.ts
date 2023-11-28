import { createFeature, createReducer, on } from "@ngrx/store";
import { Flight } from "../logic/model/flight";
import { ticketsActions } from "./actions";


export interface TicketsState {
  flights: Flight[];
  basket: unknown;
  tickets: unknown;
}

export const initialTicketsState: TicketsState = {
  flights: [],
  basket: {},
  tickets: {}
};


export const ticketsFeature = createFeature({
  name: 'tickets',
  reducer: createReducer(
    initialTicketsState,

    on(ticketsActions.flightsLoaded, (state, action) => ({
      ...state,
      flights: action.flights
    })),
  )
});
