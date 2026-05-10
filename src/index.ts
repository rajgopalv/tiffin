import { Command } from 'commander';
import { setOutputOptions, getDbPath } from './output';
import { initDb } from './db';

const program = new Command();

program
  .name('tiffin')
  .description('A command-line meal idea and meal planning tool')
  .version('1.0.0')
  .option('--json', 'Output in JSON format')
  .option('--db <path>', 'Custom database path')
  .hook('preAction', (thisCommand) => {
    const options = thisCommand.opts();
    setOutputOptions({ json: options.json });
    
    const dbPath = getDbPath(options.db);
    initDb(dbPath);
  });

program
  .command('add')
  .description('Add a new item')
  .argument('<name>', 'Item name')
  .argument('[courses...]', 'Courses for the item')
  .option('--for <occasions...>', 'Occasions for the item')
  .action((name, courses, options) => {
    // Placeholder for Step 3
    console.log(`Adding ${name} with courses ${courses} and occasions ${options.for}`);
  });

program.parse();
