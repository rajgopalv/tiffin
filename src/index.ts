import { Command } from 'commander';
import { setOutputOptions, getDbPath } from './output';
import { initDb } from './db';

const program = new Command();

program
  .name('tiffin')
  .description('A command-line meal idea and meal planning tool')
  .version('1.0.0')
  .option('--json', 'Output in JSON format')
  .option('--exact', 'Disable fuzzy matching')
  .option('--db <path>', 'Custom database path')
  .hook('preAction', (thisCommand) => {
    const options = thisCommand.opts();
    setOutputOptions({ json: options.json, exact: options.exact });
    
    const dbPath = getDbPath(options.db);
    initDb(dbPath);
  });

import { addCommand } from './commands/add';
import { listCommand } from './commands/list';
import { showCommand } from './commands/show';
import { suggestCommand } from './commands/suggest';

program
  .command('add')
  .description('Add a new item')
  .argument('<name>', 'Item name')
  .argument('[courses...]', 'Courses for the item')
  .option('--for <occasions>', 'Occasions for the item')
  .action(addCommand);

program
  .command('list')
  .description('List all items')
  .argument('[course]', 'Filter by course')
  .option('--for <occasion>', 'Filter by occasion')
  .action(listCommand);

program
  .command('show')
  .description('Show full detail for one item')
  .argument('<name>', 'Item name')
  .action(showCommand);

program
  .command('suggest')
  .description('Suggest a random item')
  .argument('[course]', 'Filter by course')
  .option('--for <occasion>', 'Filter by occasion')
  .action(suggestCommand);

program.parse();
