import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';

import { OperatorService } from 'app/core/core-services/operator.service';
import { CalculablePollKey, CalculableMajorityMethod } from 'app/site/polls/services/poll.service';
import { BaseViewComponent } from 'app/site/base/base-view';
import { AssignmentPollPdfService } from '../../services/assignment-poll-pdf.service';
import { ViewAssignment } from '../../models/view-assignment';
import { ViewAssignmentOption } from '../../models/view-assignment-option';
import { ViewAssignmentPoll } from '../../models/view-assignment-poll';
import { AssignmentPollRepositoryService } from 'app/core/repositories/assignments/assignment-poll-repository.service';
import { PromptService } from 'app/core/ui-services/prompt.service';
import { AssignmentPollMethods } from 'app/shared/models/assignments/assignment-poll';
import { filter } from 'rxjs/operators';
import { AssignmentVoteRepositoryService } from 'app/core/repositories/assignments/assignment-vote-repository.service';
import { AssignmentVote } from 'app/shared/models/assignments/assignment-vote';
import { ViewUser } from 'app/site/users/models/view-user';
import { ViewAssignmentVote } from '../../models/view-assignment-vote';

/**
 * Component for a single assignment poll. Used in assignment detail view
 */
@Component({
    selector: 'os-assignment-poll',
    templateUrl: './assignment-poll.component.html',
    styleUrls: ['./assignment-poll.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AssignmentPollComponent extends BaseViewComponent implements OnInit {
    /**
     * The poll represented in this component
     */
    @Input()
    public poll: ViewAssignmentPoll;

    /**
     * Form for updating the poll's description
     */
    public descriptionForm: FormGroup;

    /**
     * permission checks.
     * TODO stub
     *
     * @returns true if the user is permitted to do operations
     */
    public get canManage(): boolean {
        return this.operator.hasPerms('assignments.can_manage');
    }

    public get canSee(): boolean {
        return this.operator.hasPerms('assignments.can_see');
    }

    /**
     * @returns true if the description on the form differs from the poll's description
     */
    public get dirtyDescription(): boolean {
        return this.descriptionForm.get('description').value !== this.poll.description;
    }

    /** holds the currently saved votes */
    private currentVotes: { [key: number]: string | number | null } = {};

    private votes: ViewAssignmentVote[];
    private user: ViewUser;

    public voteForm: FormGroup;

    public constructor(
        titleService: Title,
        matSnackBar: MatSnackBar,
        private operator: OperatorService,
        private formBuilder: FormBuilder,
        public translate: TranslateService,
        public dialog: MatDialog,
        private pdfService: AssignmentPollPdfService,
        private promptService: PromptService,
        private repo: AssignmentPollRepositoryService,
        private voteRepo: AssignmentVoteRepositoryService
    ) {
        super(titleService, translate, matSnackBar);
    }

    public ngOnInit(): void {
        /*this.majorityChoice =
            this.pollService.majorityMethods.find(method => method.value === this.pollService.defaultMajorityMethod) ||
            null;*/
        this.descriptionForm = this.formBuilder.group({
            description: this.poll ? this.poll.description : ''
        });
        this.subscriptions.push(
            this.operator.getViewUserObservable().subscribe(user => {
                this.user = user;
                this.updateVotes();
            }),
            this.voteRepo.getViewModelListObservable().subscribe(votes => {
                this.votes = votes;
                this.updateVotes();
            })
        );
    }

    private updateVotes(): void {
        if (this.user && this.votes && this.poll) {
            const filtered = this.votes.filter(
                vote => vote.option.poll.id === this.poll.id && vote.user.id === this.user.id
            );
            this.voteForm = this.formBuilder.group(
                this.poll.options.reduce((obj, option) => {
                    obj[option.id] = ['', [Validators.required]];
                    return obj;
                }, {})
            );
            for (let option of this.poll.options) {
                let vote = filtered.find(vote => vote.option.id === option.id);
                this.currentVotes[option.id] = vote
                    ? this.poll.pollmethod === AssignmentPollMethods.Votes
                        ? vote.weight
                        : vote.value
                    : null;
                this.voteForm.get(option.id.toString()).setValue(this.currentVotes[option.id]);
            }
        }
    }

    public saveVotes(): void {
        this.repo.vote(this.voteForm.value, this.poll.id).catch(this.raiseError);
    }

    /**
     * Handler for the 'delete poll' button
     */
    public async onDeletePoll(): Promise<void> {
        const title = this.translate.instant('Are you sure you want to delete this poll?');
        if (await this.promptService.open(title)) {
            await this.repo.delete(this.poll).catch(this.raiseError);
        }
    }

    /**
     * Print the PDF of this poll with the corresponding options and numbers
     *
     */
    public printBallot(): void {
        throw new Error('TODO');
        // this.pdfService.printBallots(this.poll);
    }

    /**
     * Determines whether the candidate has reached the majority needed to pass
     * the quorum
     *
     * @param option
     * @returns true if the quorum is successfully met
     */
    public quorumReached(option: ViewAssignmentOption): boolean {
        /*const yesValue = this.poll.pollmethod === 'votes' ? 'Votes' : 'Yes';
        const amount = option.votes.find(v => v.value === yesValue).weight;
        const yesQuorum = this.pollService.yesQuorum(
            this.majorityChoice,
            this.pollService.calculationDataFromPoll(this.poll),
            option
        );
        return yesQuorum && amount >= yesQuorum;*/
        throw new Error('TODO');
    }

    /**
     * Opens the {@link AssignmentPollDialogComponent} dialog and then updates the votes, if the dialog
     * closes successfully (validation is done there)
     */
    public enterVotes(): void {
        /*const dialogRef = this.dialog.open(AssignmentPollDialogComponent, {
            data: this.poll.copy(),
            ...mediumDialogSettings
        });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.assignmentRepo.updateVotes(result, this.poll).catch(this.raiseError);
            }
        });*/
    }

    /**
     * Toggles the 'published' state
     */
    public togglePublished(): void {
        // this.assignmentRepo.updatePoll({ published: !this.poll.published }, this.poll);
    }

    /**
     * Mark/unmark an option as elected
     *
     * @param option
     */
    public toggleElected(option: ViewAssignmentOption): void {
        /*if (!this.operator.hasPerms('assignments.can_manage')) {
            return;
        }

        // TODO additional conditions: assignment not finished?
        const viewAssignmentRelatedUser = this.assignment.assignment_related_users.find(
            user => user.user_id === option.candidate_id
        );
        if (viewAssignmentRelatedUser) {
            this.assignmentRepo.markElected(viewAssignmentRelatedUser, this.assignment, !option.is_elected);
        }*/
    }

    /**
     * Sends the edited poll description to the server
     * TODO: Better feedback
     */
    public async onEditDescriptionButton(): Promise<void> {
        /*const desc: string = this.descriptionForm.get('description').value;
        await this.assignmentRepo.updatePoll({ description: desc }, this.poll).catch(this.raiseError);*/
    }

    /**
     * Fetches a tooltip string about the quorum
     * @param option
     * @returns a translated
     */
    public getQuorumReachedString(option: ViewAssignmentOption): string {
        /*const name = this.translate.instant(this.majorityChoice.display_name);
        const quorum = this.pollService.yesQuorum(
            this.majorityChoice,
            this.pollService.calculationDataFromPoll(this.poll),
            option
        );
        const isReached = this.quorumReached(option)
            ? this.translate.instant('reached')
            : this.translate.instant('not reached');
        return `${name} (${quorum}) ${isReached}`;*/
        throw new Error('TODO');
    }
}
