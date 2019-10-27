import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// import { NgxSuffixModule } from 'ngx-suffix';
import { NgxSuffixModule } from 'projects/ngx-suffix/src/public-api';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgxSuffixModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
