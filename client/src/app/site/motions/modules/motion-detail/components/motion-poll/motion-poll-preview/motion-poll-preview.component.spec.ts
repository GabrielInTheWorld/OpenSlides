import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { E2EImportsModule } from 'e2e-imports.module';

import { MotionPollVoteComponent } from 'app/site/motions/modules/motion-poll/motion-poll-vote/motion-poll-vote.component';
import { MotionPollPreviewComponent } from './motion-poll-preview.component';

describe('MotionPollPreviewComponent', () => {
    let component: MotionPollPreviewComponent;
    let fixture: ComponentFixture<MotionPollPreviewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [E2EImportsModule],
            declarations: [MotionPollPreviewComponent, MotionPollVoteComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MotionPollPreviewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
