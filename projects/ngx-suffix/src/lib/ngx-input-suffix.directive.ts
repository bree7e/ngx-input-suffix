import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  Inject,
  Input,
  OnDestroy,
  Renderer2,
} from '@angular/core';

import { WINDOW } from 'ngx-window-token';

/**
 * Suffix directive for input field
 */
@Directive({
  selector: '[ngxSuffix]',
})
export class NgxInputSuffixDirective implements AfterViewInit, OnDestroy {
  /** current hidden container to calculate width */
  private _hiddenContainer: HTMLDivElement;
  /** suffix container */
  private _suffixElement: HTMLDivElement;
  /** input computed css styles */
  private _inputStyles: CSSStyleDeclaration;
  /** input field value */
  private _inputValue = '';
  /** suffix */
  @Input()
  private ngxSuffix: string;
  /** parent element */
  @Input()
  private ngxSuffixWrapper: ElementRef;
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
    @Inject(WINDOW) private _window: Window,
    private _elementRef: ElementRef,
    private _renderer: Renderer2
  ) {}

  ngAfterViewInit(): void {
    if (this.ngxSuffix.length === 0) {
      return null;
    }
    this._renderer.setAttribute(
      this._elementRef.nativeElement,
      'autocomplete',
      'off'
    );
    this._inputStyles = this._getElementStyles(this._elementRef.nativeElement);
    this._renderer.setStyle(this.ngxSuffixWrapper, 'position', 'relative');
    this._renderer.setStyle(this.ngxSuffixWrapper, 'display', 'flex');
    this._renderer.setStyle(this.ngxSuffixWrapper, 'alignItems', 'center');
    this._renderer.setStyle(this.ngxSuffixWrapper, 'flexGrow', '1');
  }

  /**
   * Create suffix container
   */
  private _createSuffixContainer(): void {
    this._destroyOldSuffixContainer();
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
    this._renderer.appendChild(this.ngxSuffixWrapper, this._suffixElement);
  }

  /**
   * Set suffix container styles
   */
  private _setSuffixContainerStyleList(): void {
    const heightSuffixContainer = parseFloat(this._inputStyles.height);
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
    const inputPaddingLeft = parseFloat(this._inputStyles.paddingLeft);
    const inputBorderLeftWidth = parseFloat(this._inputStyles.borderLeftWidth);
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
    const inputStyles = this._inputStyles;
    const inputWidth = parseFloat(inputStyles.width);
    const inputBorderLeft = parseFloat(inputStyles.borderLeft);
    const inputPaddingLeft = parseFloat(inputStyles.paddingLeft);
    return inputWidth - inputPaddingLeft - inputBorderLeft;
  }

  /**
   * Create hidden container
   */
  private _createHiddenContainer(): void {
    this._destroyOldHiddenContainer();
    this._appendHiddenContainer();
    this._setHiddenContainerStyles();
  }

  /**
   * Append hidden container
   */
  private _appendHiddenContainer(): void {
    this._hiddenContainer = this._renderer.createElement('div');
    const inputValueTextNode = this._renderer.createText(this._inputValue);
    this._renderer.appendChild(
      this._hiddenContainer,
      inputValueTextNode
    );
    this._renderer.appendChild(
      this.ngxSuffixWrapper,
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
   * Delete old hidden container
   */
  private _destroyOldHiddenContainer(): void {
    if (!this._hiddenContainer) {
      return null;
    }
    this._renderer.removeChild(
      this.ngxSuffixWrapper,
      this._hiddenContainer
    );
  }

  /**
   * Delete old hidden container
   */
  private _destroyOldSuffixContainer(): void {
    if (!this._suffixElement) {
      return null;
    }
    this._renderer.removeChild(this.ngxSuffixWrapper, this._suffixElement);
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
    const inputPaddingLeft = parseFloat(this._inputStyles.paddingLeft);
    const inputPaddingRight = suffixContainerWidth + inputPaddingLeft;
    this._renderer.setStyle(
      this._elementRef.nativeElement,
      'padding-right',
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

  ngOnDestroy(): void {
    if (this._suffixElement && this._hiddenContainer) {
      this._destroyOldHiddenContainer();
      this._destroyOldSuffixContainer();
    }
  }
}
