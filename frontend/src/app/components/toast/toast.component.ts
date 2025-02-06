import { Component, input, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-toast',
  imports: [],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent implements OnInit { 
  message = input('');
  type = input<'success' | 'error'| 'loading'>('success');
  duration = input(3000);

  showToast = signal(false);

  ngOnInit() {
    this.showToast.set(true);
    setTimeout(() => {
      this.showToast.set(false);
    }, this.duration());
  }
}
