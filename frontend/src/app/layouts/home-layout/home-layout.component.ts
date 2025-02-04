import { Component } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { HomeNavbarComponent } from "../../components/home-navbar/home-navbar.component";

@Component({
  selector: 'app-home-layout',
  imports: [RouterOutlet, HomeNavbarComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss'
})
export class HomeLayoutComponent {

}
