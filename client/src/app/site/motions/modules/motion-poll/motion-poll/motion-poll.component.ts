import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Title } from '@angular/platform-browser';

import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';

import { MotionPollRepositoryService } from 'app/core/repositories/motions/motion-poll-repository.service';
import { ChartData } from 'app/shared/components/charts/charts.component';
import { BaseViewComponent } from 'app/site/base/base-view';
import { ViewMotionPoll } from 'app/site/motions/models/view-motion-poll';
import { MotionPollService } from 'app/site/motions/services/motion-poll.service';
import { PollStateVerbose } from 'app/site/polls/models/view-base-poll';

/**
 * Component to show a motion-poll.
 */
@Component({
    selector: 'os-motion-poll',
    templateUrl: './motion-poll.component.html',
    styleUrls: ['./motion-poll.component.scss']
})
export class MotionPollComponent extends BaseViewComponent {
    /**
     * The dedicated `ViewMotionPoll`.
     */
    @Input()
    public set poll(value: ViewMotionPoll) {
        this._poll = value;

        const chartData = this.poll.generateChartData();
        for (const data of chartData) {
            if (data.label === 'YES') {
                this.voteYes = data.data[0];
            }
            if (data.label === 'NO') {
                this.voteNo = data.data[0];
            }
        }
        this.chartDataSubject.next(chartData);
    }

    public get poll(): ViewMotionPoll {
        return this._poll;
    }

    /**
     * The id of the dedicated motion.
     */
    @Input()
    public motionId: number;

    /**
     * Emits, when the user clicks the 'edit'-button.
     */
    @Output()
    public edit = new EventEmitter<void>();

    /**
     * Subject to holding the data needed for the chart.
     */
    public chartDataSubject: BehaviorSubject<ChartData> = new BehaviorSubject([]);

    /**
     * Number of votes for `Yes`.
     */
    public voteYes = 0;

    /**
     * Number of votes for `No`.
     */
    public voteNo = 0;

    /**
     * The motion-poll.
     */
    private _poll: ViewMotionPoll;

    public pollStates = PollStateVerbose;

    /**
     * Constructor.
     *
     * @param title
     * @param translate
     * @param matSnackbar
     * @param router
     * @param motionRepo
     */
    public constructor(
        title: Title,
        protected translate: TranslateService,
        matSnackbar: MatSnackBar,
        public pollService: MotionPollService,
        public pollRepo: MotionPollRepositoryService
    ) {
        super(title, translate, matSnackbar);
    }
}
