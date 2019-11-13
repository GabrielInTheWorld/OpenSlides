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
            this.operator.getUserObservable().subscribe(user => {
                if (user && this.poll && this.selectedVote === null) {
                    const votes = this.voteRepo.getVotesForUser(this.poll.id, user.id);
                    if (votes.length) {
                        // max one vote should exist
                        this.currentVote = votes[0];
                        this.selectedVote = votes[0].value;
                    }
                }
            })
        );
    }

    public saveVote(): void {
        if (this.selectedVote) {
            this.voteRepo.sendVote(this.selectedVote, this.poll.id).catch(this.raiseError);
        }
    }
}
