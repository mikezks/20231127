import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { take } from 'rxjs';
import { injectTicketsFacade } from '../../+state';
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
  protected ticketsFacade = injectTicketsFacade();

  protected from = 'Hamburg';
  protected to = 'Graz';
  protected flights$ = this.ticketsFacade.flights$;
  protected basket: Record<number, boolean> = {
    3: true,
    5: true,
  };

  delay(): void {
    this.flights$.pipe(take(1)).subscribe(flights => {
      const oldFlight = flights[0];
      const oldDate = new Date(oldFlight.date);

      const newDate = new Date(oldDate.getTime() + 1000 * 60 * 5); // Add 5 min
      const newFlight = {
        ...oldFlight,
        date: newDate.toISOString(),
        delayed: true
      };

      this.ticketsFacade.updateFlight(newFlight);
    });
  }
}
