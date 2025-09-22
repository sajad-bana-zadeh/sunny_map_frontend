import { TestBed } from '@angular/core/testing';

import { Point } from './point';

describe('Point', () => {
  let service: Point;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Point);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
