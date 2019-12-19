import { TestBed } from '@angular/core/testing';

import { PollFilterListService } from './poll-filter-list.service';
import { E2EImportsModule } from 'e2e-imports.module';

describe('PollFilterListService', () => {
    beforeEach(() =>
        TestBed.configureTestingModule({
            imports: [E2EImportsModule]
        })
    );

    it('should be created', () => {
        const service: PollFilterListService = TestBed.get(PollFilterListService);
        expect(service).toBeTruthy();
    });
});
