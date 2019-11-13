import { TestBed } from '@angular/core/testing';

import { VotingBannerService } from './voting-banner.service';
import { E2EImportsModule } from 'e2e-imports.module';

describe('VotingBannerService', () => {
    beforeEach(() => TestBed.configureTestingModule({
        imports: [E2EImportsModule],
    }));

    it('should be created', () => {
        const service: VotingBannerService = TestBed.get(VotingBannerService);
        expect(service).toBeTruthy();
    });
});
