import { BasePoll, PollState } from 'app/shared/models/poll/base-poll';
import { ViewAssignmentPoll } from 'app/site/assignments/models/view-assignment-poll';
import { BaseProjectableViewModel } from 'app/site/base/base-projectable-view-model';
import { ProjectorElementBuildDeskriptor } from 'app/site/base/projectable';
import { ViewMotionPoll } from 'app/site/motions/models/view-motion-poll';
import { ViewGroup } from 'app/site/users/models/view-group';
import { ViewUser } from 'app/site/users/models/view-user';

export const PollClassTypeVerbose = {
    motion: 'Motion poll',
    assignment: 'Assignment poll'
};

export const PollStateVerbose = {
    1: 'Created',
    2: 'Started',
    3: 'Finished',
    4: 'Published'
};

export const PollTypeVerbose = {
    analog: 'Analog',
    named: 'Named',
    pseudoanonymous: 'Pseudoanonymous'
};

export const PollPropertyVerbose = {
    majority_method: 'Majority method',
    onehundred_percent_base: '100% base',
    type: 'Poll type',
    pollmethod: 'Poll method',
    state: 'State',
    groups: 'Entitled to vote'
};

export const MajorityMethodVerbose = {
    simple: 'Simple',
    two_thirds: 'Two Thirds',
    three_quarters: 'Three Quarters',
    disabled: 'Disabled'
};

export const PercentBaseVerbose = {
    YN: 'Yes/No',
    YNA: 'Yes/No/Abstain',
    valid: 'Valid votes',
    cast: 'Casted votes',
    disabled: 'Disabled'
};

export abstract class ViewBasePoll<M extends BasePoll<M, any> = any> extends BaseProjectableViewModel<M> {

    public get poll(): M {
        return this._model;
    }

    public get pollClassTypeVerbose(): string {
        return PollClassTypeVerbose[this.pollClassType];
    }

    public get parentLink(): string {
        return this.pollClassType === 'motion'
            ? `/motions/${(<ViewMotionPoll>(<any>this)).poll.motion_id}`
            : `/assignments/${(<ViewAssignmentPoll>(<any>this)).poll.assignment_id}/`;
    }

    public get stateVerbose(): string {
        return PollStateVerbose[this.state];
    }

    public get typeVerbose(): string {
        return PollTypeVerbose[this.type];
    }

    public get majorityMethodVerbose(): string {
        return MajorityMethodVerbose[this.majority_method];
    }

    public get percentBaseVerbose(): string {
        return PercentBaseVerbose[this.onehundred_percent_base];
    }

    public get nextStates(): { [key: number]: string } {
        const state = (this.state % Object.keys(PollStateVerbose).length) + 1;
        const states = {
            state: PollStateVerbose[state]
        };
        if (this.state === PollState.Finished) {
            states[PollState.Created] = PollStateVerbose[PollState.Created];
        }
        return states;
    }
    public abstract readonly pollClassType: 'motion' | 'assignment';

    public canBeVotedFor: () => boolean;

    public abstract getSlide(): ProjectorElementBuildDeskriptor;
}

export interface ViewBasePoll<M extends BasePoll<M, any> = any> extends BasePoll<M, any> {
    voted: ViewUser[];
    groups: ViewGroup[];
}
