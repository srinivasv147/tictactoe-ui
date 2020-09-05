import { TestBed } from '@angular/core/testing';

import { WsTokenService } from './ws-token.service';

describe('WsTokenService', () => {
  let service: WsTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WsTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
