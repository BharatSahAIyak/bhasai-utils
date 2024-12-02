import { Command } from 'commander';
import { main } from '.';
const program = new Command();

program
  .version('0.0.1')
  .description('BHASAI Utility CLI Tools')
  .command('help')
  .description('Display help information')
  .action(() => {
    console.log('BHASAI CLI Tool Help');
    console.log('===================\n');
    console.log('Available Commands:');
    console.log('  help              Display this help information');
    console.log('\nOptions:');
    console.log('  -V, --version     Output the version number');
    console.log('  -h, --help        Display help for command');
  });


program
  .command('migrate')
  .description('Migrate data between environments using a config file')
  .argument('<configPath>', 'Path to the configuration file')
  .action(async (configPath) => {
    try {
      await main(configPath);
    } catch (error) {
      console.error('Error during migration:', error);
      process.exit(1);
    }
  });


program.parse(process.argv);