import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription, share, tap, timer } from 'rxjs';

@Component({
  selector: 'app-flight-typeahead',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-typeahead.component.html',
  styleUrl: './flight-typeahead.component.scss'
})
export class FlightTypeaheadComponent implements OnDestroy {
  timer$ = timer(0, 1_000).pipe(
    tap(value => console.log('Event Producer', value)),
    share()
  );
  subscription = new Subscription();

  constructor() {
    this.rxjsDemo();
  }

  rxjsDemo(): void {
    this.subscription.add(
      this.timer$.subscribe(console.log)
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
