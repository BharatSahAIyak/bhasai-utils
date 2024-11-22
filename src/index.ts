import chalk from "chalk";
import { BHASAI } from "./sdk/bhasai";
import { getConfig } from "./utils";
import { Ops } from "./types/ops";

export const main = async () => {
  // read the config
  const config = getConfig('configs/sample.json');

  const sourceBhasaiInstance = new BHASAI(config.env.source);
  const targetBhasaiInstance = new BHASAI(config.env.target);
  // login and get the auth token
  const sourceAuthToken = await sourceBhasaiInstance.authService.login(config.env.source.email, config.env.source.password);
  const targetAuthToken = await targetBhasaiInstance.authService.login(config.env.target.email, config.env.target.password);
  // process the config
  const ops = config.ops;
  Object.keys(ops).forEach(async (op) => {
    switch (op) {
      case Ops.DATA:
        console.log(chalk.blue('Starting data migration...'));
        await migrateData({ instance: sourceBhasaiInstance, orgId: config.env.source.orgId, botId: config.env.source.botId }, { instance: targetBhasaiInstance, orgId: config.env.target.orgId, botId: config.env.target.botId });
        console.log(chalk.green('Data migration completed.'));
        break;
      case Ops.RECIPE:
        break;
      case Ops.SECRETS:
        console.log(chalk.blue('Starting secrets migration...'));
        await migrateSecrets({ instance: sourceBhasaiInstance, orgId: config.env.source.orgId, botId: config.env.source.botId, token: sourceAuthToken }, { instance: targetBhasaiInstance, orgId: config.env.target.orgId, botId: config.env.target.botId, token: targetAuthToken });
        console.log(chalk.green('Secrets migration completed.'));
        break;
      case Ops.COMPOSITE_NODES:
        console.log(chalk.blue('Starting composite nodes migration...'));
        await migrateCompositeNodes({ instance: sourceBhasaiInstance, orgId: config.env.source.orgId, botId: config.env.source.botId, token: sourceAuthToken }, { instance: targetBhasaiInstance, orgId: config.env.target.orgId, botId: config.env.target.botId, token: targetAuthToken });
        console.log(chalk.green('Composite nodes migration completed.'));
        break;
      default:
        console.log(chalk.red(`Invalid operation: ${op}`));
        break;
    }
  });
}

const migrateData = async (source: { instance: BHASAI, orgId: string, botId: string }, target: { instance: BHASAI, orgId: string, botId: string }) => {
  // migrating datasets
  try {
    console.log(chalk.blue('Starting dataset migration...'));
    const sourceDatasetConfig = await source.instance.datasetService.exportConfig(source.orgId, source.botId);
    console.log(chalk.green('Successfully exported dataset configuration.'));
    await target.instance.datasetService.importConfig(target.orgId, target.botId, sourceDatasetConfig);
    console.log(chalk.green('Successfully imported dataset configuration.'));
  } catch (err) {
    console.log(chalk.red('Error Migrating Datasets!'));
    console.log(err);
    throw new Error('Error while migrating datasets');
  }
  // migrating documents
  try {
    console.log(chalk.blue('Starting document migration...'));
    const sourceDocumentConfig = await source.instance.documentService.exportConfig(source.orgId, source.botId);
    console.log(chalk.green('Successfully exported document configuration.'));
    await target.instance.documentService.importConfig(target.orgId, target.botId, sourceDocumentConfig);
    console.log(chalk.green('Successfully imported document configuration.'));
  } catch (err) {
    console.log(chalk.red('Error Migrating Documents!'));
    console.log(err);
    throw new Error('Error while migrating documents');
  }
}

const migrateSecrets = async (source: { instance: BHASAI, orgId: string, botId: string, token: string }, target: { instance: BHASAI, orgId: string, botId: string, token: string }) => {
  /// fetch the secrest from source in bulk
  /// create the secrets one by one in target
  /// log the success and failure
  try {
    // get auth token
    const { result } = await source.instance.uciApisService.getSecretsInBulk(source.token);
    console.log(chalk.green('Successfully fetched secrets.'));
    // create the secrets one by one in target
    const secrets = Object.keys(result);
    for (const secret of secrets) {
      await target.instance.uciApisService.createSecret(target.token, secret, result[secret]);
    }
    console.log(chalk.green('Successfully created secrets.'));
  } catch (err) {
    console.log(chalk.red('Error Migrating Secrets!'));
    console.log(err);
    throw new Error('Error while migrating secrets');
  }
}

const migrateCompositeNodes = async (source: { instance: BHASAI, orgId: string, botId: string, token: string }, target: { instance: BHASAI, orgId: string, botId: string, token: string }) => {
  // fetch the composite nodes from source
  // create the composite nodes one by one in target
  // log the success and failure
  try {
    const sourceCompositeNodes = await source.instance.nodeHubService.getWatchdedNodes(source.token);
    const { composite } = sourceCompositeNodes;
    const promises = composite.map(async (item: any) => {
      const { node } = item;
      // delete not required fields
      delete node.id;
      delete node.orgId;
      delete node.ownerId;
      delete node.orgName;
      delete node.version;
      delete node.creationTime;

      return await target.instance.nodeHubService.createCompositeNode(target.token, node);
    });
    await Promise.all(promises);
    console.log(chalk.green('Successfully created composite nodes.'));
  } catch (err) {
    console.log(chalk.red('Error Migrating Composite Nodes!'));
    console.log(err);
    throw new Error('Error while migrating composite nodes');
  }
}

const migrateRecipe = async (source: { instance: BHASAI, orgId: string, botId: string, token: string }, target: { instance: BHASAI, orgId: string, botId: string, token: string }) => {
  /**
 * Steps to update the Recipe
 * 1. User will give the source botId and target botId
 * 2. Download the recipe from source bot
 * 3. Upload the recipe to the target bot
 * 
 * Steps to download the recipe
 * 1. Call bff with botId to get transformerId
 * 2. Call UCI APIs with transformerId to get recipe
 * 
 * Steps to upload the recipe
 * 1. Compile the downloaded 
 */


  // fetch recipe from source

  /// get transformerId from botId
  const { transformerId } = await source.instance.bffService.getBotInformation(source.botId, source.token);
  console.log(chalk.blue('Starting recipe migration...'));
  const sourceRecipe = await source.instance.uciApisService.getRecipe(transformerId, source.token);
  const { conversationLogicId } = await source.instance.uciApisService.getBotInformation(source.botId, source.token);
  const sourceLogicDef = await source.instance.uciApisService.getLogicDef(conversationLogicId, source.token);
  console.log(chalk.green('Successfully fetched recipe.'));
  // upload the recipe to target
  await target.instance.uciApisService.updateLogicDef(conversationLogicId, target.token, sourceLogicDef);
  console.log(chalk.green('Successfully created recipe.'));

}