export class BDSmsClient {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    get readApiKey(): string {
        return this.apiKey;
    }
}