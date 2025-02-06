import { Component } from '@angular/core';
import { BubblesBackgroundComponent } from "../../components/bubbles-background/bubbles-background.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [BubblesBackgroundComponent,RouterOutlet], 
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {

}
