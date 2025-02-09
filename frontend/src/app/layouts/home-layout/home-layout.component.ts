import { Component } from '@angular/core';
import {  RouterOutlet } from '@angular/router';
import { HomeNavbarComponent } from "../../components/home-navbar/home-navbar.component";
import { CookiesComponent } from "../../components/cookies/cookies.component";

@Component({
  selector: 'app-home-layout',
  imports: [RouterOutlet, HomeNavbarComponent, CookiesComponent],
  templateUrl: './home-layout.component.html',
  styleUrl: './home-layout.component.scss'
})
export class HomeLayoutComponent {

}
