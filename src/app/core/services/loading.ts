import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Loading {
  private readonly pendingRequestsSubject = new BehaviorSubject<number>(0);
  readonly pendingRequests$ = this.pendingRequestsSubject.asObservable();
  readonly isLoading$ = new BehaviorSubject<boolean>(false);

  show(): void {
    const nextValue = this.pendingRequestsSubject.value + 1;
    this.pendingRequestsSubject.next(nextValue);
    this.isLoading$.next(nextValue > 0);
  }

  hide(): void {
    const nextValue = Math.max(0, this.pendingRequestsSubject.value - 1);
    this.pendingRequestsSubject.next(nextValue);
    this.isLoading$.next(nextValue > 0);
  }

  reset(): void {
    this.pendingRequestsSubject.next(0);
    this.isLoading$.next(false);
  }
}
