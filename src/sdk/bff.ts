import axios, { AxiosInstance } from "axios";
import chalk from "chalk";

export class BFFService {
  private baseUrl: string;
  private httpService: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.httpService = axios.create({
      baseURL: this.baseUrl,
    });
  }

  public async getBotInformation(botId: string, token: string) {
    try {
      const response = await this.httpService.get(`/bot/${botId}`, {
        headers: {
          authorization: `${token}`,
        },
      });

      return response.data;
    } catch (err) {
      console.log(chalk.red('Error getting transformerId!'));
      throw err;
    }
  }
}
