import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Suffix Demo App';
  show = true;
  domain = 'admin';
  block1 = `
  <div ngxSuffixWrapper *ngIf="show">
    <input ngxSuffix=".example.com" value="domain" />
  </div>
  `;
  block2 = `
  <div ngxSuffixWrapper *ngIf="show">
    <input ngxSuffix=".angular.com" [(ngModel)]="domain" />
  </div>
  `;
}
