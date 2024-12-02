import axios, { AxiosInstance } from 'axios';
import chalk from 'chalk';

export class AuthService {
  private baseUrl: string;
  private httpService: AxiosInstance;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    this.httpService = axios.create({
      baseURL: this.baseUrl,
    });
  }


  public async login(email: string, password: string) {
    try {
      const response = await this.httpService.post('/org/login', {
        email,
        password,
      });

      return response.data;
    } catch (err) {
      console.log(chalk.red('Error logging in!'));
      throw err;
    }
  }
}
