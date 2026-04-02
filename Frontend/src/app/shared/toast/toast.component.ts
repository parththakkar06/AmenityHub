import { Component, OnInit } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { Toast } from './toast.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  imports : [CommonModule],
  styleUrls: ['./toast.component.css']
})
export class ToastComponent implements OnInit {

  toasts: Toast[] = [];

  constructor(private toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toasts$.subscribe(data => {
      this.toasts = data;
    });
  }

  trackById(index: number, item: any) {
    return item.id;
  }

  remove(id: number) {
    this.toastService.remove(id);
  }
}