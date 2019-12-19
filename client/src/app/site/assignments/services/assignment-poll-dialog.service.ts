import { Injectable } from '@angular/core';
import { BasePollDialogService } from 'app/core/ui-services/base-poll-dialog.service';
import { MatDialog } from '@angular/material';
import { CollectionStringMapperService } from 'app/core/core-services/collection-string-mapper.service';
import { Type } from '@angular/compiler';
import { AssignmentPollDialogComponent } from 'app/site/assignments/components/assignment-poll-dialog/assignment-poll-dialog.component';
import { ComponentType } from '@angular/cdk/portal';
import { ViewAssignmentPoll } from '../models/view-assignment-poll';
import { AssignmentPollService } from './assignment-poll.service';

/**
 * Subclassed to provide the right `PollService` and `DialogComponent`
 */
@Injectable({
    providedIn: 'root'
})
export class AssignmentPollDialogService extends BasePollDialogService<ViewAssignmentPoll> {
    protected dialogComponent = AssignmentPollDialogComponent;

    public constructor(dialog: MatDialog, mapper: CollectionStringMapperService, service: AssignmentPollService) {
        super(dialog, mapper, service);
    }
}
