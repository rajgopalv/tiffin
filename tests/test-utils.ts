import { execSync } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export class TiffinTestRunner {
  public readonly dbPath: string;

  constructor(testFileName: string) {
    const name = path.basename(testFileName, '.test.ts');
    this.dbPath = path.resolve(`./tests/tmp-${name}.db`);
  }

  run(args: string) {
    try {
      const stdout = execSync(`npx ts-node src/index.ts --db ${this.dbPath} ${args}`, { encoding: 'utf-8' });
      return { stdout, exitCode: 0, stderr: '' };
    } catch (e: any) {
      return { 
        stdout: e.stdout?.toString() || '', 
        stderr: e.stderr?.toString() || '', 
        exitCode: e.status 
      };
    }
  }

  cleanup() {
    if (fs.existsSync(this.dbPath)) fs.unlinkSync(this.dbPath);
  }
}
