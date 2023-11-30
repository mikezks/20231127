import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, timer, pipe, tap } from 'rxjs';
import { ticketsActions } from '../../+state/actions';
import { ticketsFeature } from '../../+state/reducer';
import { FlightCardComponent } from '../../ui/flight-card/flight-card.component';
import { FlightFilterComponent } from '../../ui/flight-filter/flight-filter.component';
import { patchState, signalState } from '@ngrx/signals';
import { Flight } from '../../logic/model/flight';
import { FlightFilter } from '../../logic/model/flight-filter';
import { rxMethod } from '@ngrx/signals/rxjs-interop';


@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FlightCardComponent,
    FlightFilterComponent
  ],
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
})
export class FlightSearchComponent {
  private store = inject(Store);
  private takeUntilDestroyed = takeUntilDestroyed;

  protected localState = signalState({
    filter: {
      from: 'Hamburg',
      to: 'Graz',
      urgent: false
    },
    basket: {
      3: true,
      5: true
    } as Record<number, boolean>,
    flights: [] as Flight[]
  });

  constructor() {
    rxMethod<Flight[]>(pipe(
      tap(flights => patchState(this.localState, { flights }))
    ))(
      this.store.select(ticketsFeature.selectFlights)
    );
  }

  protected search(filter: FlightFilter): void {
    patchState(this.localState, { filter });

    if (!this.localState.filter.from() || !this.localState.filter.to()) {
      return;
    }

    this.store.dispatch(
      ticketsActions.flightsLoad({
        from: this.localState.filter.from(),
        to: this.localState.filter.to()
      })
    );
  }

  delay(): void {
    const oldFlight = this.localState.flights()[0];
    const oldDate = new Date(oldFlight.date);

    const newDate = new Date(oldDate.getTime() + 1000 * 60 * 5); // Add 5 min
    const newFlight = {
      ...oldFlight,
      date: newDate.toISOString(),
      delayed: true
    };

    this.store.dispatch(ticketsActions.flightUpdate({ flight: newFlight }));
  }

  updateBasket(id: number, selected: boolean): void {
    patchState(this.localState, state => ({
      basket: {
        ...state.basket,
        [id]: selected
      }
    }));
  }
}
