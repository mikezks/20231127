import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { ticketsActions } from '../../+state/actions';
import { ticketsFeature } from '../../+state/reducer';
import { FlightService } from '../../logic/data-access/flight.service';
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
  private flightService = inject(FlightService);
  private store = inject(Store);

  protected from = 'Hamburg';
  protected to = 'Graz';
  protected flights$ = this.store.select(ticketsFeature.selectFlights);
  protected basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  protected search(): void {
    if (!this.from || !this.to) {
      return;
    }

    this.flightService.find(this.from, this.to).subscribe({
      next: flights => this.store.dispatch(
        ticketsActions.flightsLoaded({ flights })
      ),
      error: errResp => console.error('Error loading flights', errResp)
    });
  }
}
