import { NgModule } from '@angular/core';
import { NgxInputSuffixDirective } from './ngx-input-suffix.directive';
import { NgxInputSuffixWrapperDirective } from './ngx-input-suffix-wrapper.directive';

@NgModule({
  declarations: [NgxInputSuffixDirective, NgxInputSuffixWrapperDirective],
  exports: [NgxInputSuffixDirective, NgxInputSuffixWrapperDirective]
})
export class NgxSuffixModule { }
