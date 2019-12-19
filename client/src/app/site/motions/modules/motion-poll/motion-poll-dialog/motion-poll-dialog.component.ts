import { Component, Input, ViewChild, Inject } from '@angular/core';
import { PollDialogComponent } from 'app/site/polls/components/poll-dialog/poll-dialog.component';
import { ViewMotionPoll } from 'app/site/motions/models/view-motion-poll';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { MotionPollMethodsVerbose } from 'app/site/motions/models/view-motion-poll';
import { OneOfValidator } from 'app/shared/validators/one-of-validator';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { PollFormComponent } from 'app/site/polls/components/poll-form/poll-form.component';
import { MotionPollMethods } from 'app/shared/models/motions/motion-poll';

@Component({
    selector: 'os-motion-poll-dialog',
    templateUrl: './motion-poll-dialog.component.html',
    styleUrls: ['./motion-poll-dialog.component.scss']
})
export class MotionPollDialogComponent extends PollDialogComponent {
    public motionPollMethods = MotionPollMethodsVerbose;

    @ViewChild('pollForm', { static: false })
    protected pollForm: PollFormComponent;

    constructor(
        private fb: FormBuilder,
        title: Title,
        protected translate: TranslateService,
        matSnackbar: MatSnackBar,
        public dialogRef: MatDialogRef<PollDialogComponent>,
        @Inject(MAT_DIALOG_DATA) protected pollData: Partial<ViewMotionPoll>
    ) {
        super(title, translate, matSnackbar, dialogRef);
        this.createDialog();
    }

    /**
     * This builds an object, where all `undefined` fields will be interpreted as `-2`.
     *
     * @returns The object ready to send.
     */
    public getVoteData(): object {
        const empty = Object.values(this.dialogVoteForm.value).every(value => !value);
        if (empty) {
            return undefined;
        }
        const result = {};
        for (const key of Object.keys(this.dialogVoteForm.value)) {
            result[key] = !!this.dialogVoteForm.value[key] ? this.dialogVoteForm.value[key] : -2;
        }
        return result;
    }

    private updateDialogVoteForm(data: Partial<ViewMotionPoll>): void {
        const update = {
            Y: data.options[0].yes,
            N: data.options[0].no,
            A: null,
            votesvalid: data.votesvalid,
            votesinvalid: data.votesinvalid,
            votescast: data.votescast
        };
        if (data.pollmethod === 'YNA') {
            update.A = data.options[0].abstain;
        }
        if (this.dialogVoteForm) {
            Object.keys(this.dialogVoteForm.controls).forEach(key => {
                if (update[key] === -2) {
                    update[key] = null;
                }
                this.dialogVoteForm.get(key).setValue(update[key]);
            });
        }
    }

    /**
     * Pre-executed method to initialize the dialog-form depending on the poll-method.
     */
    private createDialog(): void {
        this.dialogVoteForm = this.fb.group({
            Y: ['', [Validators.min(-2)]],
            N: ['', [Validators.min(-2)]],
            votesvalid: ['', [Validators.min(-2)]],
            votesinvalid: ['', [Validators.min(-2)]],
            votescast: ['', [Validators.min(-2)]]
        });
        if (this.pollData.pollmethod === MotionPollMethods.YNA) {
            this.dialogVoteForm.addControl('A', this.fb.control('', [Validators.min(-2)]));
        }
        if (this.pollData.poll) {
            this.updateDialogVoteForm(this.pollData);
        }
    }
}
