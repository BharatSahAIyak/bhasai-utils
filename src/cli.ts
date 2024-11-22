import { Command } from 'commander';
const program = new Command();

program
  .version('0.0.1')
  .description('BHASAI Utility CLI Tools')
  .option('-n, --name <type>', 'add your name')
  .action((options: { name: string }) => {
    console.log(`Hello, ${options.name || 'World'}!`);
  });

program.parse(process.argv);