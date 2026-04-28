import { StatusLabelPipe } from './status-label-pipe';

describe('StatusLabelPipe', () => {
  let pipe: StatusLabelPipe;

  beforeEach(() => {
    pipe = new StatusLabelPipe();
  });

  it('should return "ACTIVE" when status is true', () => {
    expect(pipe.transform(true)).toBe('ACTIVE');
  });

  it('should return "INACTIVE" when status is false', () => {
    expect(pipe.transform(false)).toBe('INACTIVE');
  });
});
