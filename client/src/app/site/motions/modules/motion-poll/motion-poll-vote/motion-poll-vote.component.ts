import { Component, Input, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { OperatorService } from 'app/core/core-services/operator.service';
import { MotionVoteRepositoryService } from 'app/core/repositories/motions/motion-vote-repository.service';
import { VotingError, VotingService } from 'app/core/ui-services/voting.service';
import { MotionPollMethods } from 'app/shared/models/motions/motion-poll';
import { BaseViewComponent } from 'app/site/base/base-view';
import { ViewMotionPoll } from 'app/site/motions/models/view-motion-poll';
import { ViewMotionVote } from 'app/site/motions/models/view-motion-vote';
import { ViewUser } from 'app/site/users/models/view-user';

@Component({
    selector: 'os-motion-poll-vote',
    templateUrl: './motion-poll-vote.component.html',
    styleUrls: ['./motion-poll-vote.component.scss']
})
export class MotionPollVoteComponent extends BaseViewComponent implements OnInit {
    @Input()
    public poll: ViewMotionPoll;

    // holds the currently selected vote
    public selectedVote: 'Y' | 'N' | 'A' = null;
    // holds the last saved vote
    public currentVote: ViewMotionVote;

    public pollMethods = MotionPollMethods;
    public votingErrors = VotingError;

    private user: ViewUser;
    private votes: ViewMotionVote[];

    public constructor(
        public vmanager: VotingService,
        title: Title,
        protected translate: TranslateService,
        matSnackbar: MatSnackBar,
        private voteRepo: MotionVoteRepositoryService,
        private operator: OperatorService
    ) {
        super(title, translate, matSnackbar);
    }

    public ngOnInit(): void {
        this.subscriptions.push(
            this.operator.getViewUserObservable().subscribe(user => {
                this.user = user;
                this.updateVote();
            }),
            this.voteRepo.getViewModelListObservable().subscribe(votes => {
                this.votes = votes;
                this.updateVote();
            })
        );
    }

    private updateVote(): void {
        if (this.user && this.votes && this.poll) {
            const filtered = this.votes.filter(vote => vote.option.poll.id === this.poll.id && vote.user.id === this.user.id);
            if (filtered.length) {
                if (filtered.length > 1) {
                    // output warning and continue to keep the error case user friendly
                    console.error("A user should never have more than one vote on the same poll.");
                }
                this.currentVote = filtered[0];
                this.selectedVote = filtered[0].value;
            }
        }
    }

    public saveVote(): void {
        if (this.selectedVote) {
            this.voteRepo.sendVote(this.selectedVote, this.poll.id).catch(this.raiseError);
        }
    }
}
