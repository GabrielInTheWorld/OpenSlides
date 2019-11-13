import { BaseDecimalModel } from '../base/base-decimal-model';

export const VoteValueVerbose = {
    Y: 'Yes',
    N: 'No',
    A: 'Abstain'
};

export abstract class BaseVote<T> extends BaseDecimalModel<T> {
    public weight: number;
    public value: 'Y' | 'N' | 'A';
    public option_id: number;
    public user_id?: number;

    public get valueVerbose(): string {
        return VoteValueVerbose[this.value];
    }

    protected getDecimalFields(): (keyof BaseVote<T>)[] {
        return ['weight'];
    }
}
