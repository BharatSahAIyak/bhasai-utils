import axios, { AxiosInstance } from "axios";
import chalk from "chalk";

export class UCIAPIService {
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
      const response = await this.httpService.get(`/admin/bot/${botId}`, {
        headers: {
          authorization: `${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.log(chalk.red('Error getting bot information!'));
      throw err;
    }
  }

  public async getRecipe(transformerId: string, token: string) {
    try {
      const response = await this.httpService.get(`/admin/transformer/${transformerId}`, {
        headers: {
          authorization: `${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.log(chalk.red('Error getting conversation logic!'));
      throw err;
    }
  }

  public async updateRecipe(transformerId: string, conversationLogic: any, token: string) {
    try {
      const response = await this.httpService.patch(`/admin/transformer/${transformerId}`, conversationLogic, {
        headers: {
          authorization: `${token}`,
        },
      });

      return response.data;
    } catch (err) {
      console.log(chalk.red('Error updating conversation logic!'));
      throw err;
    }
  }

  public async getLogicDef(conversationLogicId: string, token: string) {
    try {
      const response = await this.httpService.get(`/admin/conversationLogic/${conversationLogicId}`, {
        headers: {
          authorization: `${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.log(chalk.red('Error getting logic definition!'));
      throw err;
    }
  }

  public async updateLogicDef(conversationLogicId: string, token: string, logicDef: any) {
    try {
      const response = await this.httpService.patch(`/admin/conversationLogic/${conversationLogicId}`, { logicDef }, {
        headers: {
          authorization: `${token}`,
        },
      });

      return response.data;
    } catch (err) {
      console.log(chalk.red('Error updating logic definition!'));
      throw err;
    }
  }

  public async getSecretsInBulk(token: string) {
    try {
      const response = await this.httpService.post(`/admin/secret/getBulk`, {}, {
        headers: {
          authorization: `${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.log(chalk.red('Error getting secrets in bulk!'));
      throw err;
    }
  }

  public async createSecret(token: string, secretName: string, secretValue: string) {
    // { "variableName": "TEST_SECRET", "secretBody": { "TEST_SECRET": "TEST_BODY" } }
    try {
      const response = await this.httpService.post(`/admin/secret/create`, {
        variableName: secretName,
        secretBody: {
          [secretName]: secretValue
        }
      }, {
        headers: {
          authorization: `${token}`,
        },
      });
      return response.data;
    } catch (err) {
      console.log(chalk.red('Error creating secret!'));
      throw err;
    }
  }

  public async getOneSecret(token: string, secretName: string) {
    throw new Error('Not implemented!');
  }

  public async getAllOrgSecrets(token: string) {
    throw new Error('Not implemented!');
  }
}