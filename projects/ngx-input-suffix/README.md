# ngx-input-suffix

Angular directive that render helper text to the right of input text

## Demo

![ngx-input-suffix demo](https://raw.githubusercontent.com/bree7e/ngx-input-suffix/master/assets/ngx-input-suffix-demo.gif)

[Demo application](https://bree7e.github.io/ngx-input-suffix/)

## Installation

To install this library, run:

```bash
$ npm install ngx-input-suffix ngx-window-token --save
```

and then import module:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

import { NgxSuffixModule } from 'ngx-input-suffix'; // <=== 

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxSuffixModule // <===
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

## Usage
`ngxSuffix` should place inside `ngxSuffixWrapper`
```html
<div ngxSuffixWrapper>
  <input ngxSuffix=".example.com"/>
</div>
```

Support initial value
```html
<div ngxSuffixWrapper>
  <input ngxSuffix=".example.com" value="domain" />
</div>
<div ngxSuffixWrapper>
  <input ngxSuffix=".angular.com" [(ngModel)]="domain" />
</div>
```

## Customization
There is `--ngx-input-suffix__text-color` css variable to set suffix color. Default color is grey.
```css
.wrapper {
  --ngx-input-suffix__text-color: black;
}
```
