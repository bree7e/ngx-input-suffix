import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Renderer2,
  SkipSelf,
  Optional,
} from '@angular/core';

import { WINDOW } from 'ngx-window-token';
import { NgxInputSuffixWrapperDirective } from './ngx-input-suffix-wrapper.directive';

/**
 * Suffix directive for input field
 *
 * Usage:
 * ```html
 * <div ngxSuffixWrapper>
 *   <input ngxSuffix=".example.com" />
 * </div>
 * ```
 * TODO
 * [ ] пробелы
 */
@Directive({
  selector: '[ngxSuffix]',
})
export class NgxInputSuffixDirective implements AfterViewInit, OnDestroy {
  /** hidden <div> container to calculate width */
  private _hiddenSuffixElement: HTMLDivElement = null;
  /** rendered suffix, the same as hidden */
  private _suffixElement: HTMLDivElement = null;
  /** host `input` computed CSS styles */
  private _hostStyles: CSSStyleDeclaration;
  /** host `input` field value */
  private _value = '';
  /** suffix */
  @Input() ngxSuffix = '';
  /** change value listener */
  @HostListener('input', ['$event.target.value'])
  changeValueInput(value: string): void {
    if (this.ngxSuffix.length === 0) {
      return null;
    }
    this._value = value;
    this._hostStyles = { ...this._getElementStyles(this._el.nativeElement) };
    this._replaceTextInHiddenSuffix();
    this._setRightPaddingToHost();
    this._moveSuffix();
  }

  constructor(
    /** parent element */
    @SkipSelf() @Optional() private _wrapper: NgxInputSuffixWrapperDirective,
    @Inject(WINDOW) private _window: Window,
    private _el: ElementRef,
    private _renderer: Renderer2
  ) {
    if (!_wrapper) {
      throw new Error(
        '[ngxSuffixWrapper] directive should directly wrap [ngxSuffix] directive'
      );
    }
  }

  ngAfterViewInit(): void {
    this._createHiddenSuffix();
    this._replaceTextInHiddenSuffix();
    this._renderer.setAttribute(this._el.nativeElement, 'autocomplete', 'off');
    this._renderer.setStyle(this._el.nativeElement, 'flexGrow', '1');
  }

  /**
   * Change suffix container position
   */
  private _moveSuffix(): void {
    if (!this._value) {
      this._destroySuffix();
      return null;
    }
    if (this._suffixElement === null) {
      this._createSuffix();
    }
    this._setSuffixPositionStyles();
  }

  /**
   * Append suffix container
   */
  private _createSuffix(): void {
    this._suffixElement = this._renderer.createElement('div') as HTMLDivElement;
    this._renderer.setStyle(this._suffixElement, 'position', 'absolute');
    this._renderer.setStyle(this._suffixElement, 'pointerEvents', 'none');
    this._renderer.setStyle(
      this._suffixElement,
      'color',
      'var(--ngx-suffix__text-color, gray)'
    );
    const suffixText = this._renderer.createText(this.ngxSuffix) as Text;
    this._renderer.appendChild(this._suffixElement, suffixText);
    this._renderer.appendChild(
      this._wrapper._el.nativeElement,
      this._suffixElement
    );
  }

  /**
   * Set CSS styles to suffix element
   */
  private _setSuffixPositionStyles(): void {
    const height = parseFloat(this._hostStyles.height);
    const leftOffset = this._getSuffixOffset();
    this._renderer.setStyle(this._suffixElement, 'lineHeight', `${height}px`);
    this._renderer.setStyle(this._suffixElement, 'left', `${leftOffset}px`);
  }

  /**
   * Get computed hidden container width
   */
  private _getSuffixOffset(): number {
    const borderLeft = parseFloat(this._hostStyles.borderLeftWidth);
    const paddingLeft = parseFloat(this._hostStyles.paddingLeft);
    const width = this._hiddenSuffixElement.offsetWidth;
    const hostWidth = parseFloat(this._hostStyles.width);
    return Math.min(width, hostWidth) + paddingLeft + borderLeft;
  }

  /**
   * Create hidden container
   */
  private _createHiddenSuffix(): void {
    this._hiddenSuffixElement = this._renderer.createElement('div');
    this._renderer.appendChild(
      this._wrapper._el.nativeElement,
      this._hiddenSuffixElement
    );
    this._renderer.setStyle(this._hiddenSuffixElement, 'visibility', 'hidden');
    this._renderer.setStyle(this._hiddenSuffixElement, 'position', 'absolute');
  }

  /**
   * Update text in hidden `div`
   */
  private _replaceTextInHiddenSuffix() {
    while (this._hiddenSuffixElement.firstChild) {
      this._renderer.removeChild(
        this._hiddenSuffixElement,
        this._hiddenSuffixElement.firstChild
      );
    }
    const textNode = this._renderer.createText(this._value) as Text;
    this._renderer.appendChild(this._hiddenSuffixElement, textNode);
  }

  /**
   * Set padding to host elemebt
   */
  private _setRightPaddingToHost(): void {
    if (!this._suffixElement) {
      return null;
    }
    const suffixElementWidth = parseFloat(
      this._getElementStyles(this._suffixElement).width
    );
    const originPaddingRight = parseFloat(this._hostStyles.paddingLeft);
    const paddingRight = suffixElementWidth + originPaddingRight;
    this._renderer.setStyle(
      this._el.nativeElement,
      'paddingRight',
      `${paddingRight}px`
    );
  }

  /**
   * Get element styles
   * @param element - HTML element
   */
  private _getElementStyles(element: HTMLElement): CSSStyleDeclaration {
    return this._window.getComputedStyle(element);
  }

  /**
   * Delete old hidden container
   */
  private _destroyHiddenSuffix(): void {
    if (!this._hiddenSuffixElement) {
      return null;
    }
    this._renderer.removeChild(
      this._wrapper._el.nativeElement,
      this._hiddenSuffixElement
    );
    this._hiddenSuffixElement = null;
  }

  /**
   * Delete old hidden container
   */
  private _destroySuffix(): void {
    if (!this._suffixElement) {
      return null;
    }
    this._renderer.removeChild(
      this._wrapper._el.nativeElement,
      this._suffixElement
    );
    this._suffixElement = null;
  }

  ngOnDestroy(): void {
    this._destroyHiddenSuffix();
    this._destroySuffix();
  }
}