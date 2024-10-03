import { Directive, ElementRef, HostListener, Renderer2, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, DefaultValueAccessor } from '@angular/forms';

const UPPERCASE_INPUT_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => UpperCaseInputDirective),
  multi: true,
};

@Directive({
  selector: '[appUppercase]',
  host: {
    '(input)': 'onInput($event.target.value)',
    '(blur)': 'onBlur($event.target.value)',
  },
  providers: [
    UPPERCASE_INPUT_CONTROL_VALUE_ACCESSOR,
  ],
  standalone: true
})
export class UpperCaseInputDirective extends DefaultValueAccessor {

  constructor(renderer: Renderer2, elementRef: ElementRef) {
    super(renderer, elementRef, false);
  }

  override writeValue(value: any): void {
    const transformed = this.transformValue(value);

    super.writeValue(transformed);
  }

  onInput(value: any): void {
    const transformed = this.transformValue(value);

    super.writeValue(transformed);
    this.onChange(transformed);
  }

  onBlur(value: any): void{
    let transformed = this.transformValue(value);
    transformed = (transformed && typeof transformed === 'string') ? transformed.trim() : transformed;
    super.writeValue(transformed);
    this.onChange(transformed);
  }

  private transformValue(value: any): any {
    const result = value && typeof value === 'string'
      ? value.toUpperCase()
      : value;

    return result;
  }

}
