import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent implements AfterViewInit {
  @ViewChild('aboutDesc') textContainer!: ElementRef;
  isOverflowing = false;
  readMore = false;

  ngAfterViewInit() {
    const el = this.textContainer.nativeElement;
    console.log(el.scrollHeight)
    console.log(el.clientHeight)
    this.isOverflowing = el.scrollHeight > el.clientHeight;
  }


}
