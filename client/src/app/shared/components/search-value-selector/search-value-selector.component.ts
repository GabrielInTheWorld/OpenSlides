import { FocusMonitor } from '@angular/cdk/a11y';
import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    Input,
    Optional,
    Self
} from '@angular/core';
import { FormBuilder, FormControl, NgControl } from '@angular/forms';
import { MatFormFieldControl } from '@angular/material';

import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { auditTime } from 'rxjs/operators';

import { BaseFormControlComponent } from 'app/shared/models/base/base-form-control';
import { Selectable } from '../selectable';

/**
 * Searchable Value Selector
 *
 * Use `multiple="true"`, `[inputListValues]=myValues`,`formControlName="myformcontrol"` and `placeholder={{listname}}` to pass the Values and Listname
 *
 * ## Examples:
 *
 * ### Usage of the selector:
 *
 * ```html
 * <os-search-value-selector
 *   [multiple]="true"
 *   placeholder="Placeholder"
 *   [inputListValues]="myListValues"
 *   formControlName="myformcontrol">
 * </os-search-value-selector>
 * ```
 *
 */

@Component({
    selector: 'os-search-value-selector',
    templateUrl: './search-value-selector.component.html',
    styleUrls: ['./search-value-selector.component.scss'],
    providers: [{ provide: MatFormFieldControl, useExisting: SearchValueSelectorComponent }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchValueSelectorComponent extends BaseFormControlComponent<Selectable[]> {
    /**
     * Decide if this should be a single or multi-select-field
     */
    @Input()
    public multiple = false;

    /**
     * Decide, if none should be included, if multiple is false.
     */
    @Input()
    public includeNone = false;

    @Input()
    public noneTitle = '–';

    /**
     * Boolean, whether the component should be rendered with full width.
     */
    @Input()
    public fullWidth = false;

    /**
     * The inputlist subject. Subscribes to it and updates the selector, if the subject
     * changes its values.
     */
    @Input()
    public set inputListValues(value: Observable<Selectable[]>) {
        if (!value) {
            return;
        }
        this.subscriptions.push(
            value.pipe(auditTime(10)).subscribe(items => {
                this.selectableItems = items;
                if (this.contentForm) {
                    this.disabled = !items || (!!items && !items.length);
                }
            })
        );
    }

    public searchValue: FormControl;

    public get empty(): boolean {
        return Array.isArray(this.contentForm.value) ? !this.contentForm.value.length : !this.contentForm.value;
    }

    public controlType = 'search-value-selector';

    /**
     * All items
     */
    private selectableItems: Selectable[];

    /**
     * Empty constructor
     */
    public constructor(
        protected translate: TranslateService,
        cd: ChangeDetectorRef,
        fb: FormBuilder,
        @Optional() @Self() public ngControl: NgControl,
        fm: FocusMonitor,
        element: ElementRef<HTMLElement>
    ) {
        super(fb, fm, element, ngControl);
    }

    /**
     * Function to get a list filtered by the entered search value.
     *
     * @returns The filtered list of items.
     */
    public getFilteredItems(): Selectable[] {
        if (this.selectableItems) {
            const searchValue: string = this.searchValue.value.toLowerCase();
            return this.selectableItems.filter(item => {
                const idString = '' + item.id;
                const foundId =
                    idString
                        .trim()
                        .toLowerCase()
                        .indexOf(searchValue) !== -1;

                if (foundId) {
                    return true;
                }

                return (
                    item
                        .toString()
                        .toLowerCase()
                        .indexOf(searchValue) > -1
                );
            });
        }
    }

    public onContainerClick(event: MouseEvent): void {
        if ((event.target as Element).tagName.toLowerCase() !== 'select') {
            // this.element.nativeElement.querySelector('select').focus();
        }
    }

    protected initializeForm(): void {
        this.contentForm = this.fb.control([]);
        this.searchValue = this.fb.control('');
    }

    protected updateForm(value: Selectable[] | null): void {
        const nextValue = value;
        this.contentForm.setValue(nextValue);
    }
}
