import { Component } from '@angular/core';
import { AppNavbarComponent } from "../../components/app-navbar/app-navbar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-app-layout',
  imports: [RouterOutlet, AppNavbarComponent], 
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {

}
