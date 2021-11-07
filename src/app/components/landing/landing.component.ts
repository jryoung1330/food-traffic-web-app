import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { slideInDownOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  animations: [slideInDownOnEnterAnimation({delay: 0, duration: 1000})]
})
export class LandingComponent implements OnInit {

  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) { }

  ngOnInit(): void {
  }

  customerLogin() {
    this.auth.loginWithRedirect({
      appState: { target: '/home' }
    });
  }

  vendorLogin() {
    this.auth.loginWithRedirect({
      appState: { target: '/vendors/home' }
    });
  }

}
