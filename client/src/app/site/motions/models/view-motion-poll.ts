import { ChartData } from 'app/shared/components/charts/charts.component';
import { MotionPoll, MotionPollMethods } from 'app/shared/models/motions/motion-poll';
import { PollColor, PollState } from 'app/shared/models/poll/base-poll';
import { ProjectorElementBuildDeskriptor } from 'app/site/base/projectable';
import { ViewMotionOption } from 'app/site/motions/models/view-motion-option';
import { ViewBasePoll } from 'app/site/polls/models/view-base-poll';
import { ViewGroup } from 'app/site/users/models/view-group';
import { ViewUser } from 'app/site/users/models/view-user';

export interface MotionPollTitleInformation {
    title: string;
}

export const MotionPollMethodsVerbose = {
    YN: 'Yes/No',
    YNA: 'Yes/No/Abstain'
};

export class ViewMotionPoll extends ViewBasePoll<MotionPoll> implements MotionPollTitleInformation {
    public static COLLECTIONSTRING = MotionPoll.COLLECTIONSTRING;
    protected _collectionString = MotionPoll.COLLECTIONSTRING;

    public readonly pollClassType: 'assignment' | 'motion' = 'motion';

    public generateChartData(): ChartData {
        const model = this.poll;
        const data: ChartData = [
            ...Object.entries(this.options[0])
                .filter(([key, value]) => {
                    if (model.pollmethod === MotionPollMethods.YN) {
                        return key.toLowerCase() !== 'abstain' && key.toLowerCase() !== 'id';
                    }
                    return key.toLowerCase() !== 'id';
                })
                .map(([key, value]) => ({
                    label: key.toUpperCase(),
                    data: [value],
                    backgroundColor: PollColor[key],
                    hoverBackgroundColor: PollColor[key]
                }))
        ];

        data.push({
            label: 'Votes invalid',
            data: [model.votesinvalid],
            backgroundColor: PollColor.votesinvalid,
            hoverBackgroundColor: PollColor.votesinvalid
        });

        return data;
    }

    public getSlide(): ProjectorElementBuildDeskriptor {
        return {
            getBasicProjectorElement: options => ({
                name: MotionPoll.COLLECTIONSTRING,
                id: this.id,
                getIdentifiers: () => ['name', 'id']
            }),
            slideOptions: [],
            projectionDefaultName: 'motion-poll',
            getDialogTitle: this.getTitle
        };
    }

    public get pollmethodVerbose(): string {
        return MotionPollMethodsVerbose[this.pollmethod];
    }
}

export interface ViewMotionPoll extends MotionPoll {
    options: ViewMotionOption[];
}
