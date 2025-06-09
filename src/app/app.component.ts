import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, MatIconModule],

  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private authService: AuthService,
  ) {
    this.matIconRegistry.addSvgIcon(
      'edit-pencil',
      this.domSanitizer.bypassSecurityTrustResourceUrl('edit-pencil.svg'),
    );
  }

  title = 'enter-catalog-frontend';

  ngOnInit(): void {
    // Initialize Google Auth
    this.authService.initializeGoogleAuth();
  }
}
