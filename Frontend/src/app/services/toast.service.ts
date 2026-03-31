import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  getToast(message: string, type: 'success' | 'error' | 'info' | 'warning') {
  const icons = {
    success: `
      <svg class="toast-svg success" viewBox="0 0 24 24">
        <path d="M20 6L9 17l-5-5" fill="none" stroke="currentColor" stroke-width="2"/>
      </svg>
    `,
    error: `
      <svg class="toast-svg error" viewBox="0 0 24 24">
        <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" stroke-width="2"/>
      </svg>
    `,
    info: `
      <svg class="toast-svg info" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none"/>
        <line x1="12" y1="10" x2="12" y2="16" stroke="currentColor" stroke-width="2"/>
      </svg>
    `,
    warning: `
      <svg class="toast-svg warning" viewBox="0 0 24 24">
        <path d="M12 3L2 21h20L12 3z" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>
    `
  };

  return `
    <div class="toast-flex">
      ${icons[type]}
      <span>${message}</span>
    </div>
  `;
}
}
