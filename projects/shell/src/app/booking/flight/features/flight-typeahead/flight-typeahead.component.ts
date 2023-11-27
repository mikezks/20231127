import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs';
import { Flight } from '../../logic/model/flight';
import { FlightService } from './../../logic/data-access/flight.service';

@Component({
  selector: 'app-flight-typeahead',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './flight-typeahead.component.html',
  styleUrl: './flight-typeahead.component.scss'
})
export class FlightTypeaheadComponent {
  private flightService = inject(FlightService);

  control = new FormControl('', { nonNullable: true });
  flights$ = this.initFlightsStream();
  loading = false;

  initFlightsStream(): Observable<Flight[]> {
    /**
     * Stream 1: Input Control Value Change
     *  - Trigger
     *  - State Provider: Airport name
     */
    return this.control.valueChanges.pipe(
      // Filtering START
      filter(airport => airport.length > 2),
      debounceTime(300),
      distinctUntilChanged(),
      // Side-Effet: Loading State
      tap(() => this.loading = true),
      // Filtering END
      /**
       * Stream 2: API Backend Call
       *  - State Provider: Array of Flight
       */
      switchMap(airport => this.load(airport)),
      // Side-Effet: Loading State
      tap(() => this.loading = false)
    )
  }

  load(airport: string): Observable<Flight[]> {
    return this.flightService.find(airport, '');
  }
}
