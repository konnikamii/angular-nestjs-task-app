import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SideLinesComponent } from '../../components/side-lines/side-lines.component';

@Component({
  selector: 'app-home',
  imports: [RouterLink, SideLinesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
