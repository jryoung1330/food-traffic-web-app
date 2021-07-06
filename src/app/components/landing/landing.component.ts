import { Component, OnInit } from '@angular/core';
import { slideInDownOnEnterAnimation } from 'angular-animations';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  animations: [slideInDownOnEnterAnimation({delay: 0, duration: 1000})]
})
export class LandingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
