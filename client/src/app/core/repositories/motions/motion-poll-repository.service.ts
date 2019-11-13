import { Injectable } from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

import { DataSendService } from 'app/core/core-services/data-send.service';
import { HttpService } from 'app/core/core-services/http.service';
import { RelationManagerService } from 'app/core/core-services/relation-manager.service';
import { ViewModelStoreService } from 'app/core/core-services/view-model-store.service';
import { RelationDefinition } from 'app/core/definitions/relations';
import { VotingService } from 'app/core/ui-services/voting.service';
import { MotionPoll } from 'app/shared/models/motions/motion-poll';
import { PollState } from 'app/shared/models/poll/base-poll';
import { ViewMotionOption } from 'app/site/motions/models/view-motion-option';
import { MotionPollTitleInformation, ViewMotionPoll } from 'app/site/motions/models/view-motion-poll';
import { BasePollRepositoryService } from 'app/site/polls/services/base-poll-repository.service';
import { ViewGroup } from 'app/site/users/models/view-group';
import { ViewUser } from 'app/site/users/models/view-user';
import { CollectionStringMapperService } from '../../core-services/collection-string-mapper.service';
import { DataStoreService } from '../../core-services/data-store.service';

const MotionPollRelations: RelationDefinition[] = [
    {
        type: 'M2M',
        ownIdKey: 'groups_id',
        ownKey: 'groups',
        foreignViewModel: ViewGroup
    },
    {
        type: 'M2M',
        ownIdKey: 'voted_id',
        ownKey: 'voted',
        foreignViewModel: ViewUser
    }
];

/**
 * Repository Service for Assignments.
 *
 * Documentation partially provided in {@link BaseRepository}
 */
@Injectable({
    providedIn: 'root'
})
export class MotionPollRepositoryService extends BasePollRepositoryService<
    ViewMotionPoll,
    MotionPoll,
    MotionPollTitleInformation
> {
    public constructor(
        private http: HttpService,
        DS: DataStoreService,
        dataSend: DataSendService,
        mapperService: CollectionStringMapperService,
        viewModelStoreService: ViewModelStoreService,
        translate: TranslateService,
        relationManager: RelationManagerService,
        votingService: VotingService
    ) {
        super(
            DS,
            dataSend,
            mapperService,
            viewModelStoreService,
            translate,
            relationManager,
            MotionPoll,
            MotionPollRelations,
            {},
            votingService
        );
    }

    public getTitle = (titleInformation: MotionPollTitleInformation) => {
        return titleInformation.title;
    };

    public getVerboseName = (plural: boolean = false) => {
        return this.translate.instant(plural ? 'Polls' : 'Poll');
    };

    public changePollState(poll: MotionPoll | ViewMotionPoll): Promise<void> {
        const path = this.restPath(poll);
        switch (poll.state) {
            case PollState.Created:
                return this.http.post(`${path}/start/`);
            case PollState.Started:
                throw new Error('Analog polls cannot be stopped manually.');
            case PollState.Finished:
                return this.http.post(`${path}/publish/`);
            case PollState.Published:
                return this.resetPoll(poll);
        }
    }

    public async enterAnalogVote(
        poll: MotionPoll | ViewMotionPoll,
        voteResult: { Y: number; N: number; A?: number; votesvalid?: number; votesinvalid?: number; votescast?: number }
    ): Promise<void> {
        if (poll.state === 1) {
            await this.changePollState(poll);
        }
        return this.http.post(`${this.restPath(poll)}/vote/`, voteResult);
    }

    public resetPoll(poll: MotionPoll | ViewMotionPoll): Promise<void> {
        return this.http.post(`${this.restPath(poll)}/reset/`);
    }

    private restPath(poll: MotionPoll | ViewMotionPoll): string {
        return `/rest/${poll.collectionString}/${poll.id}`;
    }
}
