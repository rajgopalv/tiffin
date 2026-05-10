import path from 'path';
import os from 'os';

export interface OutputOptions {
  json?: boolean;
}

let options: OutputOptions = {};

export function setOutputOptions(opts: OutputOptions) {
  options = opts;
}

export function isJsonMode(): boolean {
  return !!options.json;
}

export const out = {
  success(msg: string) {
    if (options.json) return;
    console.log(`✓ ${msg}`);
  },
  info(msg: string) {
    if (options.json) return;
    console.info(`ℹ ${msg}`);
  },
  error(msg: string) {
    if (options.json) return;
    console.error(`✗ ${msg}`);
  },
  json(data: any) {
    if (!options.json) return;
    console.log(JSON.stringify({ success: true, ...data }, null, 2));
  },
  jsonError(data: any) {
    if (!options.json) {
      if (data.error) console.error(`✗ ${data.error}`);
      return;
    }
    console.error(JSON.stringify({ success: false, ...data }, null, 2));
  }
};

export function getDbPath(override?: string): string {
  if (override) return path.resolve(override);
  const homeDir = os.homedir();
  return path.join(homeDir, '.tiffin', 'tiffin.db');
}
