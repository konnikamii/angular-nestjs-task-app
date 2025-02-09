import { Component } from '@angular/core';
import { SideLinesComponent } from '../../components/side-lines/side-lines.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tos',
  imports: [RouterLink, SideLinesComponent],
  templateUrl: './tos.component.html',
  styleUrl: './tos.component.scss',
})
export class TosComponent {}
