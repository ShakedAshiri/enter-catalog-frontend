import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list'

@Component({
  selector: 'app-banner',
  imports: [MatGridListModule],
  templateUrl: './banner.component.html',
  styleUrl: './banner.component.scss'
})
export class BannerComponent {
  scrollToAbout() {
    const element = document.getElementById('about-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
