import { TiffinTestRunner } from './test-utils';

const tiffin = new TiffinTestRunner(__filename);

describe('List Command (--json)', () => {
  afterAll(() => tiffin.cleanup());
  beforeEach(() => { 
    tiffin.cleanup();
    tiffin.run('add "Dosa" breakfast --for festival');
    tiffin.run('add "Idli" lunch');
  });

  test('list all items', () => {
    const res = tiffin.run('--json list');
    const json = JSON.parse(res.stdout);
    expect(json.success).toBe(true);
    expect(json.items.length).toBe(2);
  });

  test('filter list by course', () => {
    const res = tiffin.run('--json list breakfast');
    const json = JSON.parse(res.stdout);
    expect(json.success).toBe(true);
    expect(json.items.length).toBe(1);
    expect(json.items[0].name).toBe('Dosa');
  });

  test('list courses', () => {
    const res = tiffin.run('--json list courses');
    const json = JSON.parse(res.stdout);
    expect(json.success).toBe(true);
    expect(json.courses).toContain('breakfast');
    expect(json.courses).toContain('lunch');
  });
});
