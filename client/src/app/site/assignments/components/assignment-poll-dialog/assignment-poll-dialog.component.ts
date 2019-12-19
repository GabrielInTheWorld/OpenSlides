import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { CalculablePollKey, PollVoteValue } from 'app/site/polls/services/poll.service';
import { ViewAssignmentOption } from '../../models/view-assignment-option';
import { ViewAssignmentPoll } from '../../models/view-assignment-poll';
import { AssignmentPollMethods } from 'app/shared/models/assignments/assignment-poll';
import { PollDialogComponent } from 'app/site/polls/components/poll-dialog/poll-dialog.component';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { ViewUser } from 'app/site/users/models/view-user';
import { VoteValue, VoteValueVerbose } from 'app/shared/models/poll/base-vote';
import { AssignmentPollMethodsVerbose } from 'app/site/assignments/models/view-assignment-poll';
import { PollFormComponent } from 'app/site/polls/components/poll-form/poll-form.component';

type OptionsObject = { id: number, user: ViewUser }[];

/**
 * A dialog for updating the values of an assignment-related poll.
 */
@Component({
    selector: 'os-assignment-poll-dialog',
    templateUrl: './assignment-poll-dialog.component.html',
    styleUrls: ['./assignment-poll-dialog.component.scss']
})
export class AssignmentPollDialogComponent extends PollDialogComponent implements OnInit {
    /**
     * The summary values that will have fields in the dialog
     */
    public get sumValues() {
        const generalValues = ['votesvalid', 'votesinvalid', 'votescast'];
        if (this.pollData.pollmethod === 'votes') {
            return ['votesno', 'votesabstain', ...generalValues];
        } else {
            return generalValues;
        }
    }

    /**
     * List of accepted special non-numerical values.
     * See {@link PollService.specialPollVotes}
     */
    public specialValues: [number, string][];

    @ViewChild('pollForm', { static: true })
    protected pollForm: PollFormComponent;

    /**
     * vote entries for each option in this component. Is empty if method
     * requires one vote per candidate
     */
    public analogPollValues: VoteValue[];

    public voteValueVerbose = VoteValueVerbose;

    public assignmentPollMethods = AssignmentPollMethodsVerbose;

    public options: OptionsObject;

    /**
     * Constructor. Retrieves necessary metadata from the pollService,
     * injects the poll itself
     */
    public constructor(
        private fb: FormBuilder,
        title: Title,
        protected translate: TranslateService,
        matSnackbar: MatSnackBar,
        public dialogRef: MatDialogRef<PollDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public pollData: Partial<ViewAssignmentPoll>
    ) {
        super(title, translate, matSnackbar, dialogRef);

        this.options = pollData.options ? pollData.options : pollData.assignment.candidates.map(user => ({
            id: user.id,
            user: user
        }), {});
    }

    public ngOnInit(): void {
        this.setAnalogPollValues();
        this.createDialog();

        this.subscriptions.push(
            this.pollForm.contentForm.get("pollmethod").valueChanges.subscribe(() => {
                this.setAnalogPollValues();
                this.createDialog();
            })
        );
    }

    public getVoteData(): object {
        const empty = Object.values(this.dialogVoteForm.value).every(value => !value);
        console.log(this.dialogVoteForm.value, empty);
        if (empty) {
            return undefined;
        }
        const result = {}, value = this.dialogVoteForm.value;
        for (const key of Object.keys(value)) {
            if (typeof value[key] === "object") {
                result[key] = 
            }
            result[key] = !!value[key] ? value[key] : -2;
        }
        return { options: result };
    }

    private replaceEmptyValues(object: object): void {
        const result = {};
        for (const key of Object.keys(object)) {
            if (typeof object[key] === "object") {
                result[key] = this.replaceEmptyValues
            }
            result[key] = !!object[key] ? object[key] : -2;
        }

    }

    private setAnalogPollValues(): void {
        const pollmethod = this.pollForm.contentForm.get('pollmethod').value;
        this.analogPollValues = ['Y'];
        if (pollmethod !== AssignmentPollMethods.Votes) {
            this.analogPollValues.push('N');
        }
        if (pollmethod === AssignmentPollMethods.YNA) {
            this.analogPollValues.push('A');
        }
    }

    /**
     * Pre-executed method to initialize the dialog-form depending on the poll-method.
     */
    private createDialog(): void {
        this.dialogVoteForm = this.fb.group({
            options: this.fb.group(
                this.options.reduce((aggr, option) => {
                    aggr[option.id] = this.fb.group(
                        this.analogPollValues.reduce((aggr, value) => {
                            aggr[value] = ['', [Validators.min(-2)]];
                            return aggr;
                        }, {})
                    );
                    return aggr;
                }, {})
            ),
            votesvalid: ['', [Validators.min(-2)]],
            votesinvalid: ['', [Validators.min(-2)]],
            votescast: ['', [Validators.min(-2)]]
        });
        console.log(this.dialogVoteForm.controls);
        // if (this.pollData.poll) {
        //     this.updateDialogVoteForm(this.pollData);
        // }
    }

    /**
     * Validates candidates input (every candidate has their options filled in),
     * submits and closes the dialog if successful, else displays an error popup.
     * TODO better validation
     */
    public submit(): void {
        /*const error = this.data.options.find(dataoption => {
            this.optionPollKeys.some(key => {
                const keyValue = dataoption.votes.find(o => o.value === key);
                return !keyValue || keyValue.weight === undefined;
            });
        });
        if (error) {
            this.matSnackBar.open(
                this.translate.instant('Please fill in the values for each candidate'),
                this.translate.instant('OK'),
                {
                    duration: 1000
                }
            );
        } else {
            this.dialogRef.close(this.data);
        }*/
    }

    /**
     * TODO: currently unused
     *
     * @param key poll option to be labeled
     * @returns a label for a poll option
     */
    public getLabel(key: CalculablePollKey): string {
        // return this.pollService.getLabel(key);
        throw new Error('TODO');
    }

    /**
     * Updates a vote value
     *
     * @param value the value to update
     * @param candidate the candidate for whom to update the value
     * @param newData the new value
     */
    public setValue(value: PollVoteValue, candidate: ViewAssignmentOption, newData: string): void {
        /*const vote = candidate.votes.find(v => v.value === value);
        if (vote) {
            vote.weight = parseFloat(newData);
        } else {
            candidate.votes.push({
                value: value,
                weight: parseFloat(newData)
            });
        }*/
    }

    /**
     * Retrieves the current value for a voting option
     *
     * @param value the vote value (e.g. 'Abstain')
     * @param candidate the pollOption
     * @returns the currently entered number or undefined if no number has been set
     */
    public getValue(value: PollVoteValue, candidate: ViewAssignmentOption): number | undefined {
        /*const val = candidate.votes.find(v => v.value === value);
        return val ? val.weight : undefined;*/
        throw new Error('TODO');
    }

    /**
     * Retrieves a per-poll value
     *
     * @param value
     * @returns integer or undefined
     */
    public getSumValue(value: any /*SummaryPollKey*/): number | undefined {
        // return this.data[value] || undefined;
        throw new Error('TODO');
    }

    /**
     * Sets a per-poll value
     *
     * @param value
     * @param weight
     */
    public setSumValue(value: any /*SummaryPollKey*/, weight: string): void {
        this.pollData[value] = parseFloat(weight);
    }

    public getGridClass(): string {
        return `votes-grid-${this.analogPollValues.length}`;
    }
}
