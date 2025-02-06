import { Component } from '@angular/core';
import { AppNavbarComponent } from "../../components/app-navbar/app-navbar.component"; 

@Component({
  selector: 'app-app-layout',
  imports: [  AppNavbarComponent], 
  templateUrl: './app-layout.component.html',
  styleUrl: './app-layout.component.scss'
})
export class AppLayoutComponent {

}
