import { NodeHubService } from "./nodehub";
import { UCIAPIService } from "./uci-apis";
import { AuthService } from "./auth-service";
import { DatasetService } from "./dataset";
import { DocumentService } from "./document";
import { BFFService } from "./bff";

export class BHASAI {
  public nodeHubService: NodeHubService;
  public uciApisService: UCIAPIService;
  public authService: AuthService;
  public datasetService: DatasetService;
  public documentService: DocumentService;
  public bffService: BFFService;

  constructor(private config: any) {
    const { services } = this.config;
    this.nodeHubService = new NodeHubService(services.nodehub.base_url);
    this.uciApisService = new UCIAPIService(services.uci_apis.base_url);
    this.authService = new AuthService(services.auth_service.base_url);
    this.datasetService = new DatasetService(services.dataset.base_url);
    this.documentService = new DocumentService(services.document.base_url);
    this.bffService = new BFFService(services.bff.base_url);
  }
}
