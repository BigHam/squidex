/*
 * Squidex Headless CMS
 *
 * @license
 * Copyright (c) Squidex UG (haftungsbeschränkt). All rights reserved.
 */

import { Directive, ElementRef, forwardRef, HostListener, Renderer } from '@angular/core';
import { ControlValueAccessor,  NG_VALUE_ACCESSOR } from '@angular/forms';

import { Types } from '@app/framework/internal';

export const SQX_LOWERCASE_INPUT_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => LowerCaseInputDirective), multi: true
};

@Directive({
    selector: '[sqxLowerCaseInput]',
    providers: [SQX_LOWERCASE_INPUT_VALUE_ACCESSOR]
})
export class LowerCaseInputDirective implements ControlValueAccessor {
    private callChange = (v: any) => { /* NOOP */ };
    private callTouched = () => { /* NOOP */ };

    constructor(
        private readonly element: ElementRef,
        private readonly renderer: Renderer
    ) {
    }

    @HostListener('input', ['$event.target.value'])
    public onChange(value: any) {
        const normalizedValue = this.transform(value);

        this.renderer.setElementProperty(this.element.nativeElement, 'value', normalizedValue);
        this.callChange(normalizedValue);
    }

    @HostListener('blur')
    public onTouched() {
        this.callTouched();
    }

    public writeValue(value: string) {
        const normalizedValue = this.transform(value);

        this.renderer.setElementProperty(this.element.nativeElement, 'value', normalizedValue);
    }

    public setDisabledState(isDisabled: boolean): void {
        this.renderer.setElementProperty(this.element.nativeElement, 'disabled', isDisabled);
    }

    public registerOnChange(fn: any) {
        this.callChange = fn;
    }

    public registerOnTouched(fn: any) {
        this.callTouched = fn;
    }

    private transform(value: any): string {
        return Types.isString(value) ? value.toLowerCase() : '';
    }
}