import { SmsNetBd, type SmsNetBdConfig } from "./adapters/smsnetbd.js";

export const smsAdapters = ["sms-net-bd", "bulk-sms-dhaka"] as const;

export type ADAPTERS_MAP = {
  "sms-net-bd": {
    client: SmsNetBd;
    config: SmsNetBdConfig;
  };
  "bulk-sms-dhaka": {
    // <-- coming soon...
    client: unknown; // TODO: Replace with actual type
    config: unknown; // TODO: Replace with actual type
  };
  // ... Add other adapters here as needed
};

export type SMS_ADAPTER = (typeof smsAdapters)[number];

// Our entrypoint client class <SmsGateway> as unified
export default class SmsGateway<T extends SMS_ADAPTER> {
  public client: ADAPTERS_MAP[T]["client"];
  constructor(
    private _adapter: T,
    private config: ADAPTERS_MAP[T]["config"],
  ) {
    this.client = this.loadAdapter(this._adapter, this.config);
  }

  private loadAdapter(
    adapter: T,
    config: ADAPTERS_MAP[T]["config"],
  ): ADAPTERS_MAP[T]["client"] {
    switch (adapter) {
      case "sms-net-bd":
        return new SmsNetBd(
          config as SmsNetBdConfig,
        ) as ADAPTERS_MAP[T]["client"];
      case "bulk-sms-dhaka":
        throw new Error("Adapter not available yet.");
      default:
        throw new Error(`Adapter "${adapter}" is invalid or not supported.`);
    }
  }
}
