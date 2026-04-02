import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Toast } from '../shared/toast/toast.model';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private toasts = new BehaviorSubject<Toast[]>([]);
  toasts$ = this.toasts.asObservable();

  private counter = 0;
  private LIMIT = 3

  show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const toast: Toast = {
      id: this.counter++,
      message,
      type,
      duration
    };

    let current = this.toasts.value;

    if(current.length >= this.LIMIT){
      current = current.slice(1)
    }

    this.toasts.next([...current, toast]);

    // auto remove after 3s
    setTimeout(() => this.remove(toast.id), duration);
  }

  remove(id: number) {
    this.toasts.next(this.toasts.value.filter(t => t.id !== id));
  }
}