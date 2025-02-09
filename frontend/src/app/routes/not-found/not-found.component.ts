import { Component } from '@angular/core';
import { SideLinesComponent } from '../../components/side-lines/side-lines.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [SideLinesComponent, RouterLink],
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {}
