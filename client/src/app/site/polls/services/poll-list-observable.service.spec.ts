import { TestBed } from '@angular/core/testing';

import { PollListObservableService } from './poll-list-observable.service';
import { E2EImportsModule } from 'e2e-imports.module';

describe('PollListObservableService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [E2EImportsModule],
    }));

    it('should be created', () => {
        const service: PollListObservableService = TestBed.get(PollListObservableService);
        expect(service).toBeTruthy();
    });
});
