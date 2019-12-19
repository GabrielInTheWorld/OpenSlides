import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { PollListComponent } from './components/poll-list/poll-list.component';
import { PollsRoutingModule } from './polls-routing.module';
import { SharedModule } from '../../shared/shared.module';
import { MotionPollDialogComponent } from '../motions/modules/motion-poll/motion-poll-dialog/motion-poll-dialog.component';
import { PollFormComponent } from './components/poll-form/poll-form.component';

/**
 * App module for the history feature.
 * Declares the used components.
 */
@NgModule({
    imports: [CommonModule, PollsRoutingModule, SharedModule],
    declarations: [PollListComponent]
})
export class PollsModule {}
