import { CommonModule } from '@angular/common';
import { Component, computed, effect, inject, signal, untracked } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, timer } from 'rxjs';
import { ticketsActions } from '../../+state/actions';
import { ticketsFeature } from '../../+state/reducer';
import { FlightCardComponent } from '../../ui/flight-card/flight-card.component';
import { FlightFilterComponent } from '../../ui/flight-filter/flight-filter.component';


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

  protected from = signal('Hamburg');
  protected to = signal('Graz');
  protected flights = this.store.selectSignal(ticketsFeature.selectFlights);
  protected basket = signal<Record<number, boolean>>({
    3: true,
    5: true,
  });
  private lazyFrom$ = toObservable(this.from).pipe(
    debounceTime(300)
  );
  private lazyForm = toSignal(this.lazyFrom$, {
    initialValue: this.from()
  });
  protected flightRoute = computed(
    () => 'From ' + this.lazyForm() + ' to ' + this.to() + '.'
  );

  constructor() {
    /* timer(0, 1_000).pipe(
      this.takeUntilDestroyed()
    ).subscribe(console.log); */

    effect(() => console.log(
      this.from(),
      untracked(() => this.to())
    ));

    /**
     * from <-> lazyFrom <-> flightRoute <-> effect 2
     * from -> lazyFrom -> flightRoute -> Template
     * from -> effect 1
     * to -> effect 1
     */

    effect(() => console.log(
      this.flightRoute()
    ));

    this.from.set('Berlin');
    this.from.set('Rom');
    this.from.set('London');
    this.from.set('Madrid');
    setTimeout(() => console.log(this.from));
  }

  protected search(): void {
    if (!this.from() || !this.to()) {
      return;
    }

    this.store.dispatch(
      ticketsActions.flightsLoad({
        from: this.from(),
        to: this.to()
      })
    );
  }

  delay(): void {
    const oldFlight = this.flights()[0];
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
    this.basket.update(basket => ({
      ...basket,
      [id]: selected
    }));
  }
}
