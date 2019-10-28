# ngx-input-suffix

## Demo

![ngx-input-suffix demo](https://raw.githubusercontent.com/bree7e/ngx-input-suffix/master/assets/ngx-input-suffix-demo.gif)

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

There is `--ngx-input-suffix__text-color` css vaiable to set suffix color. Default color is grey.
```css
.wrapper {
  --ngx-input-suffix__text-color: black;
}
```