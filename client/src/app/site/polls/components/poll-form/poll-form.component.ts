import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
    PollTypeVerbose,
    PercentBaseVerbose,
    MajorityMethodVerbose,
    ViewBasePoll
} from 'app/site/polls/models/view-base-poll';
import { Observable } from 'rxjs';
import { ViewGroup } from 'app/site/users/models/view-group';
import { GroupRepositoryService } from 'app/core/repositories/users/group-repository.service';
import { BaseViewComponent } from 'app/site/base/base-view';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { PercentBase } from 'app/shared/models/poll/base-poll';
import { PollService } from '../../services/poll.service';

@Component({
    selector: 'os-poll-form',
    templateUrl: './poll-form.component.html',
    styleUrls: ['./poll-form.component.scss']
})
export class PollFormComponent extends BaseViewComponent implements OnInit {
    /**
     * The form-group for the meta-info.
     */
    public contentForm: FormGroup;

    /**
     * The different methods for this poll.
     */
    @Input()
    public pollMethods: { [key: string]: string };

    @Input()
    public data: Partial<ViewBasePoll>;

    /**
     * The different types the poll can accept.
     */
    public pollTypes = PollTypeVerbose;

    /**
     * The percent base for the poll.
     */
    public percentBases = PercentBaseVerbose;

    /**
     * The majority methods for the poll.
     */
    public majorityMethods = MajorityMethodVerbose;

    /**
     * Reference to the observable of the groups. Used by the `search-value-component`.
     */
    public groupObservable: Observable<ViewGroup[]> = null;

    /**
     * An twodimensional array to handle constant values for this poll.
     */
    public pollValues: [string, unknown][] = [];

    /**
     * Model for the checkbox.
     * If true, the given poll will immediately be published.
     */
    public publishImmediately = true;

    /**
     * Constructor. Retrieves necessary metadata from the pollService,
     * injects the poll itself
     */
    public constructor(
        title: Title,
        protected translate: TranslateService,
        snackbar: MatSnackBar,
        private fb: FormBuilder,
        private groupRepo: GroupRepositoryService,
        private pollService: PollService
    ) {
        super(title, translate, snackbar);

        this.contentForm = this.fb.group({
            title: ['', Validators.required],
            type: ['', Validators.required],
            pollmethod: ['', Validators.required],
            onehundred_percent_base: ['', Validators.required],
            majority_method: ['', Validators.required],
            groups_id: [[]]
        });
    }

    /**
     * OnInit.
     * Sets the observable for groups.
     */
    public ngOnInit(): void {
        this.groupObservable = this.groupRepo.getViewModelListObservable();
        
        Object.keys(this.contentForm.controls).forEach(key => <any>console.log(key, this.data[key]) || this.contentForm.get(key).setValue(this.data[key]));
        this.updatePollValues(this.contentForm.value);

        this.subscriptions.push(
            this.contentForm.valueChanges.subscribe(values => {
                this.updatePollValues(values);
            })
        );
    }

    public getValues<V extends ViewBasePoll>(): Partial<V> {
        return { ...this.data, ...this.contentForm.value };
    }

    public isValidPercentBaseWithMethod(base: PercentBase): boolean {
        return !(base === PercentBase.YNA && this.contentForm.get('pollmethod').value === 'YN');
    }

    /**
     * This updates the poll-values to get correct data in the view.
     *
     * @param data Passing the properties of the poll.
     */
    private updatePollValues(data: { [key: string]: any }): void {
        this.pollValues = Object.entries(data)
            .filter(([key, _]) => key === 'type' || key === 'pollmethod')
            .map(([key, value]) => [
                this.pollService.getVerboseNameForKey(key),
                this.pollService.getVerboseNameForValue(key, value as string)
            ]);
        if (data.type === 'named') {
            this.pollValues.push([
                this.pollService.getVerboseNameForKey('groups'),
                this.groupRepo.getNameForIds(...data.groups_id)
            ]);
        }
    }
}
