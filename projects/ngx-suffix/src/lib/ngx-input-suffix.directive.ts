import {
  Directive,
  ElementRef,
  Inject,
  Input,
  OnDestroy,
  Renderer2,
  SkipSelf,
  Optional,
  OnInit,
  Self,
} from '@angular/core';

import { WINDOW } from 'ngx-window-token';
import { NgControl } from '@angular/forms';
import { takeUntil, filter, pluck, tap } from 'rxjs/operators';

import { NgxInputSuffixWrapperDirective } from './ngx-input-suffix-wrapper.directive';
import { fromEvent, Subject, concat, of } from 'rxjs';

/**
 * Suffix directive for input field
 *
 * Usage:
 * ```html
 * <div ngxSuffixWrapper>
 *   <input ngxSuffix=".example.com" />
 * </div>
 * ```
 */
@Directive({
  selector: '[ngxSuffix]',
})
export class NgxInputSuffixDirective implements OnInit, OnDestroy {
  /** hidden <div> container to calculate width */
  private _hiddenSuffixElement: HTMLDivElement = null;
  /** rendered suffix, the same as hidden */
  private _suffixElement: HTMLDivElement = null;
  /** host `input` computed CSS styles */
  private _hostStyles: CSSStyleDeclaration;
  /** host `input` field value */
  private _value = '';
  /** destroy subject (pattern) */
  private _destroy$ = new Subject<void>();
  /** suffix */
  @Input() ngxSuffix = '';

  constructor(
    /** parent element */
    @SkipSelf()
    @Optional()
    private readonly _wrapper: NgxInputSuffixWrapperDirective,
    @Self()
    @Optional()
    private readonly _ngControl: NgControl,
    @Inject(WINDOW) private readonly _window: Window,
    private readonly _el: ElementRef,
    private readonly _renderer: Renderer2
  ) {
    if (!_wrapper) {
      throw new Error(
        '[ngxSuffixWrapper] directive should directly wrap [ngxSuffix] directive'
      );
    }
  }

  ngOnInit(): void {
    this._createHiddenSuffix();
    this._renderer.setAttribute(this._el.nativeElement, 'autocomplete', 'off');
    this._renderer.setStyle(this._el.nativeElement, 'flexGrow', '1');
    this._ngControl ? this._subscribeToNgControl() : this._subscribeToNative();
  }

  /**
   * Subsribe to native value changes
   */
  private _subscribeToNative(): void {
    concat(
      of((this._el.nativeElement as HTMLInputElement).value || ''), // initial value
      fromEvent(this._el.nativeElement, 'input').pipe(pluck('target', 'value'))
    )
      .pipe(
        filter(() => this.ngxSuffix.length !== 0),
        tap((value: string) => (this._value = value)),
        takeUntil(this._destroy$)
      )
      .subscribe({ next: () => this._render() });
  }

  /**
   * Subsribe to NgControl value changes
   */
  private _subscribeToNgControl(): void {
    this._ngControl.valueChanges
      .pipe(
        filter(() => this.ngxSuffix.length !== 0),
        tap((value: string) => (this._value = value)),
        takeUntil(this._destroy$)
      )
      .subscribe({ next: () => this._render() });
  }

  /**
   * Render suffix
   */
  private _render() {
    this._hostStyles = { ...this._getElementStyles(this._el.nativeElement) };
    this._replaceTextInHiddenSuffix();
    this._setRightPaddingToHost();
    this._setSuffix();
  }

  /**
   * Create and/or change suffix container position
   */
  private _setSuffix(): void {
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
    const height = parseFloat(this._hostStyles.height);
    this._renderer.setStyle(this._suffixElement, 'lineHeight', `${height}px`);
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
    const leftOffset = this._getSuffixOffset();
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
    this._renderer.setStyle(this._hiddenSuffixElement, 'white-space', 'pre');
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
    this._destroy$.next();
    this._destroy$.complete();
  }
}
