import { SmsNetBd } from "./adapters/smsnetbd";

const ADAPTERS = [
  "sms-net-bd",
  "bulk-sms-dhaka", // <-- coming soon...
  // ... Add other adapters here as needed
] as const;
export type AdapterType = (typeof ADAPTERS)[number];

// Our entrypoint client class as unified
export default class BDSmsProviders<T> {
  public client: T;
  constructor(
    private _adapter: AdapterType,
    private _baseUrl?: string,
  ) {
    this.client = this.loadAdapter(this._adapter);
  }

  private loadAdapter(adapter: AdapterType): T {
    switch (adapter) {
      case "sms-net-bd":
        if (this._baseUrl) return new SmsNetBd(this._baseUrl) as T;
        return new SmsNetBd() as T;

      // Add other adapters here as needed
      default:
        throw new Error(
          `Adapter "${adapter}" is invalid or not supported yet.`,
        );
    }
  }
}
