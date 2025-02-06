import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SideLinesComponent } from '../../components/side-lines/side-lines.component';

@Component({
  selector: 'app-privacy',
  imports: [RouterLink, SideLinesComponent],
  templateUrl: './privacy.component.html',
  styleUrl: './privacy.component.scss'
})
export class PrivacyComponent {

}
