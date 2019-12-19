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
import { PollState } from 'app/shared/models/poll/base-poll';
import { PollDialogComponent } from 'app/site/polls/components/poll-dialog/poll-dialog.component';

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
        public perms: LocalPermissionsService,
        public pollDialog: PollDialogComponent
    ) {
        super(title, translate, matSnackbar);
    }
}
