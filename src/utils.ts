import * as fs from 'fs';
import axios from 'axios';
import * as path from 'path';
import chalk from 'chalk';

export const getConfig = (filePath: string) => {
  const configPath = path.join(__dirname, filePath);
  console.log(chalk.blue(`Reading config from ${configPath}...`));
  const config = fs.readFileSync(configPath, 'utf8');
  console.log(chalk.green(`Config read successfully from ${configPath}!`));
  return JSON.parse(config);
}