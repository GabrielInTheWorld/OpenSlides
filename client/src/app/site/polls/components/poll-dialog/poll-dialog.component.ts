import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';

import { GroupRepositoryService } from 'app/core/repositories/users/group-repository.service';
import { MotionPoll, MotionPollMethods } from 'app/shared/models/motions/motion-poll';
import { OneOfValidator } from 'app/shared/validators/one-of-validator';
import { BaseViewComponent } from 'app/site/base/base-view';
import { ViewMotionPoll, MotionPollMethodsVerbose } from 'app/site/motions/models/view-motion-poll';
import { MotionPollService } from 'app/site/motions/services/motion-poll.service';
import { ViewGroup } from 'app/site/users/models/view-group';
import {
    PollTypeVerbose,
    PercentBaseVerbose,
    MajorityMethodVerbose,
    ViewBasePoll
} from 'app/site/polls/models/view-base-poll';
import { PercentBase } from 'app/shared/models/poll/base-poll';
import { mediumDialogSettings } from 'app/shared/utils/dialog-settings';
import { PollState, PollType } from 'app/shared/models/poll/base-poll';
import { MatDialog } from '@angular/material';
import { PollService } from 'app/site/polls/services/poll.service';
import { CollectionStringMapperService } from 'app/core/core-services/collection-string-mapper.service';
import { ViewAssignmentPoll } from 'app/site/assignments/models/view-assignment-poll';
import { PollFormComponent } from '../poll-form/poll-form.component';

/**
 * A dialog for updating the values of a poll.
 */
export abstract class PollDialogComponent extends BaseViewComponent {
    public publishImmediately: boolean;

    protected pollForm: PollFormComponent;

    public dialogVoteForm: FormGroup;

    protected abstract getVoteData(): object;

    public constructor(
        title: Title,
        protected translate: TranslateService,
        matSnackbar: MatSnackBar,
        public dialogRef: MatDialogRef<PollDialogComponent>
    ) {
        super(title, translate, matSnackbar);
    }

    /**
     * Submits the values from dialog.
     */
    public submitPoll(): void {
        const answer = {
            ...this.pollForm.getValues(),
            votes: this.getVoteData(),
            publish_immediately: this.publishImmediately
        };
        this.dialogRef.close(answer);
    }

    /**
     * Handles the state-change of the checkbox `Publish immediately`.
     *
     * If it is checked, at least one of the fields have to be filled.
     *
     * @param checked The next state.
     */
    public publishStateChanged(checked: boolean): void {
        if (checked) {
            this.dialogVoteForm.setValidators(OneOfValidator.validation(...Object.keys(this.dialogVoteForm.controls)));
        } else {
            this.dialogVoteForm.setValidators(null);
        }
    }
}
