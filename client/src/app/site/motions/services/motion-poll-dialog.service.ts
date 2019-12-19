import { Injectable } from '@angular/core';
import { BasePollDialogService } from 'app/core/ui-services/base-poll-dialog.service';
import { MatDialog } from '@angular/material';
import { CollectionStringMapperService } from 'app/core/core-services/collection-string-mapper.service';
import { MotionPollService } from './motion-poll.service';
import { Type } from '@angular/compiler';
import { MotionPollDialogComponent } from 'app/site/motions/modules/motion-poll/motion-poll-dialog/motion-poll-dialog.component';
import { ComponentType } from '@angular/cdk/portal';
import { ViewMotionPoll } from '../models/view-motion-poll';

/**
 * Subclassed to provide the right `PollService` and `DialogComponent`
 */
@Injectable({
    providedIn: 'root'
})
export class MotionPollDialogService extends BasePollDialogService<ViewMotionPoll> {
    protected dialogComponent = MotionPollDialogComponent;

    public constructor(dialog: MatDialog, mapper: CollectionStringMapperService, service: MotionPollService) {
        super(dialog, mapper, service);
    }
}
