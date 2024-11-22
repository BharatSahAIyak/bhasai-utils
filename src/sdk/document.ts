import axios from "axios";

import { AxiosInstance } from "axios";
import chalk from "chalk";

export class DocumentService {
  private baseUrl: string;
  private httpService: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.httpService = axios.create({
      baseURL: this.baseUrl,
    });
  }


  public async exportConfig(orgId: string, botId: string) {
    try {
      const response = await this.httpService.post(`/export`, {}, {
        headers: {
          "orgId": orgId,
          "botId": botId,
        }
      });

      return response.data;
    } catch (err) {
      console.log(chalk.red('Error exporting dataset config!'));
      throw err;
    }
  }

  public async importConfig(orgId: string, botId: string, documentConfig: any) {
    try {
      const response = await this.httpService.post(`/import`, documentConfig, {
        headers: {
          "orgId": orgId,
          "botId": botId,
        }
      });

      return response.data;
    } catch (err) {
      console.log(chalk.red('Error importing dataset config!'));
      throw err;
    }
  }
}
