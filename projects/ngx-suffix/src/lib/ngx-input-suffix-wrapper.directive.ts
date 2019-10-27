import { Directive, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

/**
 * Suffix wrapper directive
 *
 * Usage:
 * ```html
 * <div ngxSuffixWrapper>
 *   <input ngxSuffix=".example.com" />
 * </div>
 * ```
 */
@Directive({
  selector: '[ngxSuffixWrapper]',
})
export class NgxInputSuffixWrapperDirective implements AfterViewInit {
  constructor(public _el: ElementRef, private _renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this._renderer.setStyle(this._el.nativeElement, 'position', 'relative');
    this._renderer.setStyle(this._el.nativeElement, 'display', 'flex');
    this._renderer.setStyle(this._el.nativeElement, 'alignItems', 'center');
    this._renderer.setStyle(this._el.nativeElement, 'flexGrow', '1');
  }
}
