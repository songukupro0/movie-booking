import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface NotificationMessage {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
}

@Injectable({
  providedIn: 'root',
})
export class Notification {
  private readonly messagesSubject = new Subject<NotificationMessage>();
  readonly messages$ = this.messagesSubject.asObservable();

  success(message: string): void {
    this.push('success', message);
  }

  error(message: string): void {
    this.push('error', message);
  }

  info(message: string): void {
    this.push('info', message);
  }

  warning(message: string): void {
    this.push('warning', message);
  }

  private push(type: NotificationMessage['type'], message: string): void {
    this.messagesSubject.next({ type, message });
  }
}
