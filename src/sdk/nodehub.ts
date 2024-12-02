import axios, { AxiosInstance } from "axios";
import chalk from "chalk";

export class NodeHubService {
  private baseUrl: string;
  private httpService: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.httpService = axios.create({
      baseURL: this.baseUrl,
    });
  }

  public async getWatchdedNodes(token: string) {
    console.log(chalk.blue('Getting watched nodes...'));
    console.log(chalk.blue(token));
    try {
      const response = await this.httpService.get(`/node/watched`, {
        headers: {
          authorization: `${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.log(chalk.red('Error getting watched nodes!'));
      throw err;
    }
  }

  public async createCompositeNode(token: string, node: any) {
    try {
      const response = await this.httpService.post(`/node/publish`, node, {
        headers: {
          authorization: `${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.log(chalk.red('Error creating composite node!'));
      throw err;
    }
  }
}
