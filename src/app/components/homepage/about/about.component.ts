import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild } from '@angular/core';

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

  constructor(private cdr: ChangeDetectorRef) {}

  ngAfterViewInit() {
    const el = this.textContainer.nativeElement;
    this.isOverflowing = el.scrollHeight > el.clientHeight;

    this.cdr.detectChanges();
  }
}
