import { inject } from "@angular/core"
import { Store } from "@ngrx/store"
import { ticketsFeature } from "./reducer";
import { ticketsActions } from "./actions";


export function injectTicketsFacade() {
  const store = inject(Store);

  return {
    flights$: store.select(ticketsFeature.selectFlights),
    search: (from: string, to: string) => {
      store.dispatch(ticketsActions.flightsLoad({ from, to }))
    }
  };
}
