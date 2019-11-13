import { AssignmentPoll, AssignmentPollmethods } from 'app/shared/models/assignments/assignment-poll';
import { ProjectorElementBuildDeskriptor } from 'app/site/base/projectable';
import { ViewBasePoll } from 'app/site/polls/models/view-base-poll';
import { ViewGroup } from 'app/site/users/models/view-group';
import { ViewUser } from 'app/site/users/models/view-user';
import { ViewAssignmentOption } from './view-assignment-option';

export interface AssignmentPollTitleInformation {
    title: string;
}

export class ViewAssignmentPoll extends ViewBasePoll<AssignmentPoll> implements AssignmentPollTitleInformation {
    public static COLLECTIONSTRING = AssignmentPoll.COLLECTIONSTRING;
    protected _collectionString = AssignmentPoll.COLLECTIONSTRING;

    public readonly pollClassType: 'assignment' | 'motion' = 'assignment';

    public getSlide(): ProjectorElementBuildDeskriptor {
        // TODO: update to new voting system?
        return {
            getBasicProjectorElement: options => ({
                name: 'assignments/assignment-poll',
                assignment_id: this.assignment_id,
                poll_id: this.id,
                getIdentifiers: () => ['name', 'assignment_id', 'poll_id']
            }),
            slideOptions: [],
            projectionDefaultName: 'assignment-poll',
            getDialogTitle: () => 'TODO'
        };
    }
}

export interface ViewAssignmentPoll extends AssignmentPoll {
    options: ViewAssignmentOption[];
}
