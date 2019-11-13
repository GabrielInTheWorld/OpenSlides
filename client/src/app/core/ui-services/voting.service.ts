import { Injectable } from '@angular/core';

import { PollState, PollType } from 'app/shared/models/poll/base-poll';
import { ViewBasePoll } from 'app/site/polls/models/view-base-poll';
import { OperatorService } from '../core-services/operator.service';

export enum VotingError {
    POLL_WRONG_STATE = 1, // 1 so we can check with negation
    POLL_WRONG_TYPE,
    USER_HAS_NO_PERMISSION,
    USER_IS_ANONYMOUS,
    USER_NOT_PRESENT,
    USER_HAS_VOTED
}

@Injectable({
    providedIn: 'root'
})
export class VotingService {
    public constructor(private operator: OperatorService) {}

    /**
     * checks whether the operator can vote on the given poll
     */
    public canVote(poll: ViewBasePoll): boolean {
        return !this.getVotePermissionErrors(poll);
    }

    /**
     * checks whether the operator can vote on the given poll
     * @returns null if no errors exist (= user can vote) or else a VotingError
     */
    public getVotePermissionErrors(poll: ViewBasePoll): VotingError | void {
        const user = this.operator.viewUser;
        if (this.operator.isAnonymous) {
            return VotingError.USER_IS_ANONYMOUS;
        }
        if (!poll.groups_id.intersect(user.groups_id).length) {
            return VotingError.USER_HAS_NO_PERMISSION;
        }
        if (poll.type === PollType.Analog) {
            return VotingError.POLL_WRONG_TYPE;
        }
        if (poll.state !== PollState.Started) {
            return VotingError.POLL_WRONG_STATE;
        }
        if (!user.is_present) {
            return VotingError.USER_NOT_PRESENT;
        }
        if (poll.type === PollType.Pseudoanonymous && poll.user_has_voted) {
            return VotingError.USER_HAS_VOTED;
        }
    }
}
