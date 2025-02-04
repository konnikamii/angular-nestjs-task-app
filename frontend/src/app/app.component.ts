import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';  
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
  http = inject(HttpClient)
  getTodos() {
    return this.http.get<{
      userId: number,
      id: number,
      title: string,
      completed: boolean}[]>('https://jsonplaceholder.typicode.com/todos').subscribe((data) => {
      console.log(data);
    });
  }
}
