import * as fs from 'fs';
import axios from 'axios';
import * as path from 'path';
import chalk from 'chalk';

export const getConfig = (filePath: string) => {
  const configPath = path.join(__dirname, filePath);
  const config = fs.readFileSync(configPath, 'utf8');
  return JSON.parse(config);
}

export const processConfig = async (config: any) => {
  const spinner = chalk.yellow('⏳'); // Spinning ball emoji
  console.log(`${spinner} ${chalk.green('Processing Dataset/Document config...')}`);
  const { source, target } = config;
  const sourceConfig = source[config.source];
  const targetConfig = target[config.target];

  // export from source 
  try {
    console.log(chalk.green(`Exporting Datasets/Documents from Source at ${sourceConfig.base_url}...`));
    const sourceDatasetConfig = await axios.post(`${sourceConfig.base_url}/export`, {}, {
      headers: {
        orgId: sourceConfig.orgId,
        botId: sourceConfig.botId,
      }
    });

    fs.writeFileSync(path.join(__dirname, 'data', `/configs/${Date.now()}-source-dataset-config.json`), JSON.stringify(sourceDatasetConfig, null, 2));

    // import to target
    console.log(chalk.green(`Importing Datasets/Documents to Target at ${targetConfig.base_url}...`));
    await axios.post(`${targetConfig.base_url}/import`, sourceDatasetConfig, {
      headers: {
        orgId: targetConfig.orgId,
        botId: targetConfig.botId,
      }
    });
    console.log(chalk.green('Done!'));
  } catch (err) {
    console.log(chalk.red('Error Migrating Datasets/Documents!'));
    console.log(err);
  }
}

