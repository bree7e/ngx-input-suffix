import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// import { NgxInputSuffixModule } from 'ngx-input-suffix';
import { NgxInputSuffixModule } from 'projects/ngx-input-suffix/src/public-api';
import { HighlightPlusModule } from 'ngx-highlightjs/plus';

import { AppComponent } from './app.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HighlightPlusModule ,
    NgxInputSuffixModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
