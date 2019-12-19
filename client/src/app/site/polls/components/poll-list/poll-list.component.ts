import { Component } from '@angular/core';

import { PblColumnDefinition } from '@pebula/ngrid';

import { VotingService } from 'app/core/ui-services/voting.service';
import { PollFilterListService } from '../../services/poll-filter-list.service';
import { PollListObservableService } from '../../services/poll-list-observable.service';
import { BaseListViewComponent } from 'app/site/base/base-list-view';
import { ViewBasePoll } from '../../models/view-base-poll';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material';
import { StorageService } from 'app/core/core-services/storage.service';

@Component({
    selector: 'os-poll-list',
    templateUrl: './poll-list.component.html',
    styleUrls: ['./poll-list.component.scss']
})
export class PollListComponent extends BaseListViewComponent<ViewBasePoll> {
    public tableColumnDefinition: PblColumnDefinition[] = [
        {
            prop: 'title',
            width: 'auto'
        },
        {
            prop: 'classType',
            width: 'auto'
        },
        {
            prop: 'state',
            width: '70px'
        },
        {
            prop: 'votability',
            width: '25px'
        }
    ];
    public filterProps = ['title', 'state'];

    public constructor(
        public polls: PollListObservableService,
        public filterService: PollFilterListService,
        public votingService: VotingService,
        protected storage: StorageService,
        title: Title,
        translate: TranslateService,
        snackbar: MatSnackBar
    ) {
        super(title, translate, snackbar, storage);
    }
}
