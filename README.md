# Bhasai Utils

Utility scripts to help streamline some BHASAI management tasks.

## Environment Migration

It is common to have different BHASAI deployments for different environments (dev, stage, UAT, prod, QA etc.), which results in the hassle of moving data between environments -- datasets, documents, composite nodes, secrets and recipe.
We have the `migrate` command in this repo to help migrate the data from one env to another.

Simply Run
```bash
npx tsx src/cli.ts migrate <PATH_TO_CONFIG_FILE>
```


## Appendix

### Config

BHASAI Utils is config driven with config detailed and defined as follows:

```ts
/**
 * Represents the root structure of the configuration.
 */
export interface Config {
  /** Environment-specific configuration */
  env: {
    /** Configuration for the source environment */
    source: EnvironmentConfig;
    /** Configuration for the target environment */
    target: EnvironmentConfig;
  };
  /** Operational settings */
  ops: OperationsConfig;
}

/**
 * Represents the configuration for an environment.
 */
export interface EnvironmentConfig {
  /** Collection of service configurations */
  services: ServicesConfig;
  /** Identifier for the bot */
  botId: string;
  /** Identifier for the organization */
  orgId: string;
  /** Email associated with the environment */
  email: string;
  /** Password associated with the environment */
  password: string;
}

/**
 * Represents the configuration for various services.
 */
export interface ServicesConfig {
  /** Configuration for the BFF service */
  bff: ServiceConfig;
  /** Configuration for the dataset service */
  dataset: ServiceConfig;
  /** Configuration for the document service */
  document: ServiceConfig;
  /** Configuration for the UCI APIs service */
  uci_apis: ServiceConfig;
  /** Configuration for the authentication service */
  auth_service: ServiceConfig;
  /** Configuration for the NodeHub service */
  nodehub: ServiceConfig;
}

/**
 * Represents the configuration for a single service.
 */
export interface ServiceConfig {
  /** Base URL of the service */
  base_url: string;
}

/**
 * Represents the operational settings.
 */
export interface OperationsConfig {
  /** Configuration for data operations */
  data: OperationStatus;
  /** Configuration for recipe operations */
  recipe: OperationStatus;
  /** Configuration for secrets operations */
  secrets: OperationStatus;
  /** Configuration for composite node operations */
  composite_nodes: OperationStatus;
}

/**
 * Represents the status of an operation.
 */
export interface OperationStatus {
  /** Indicates whether the operation is complete */
  complete: boolean;
}
```

A sample config json can be found at [./configs/sample.json](./configs/sample.json)