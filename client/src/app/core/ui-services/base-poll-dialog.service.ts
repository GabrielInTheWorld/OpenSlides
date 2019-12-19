import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { PollDialogComponent } from 'app/site/polls/components/poll-dialog/poll-dialog.component';
import { mediumDialogSettings } from 'app/shared/utils/dialog-settings';
import { ViewMotionPoll } from 'app/site/motions/models/view-motion-poll';
import { ViewAssignmentPoll } from 'app/site/assignments/models/view-assignment-poll';
import { PollState, PollType } from 'app/shared/models/poll/base-poll';
import { PollService } from '../../site/polls/services/poll.service';
import { Collection } from 'app/shared/models/base/collection';
import { CollectionStringMapperService } from 'app/core/core-services/collection-string-mapper.service';
import { ViewBasePoll } from 'app/site/polls/models/view-base-poll';
import { ComponentType } from '@angular/cdk/portal';

/**
 * Abstract class for showing a poll dialog. Has to be subclassed to provide the right `PollService`
 */
@Injectable({
    providedIn: 'root'
})
export abstract class BasePollDialogService<V extends ViewBasePoll> {
    protected dialogComponent: ComponentType<PollDialogComponent>;

    public constructor(
        private dialog: MatDialog,
        private mapper: CollectionStringMapperService,
        private service: PollService
    ) {}

    /**
     * Opens the dialog to enter votes and edit the meta-info for a poll.
     *
     * @param data Passing the (existing or new) data for the poll
     */
    public async openDialog(poll: Partial<V> & Collection): Promise<void> {
        if (!poll.poll) {
            this.service.fillDefaultPollData(poll);
        }
        const dialogRef = this.dialog.open(this.dialogComponent, {
            data: poll,
            ...mediumDialogSettings
        });
        const result = await dialogRef.afterClosed().toPromise();
        if (result) {
            const repo = this.mapper.getRepository(poll.collectionString);
            if (!poll.poll) {
                await repo.create(result);
            } else {
                let update = result;
                if (poll.state !== PollState.Created) {
                    update = {
                        title: result.title,
                        onehundred_percent_base: result.onehundred_percent_base,
                        majority_method: result.majority_method,
                        description: result.description
                    };
                    if (poll.type === PollType.Analog) {
                        update = {
                            ...update,
                            votes: result.votes,
                            publish_immediately: result.publish_immediately
                        };
                    }
                }
                await repo.patch(update, <V>poll);
            }
        }
    }
}
