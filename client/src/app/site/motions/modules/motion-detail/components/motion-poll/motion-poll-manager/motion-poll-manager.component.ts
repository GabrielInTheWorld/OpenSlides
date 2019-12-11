import { Component, Input } from '@angular/core';
import { MatDialog, MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { MotionPollRepositoryService } from 'app/core/repositories/motions/motion-poll-repository.service';
import { MotionPoll } from 'app/shared/models/motions/motion-poll';
import { mediumDialogSettings } from 'app/shared/utils/dialog-settings';
import { BaseViewComponent } from 'app/site/base/base-view';
import { ViewMotion } from 'app/site/motions/models/view-motion';
import { ViewMotionPoll } from 'app/site/motions/models/view-motion-poll';
import { LocalPermissionsService } from 'app/site/motions/services/local-permissions.service';
import { MotionPollService } from 'app/site/motions/services/motion-poll.service';
import { MotionPollDialogComponent } from '../../../../motion-poll/motion-poll-dialog/motion-poll-dialog.component';
import { PollState } from 'app/shared/models/poll/base-poll';

@Component({
    selector: 'os-motion-poll-manager',
    templateUrl: './motion-poll-manager.component.html',
    styleUrls: ['./motion-poll-manager.component.scss']
})
export class MotionPollManagerComponent extends BaseViewComponent {
    /**
     * The dedicated motion.
     */
    @Input()
    public motion: ViewMotion;

    /**
     * Default constructor.
     */
    public constructor(
        title: Title,
        protected translate: TranslateService,
        matSnackbar: MatSnackBar,
        private pollRepo: MotionPollRepositoryService,
        private service: MotionPollService,
        private dialog: MatDialog,
        public perms: LocalPermissionsService
    ) {
        super(title, translate, matSnackbar);
    }

    /**
     * Opens the dialog to enter votes and edit the meta-info for a motion-poll.
     *
     * @param data Optional. Passing the data for the motion-poll, if existing - any.
     */
    public openDialog(poll?: ViewMotionPoll): void {
        const dialogRef = this.dialog.open(MotionPollDialogComponent, {
            data: poll ? poll : this.service.getDefaultPollData(this.motion.id),
            ...mediumDialogSettings
        });
        dialogRef.afterClosed().subscribe(async result => {
            if (result) {
                if (!poll) {
                    this.pollRepo.create(result).catch(this.raiseError);
                } else {
                    let update = result;
                    if (poll.state !== PollState.Created) {
                        update = {
                            title: result.title,
                            onehundred_percent_base: result.onehundred_percent_base,
                            majority_method: result.majority_method,
                            description: result.description,
                            votes: result.votes,
                            publish_immediately: result.publish_immediately
                        };
                    }
                    this.pollRepo.patch(update, poll).catch(this.raiseError);
                }
            }
        });
    }
}
