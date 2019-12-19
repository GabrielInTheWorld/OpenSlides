import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { MotionsRoutingModule } from './motions-routing.module';
import { MotionPollDialogComponent } from './modules/motion-poll/motion-poll-dialog/motion-poll-dialog.component';
import { PollsModule } from '../polls/polls.module';

@NgModule({
    imports: [CommonModule, MotionsRoutingModule]
})
export class MotionsModule {}
