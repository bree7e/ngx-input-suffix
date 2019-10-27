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
 */
@Directive({
  selector: '[ngxSuffix]',
})
export class NgxInputSuffixDirective implements AfterViewInit, OnDestroy {
  /** current hidden container to calculate width */
  private _hiddenContainer: HTMLDivElement;
  /** suffix container */
  private _suffixElement: HTMLDivElement;
  /** host input computed CSS styles */
  private _hostStyles: CSSStyleDeclaration;
  /** input field value */
  private _inputValue = '';
  /** suffix */
  @Input() ngxSuffix: string;
  /** change value listener */
  @HostListener('input', ['$event.target.value'])
  changeValueInput(value: string): void {
    if (this.ngxSuffix.length === 0) {
      return null;
    }
    this._inputValue = value;
    this._createHiddenContainer();
    this._createSuffixContainer();
    this._setInputStyles();
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
    if (this.ngxSuffix.length === 0) {
      return null;
    }
    // @TODO issue
    this._renderer.setAttribute(this._el.nativeElement, 'autocomplete', 'off');
    this._hostStyles = this._getElementStyles(this._el.nativeElement);
  }

  /**
   * Create suffix container
   */
  private _createSuffixContainer(): void {
    this._destroySuffixContainer();
    if (this._inputValue.length) {
      this._appendSuffixContainer();
      this._setSuffixContainerStyleList();
    }
  }

  /**
   * Append suffix container
   */
  private _appendSuffixContainer(): void {
    this._suffixElement = this._renderer.createElement('div') as HTMLDivElement;
    const suffixText = this._renderer.createText(this.ngxSuffix) as Text;
    this._renderer.appendChild(this._suffixElement, suffixText);
    this._renderer.appendChild(
      this._wrapper._el.nativeElement,
      this._suffixElement
    );
  }

  /**
   * Set suffix container styles
   */
  private _setSuffixContainerStyleList(): void {
    const heightSuffixContainer = parseFloat(this._hostStyles.height);
    const currentWidth = this._getHiddenContainerWidth();
    this._setSuffixContainerStyle('position', 'absolute');
    this._setSuffixContainerStyle('pointer-events', 'none');
    this._setSuffixContainerStyle(
      'color',
      'var(--ngx-suffix__text-color, gray)'
    );
    this._setSuffixContainerStyle('line-height', `${heightSuffixContainer}px`);
    this._setSuffixContainerStyle('left', `${currentWidth}px`);
  }

  /**
   * Get computed hidden container width
   */
  private _getHiddenContainerWidth(): number {
    const maxInputPaddingLeft = this._computedMaxInputPaddingLeft();
    const inputPaddingLeft = parseFloat(this._hostStyles.paddingLeft);
    const inputBorderLeftWidth = parseFloat(this._hostStyles.borderLeftWidth);
    const containerWidth = this._hiddenContainer.offsetWidth;
    const containerPaddingRight =
      containerWidth + inputPaddingLeft + inputBorderLeftWidth;
    return containerPaddingRight > maxInputPaddingLeft
      ? maxInputPaddingLeft
      : containerPaddingRight;
  }

  /**
   * Computed max input padding left
   */
  private _computedMaxInputPaddingLeft(): number {
    const inputStyles = this._hostStyles;
    const inputWidth = parseFloat(inputStyles.width);
    const inputBorderLeft = parseFloat(inputStyles.borderLeft);
    const inputPaddingLeft = parseFloat(inputStyles.paddingLeft);
    return inputWidth - inputPaddingLeft - inputBorderLeft;
  }

  /**
   * Create hidden container
   */
  private _createHiddenContainer(): void {
    this._destroyHiddenContainer();
    this._appendHiddenContainer();
    this._setHiddenContainerStyles();
  }

  /**
   * Append hidden container to host element
   */
  private _appendHiddenContainer(): void {
    this._hiddenContainer = this._renderer.createElement('div');
    const textNode = this._renderer.createText(this._inputValue) as Text;
    this._renderer.appendChild(this._hiddenContainer, textNode);
    this._renderer.appendChild(
      this._wrapper._el.nativeElement,
      this._hiddenContainer
    );
  }

  /**
   * Set suffix container styles
   */
  private _setHiddenContainerStyles(): void {
    this._setHiddenContainerStyle('visibility', 'hidden');
    this._setHiddenContainerStyle('position', 'absolute');
  }

  /**
   * Set hidden container style
   * @param property - css property
   * @param value - new property value
   */
  private _setHiddenContainerStyle(property: string, value: string): void {
    this._renderer.setStyle(this._hiddenContainer, property, value);
  }

  /**
   * Set suffix container style
   * @param property - css property
   * @param value - new property value
   */
  private _setSuffixContainerStyle(property: string, value: string): void {
    this._renderer.setStyle(this._suffixElement, property, value);
  }

  /**
   * Set input styles
   */
  private _setInputStyles(): void {
    const suffixContainerWidth = parseFloat(
      this._getElementStyles(this._suffixElement).width
    );
    const inputPaddingLeft = parseFloat(this._hostStyles.paddingLeft);
    const inputPaddingRight = suffixContainerWidth + inputPaddingLeft;
    this._renderer.setStyle(
      this._el.nativeElement,
      'paddingRight',
      `${inputPaddingRight}px`
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
  private _destroyHiddenContainer(): void {
    if (!this._hiddenContainer) {
      return null;
    }
    this._renderer.removeChild(
      this._wrapper._el.nativeElement,
      this._hiddenContainer
    );
    this._hiddenContainer = null;
  }

  /**
   * Delete old hidden container
   */
  private _destroySuffixContainer(): void {
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
    this._destroyHiddenContainer();
    this._destroySuffixContainer();
  }
}
