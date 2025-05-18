import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-top-rectangle',
  imports: [MatGridListModule],
  templateUrl: './top-rectangle.component.html',
  styleUrl: './top-rectangle.component.scss',
})
export class TopRectangleComponent {
  scrollToAbout() {
    const element = document.getElementById('about-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
