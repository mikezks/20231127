import { createActionGroup, emptyProps, props } from "@ngrx/store";
import { Flight } from "../logic/model/flight";

export const ticketsActions = createActionGroup({
  source: 'tickets',
  events: {
    'flights load': props<{ from: string, to: string }>(),
    'flights loaded': props<{ flights: Flight[] }>(),
    'flight update': props<{ flight: Flight }>(),
    'flights clear': emptyProps()
  }
});

/* ticketsActions.flightsLoaded({ flights: [] });

const runtimeAction = {
  type: '[tickets] flights loaded',
  flights: []
} */
