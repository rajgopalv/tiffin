import { TiffinTestRunner } from './test-utils';

const tiffin = new TiffinTestRunner(__filename);

describe('Add Command', () => {
  afterAll(() => tiffin.cleanup());
  beforeEach(() => tiffin.cleanup());

  test('adds a new item successfully', () => {
    const res = tiffin.run('add "Dosa"');
    expect(res.exitCode).toBe(0);
    expect(res.stdout).toContain('Added "Dosa"');
  });

  test('adds an item with multiple courses and occasions', () => {
    const res = tiffin.run('add "Idli" breakfast,lunch --for festival,work');
    expect(res.stdout).toContain('Added "Idli" [breakfast, lunch] → festival, work');
  });

  test('fails gracefully on duplicate add', () => {
    tiffin.run('add "Dosa"');
    const res = tiffin.run('add "Dosa"');
    expect(res.stdout).toContain('"Dosa" already exists.');
    expect(res.exitCode).toBe(0);
  });

  test('supports JSON output mode', () => {
    const res = tiffin.run('--json add "Dosa"');
    const json = JSON.parse(res.stdout);
    expect(json.success).toBe(true);
    expect(json.created).toBe(true);
  });
});
