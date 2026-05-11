import { TiffinTestRunner } from './test-utils';

const tiffin = new TiffinTestRunner(__filename);

describe('Show Command (--json)', () => {
  afterAll(() => tiffin.cleanup());
  beforeEach(() => { 
    tiffin.cleanup();
    tiffin.run('add "Dosa" breakfast --for festival');
  });

  test('show existing item details', () => {
    const res = tiffin.run('--json show Dosa');
    const json = JSON.parse(res.stdout);
    expect(json.success).toBe(true);
    expect(json.item.name).toBe('Dosa');
    expect(json.item.courses).toContain('breakfast');
  });

  test('show non-existent item fails', () => {
    const res = tiffin.run('--json show Missing');
    const json = JSON.parse(res.stderr);
    expect(json.success).toBe(false);
    expect(res.exitCode).toBe(2);
  });
});
