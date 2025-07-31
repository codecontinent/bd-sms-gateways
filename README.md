# BD SMS Gateways

[![Release](https://github.com/codecontinent/bd-sms-gateways/actions/workflows/release.yml/badge.svg)](https://github.com/codecontinent/bd-sms-gateways/actions/workflows/release.yml)

## Getting Started

**Install Package**

```bash
# NPM
npm install @bdcode/sms

# PNPM
pnpm add @bdcode/sms

# Yarn
yarn add @bdcode/sms

# Bun
bun add @bdcode/sms

```

> [!WARNING]  
> If you are using Deno, then follow the CDN (e.g. esm.sh) way
>
> ```ts
> // Example: Import via esm.sh CDN
> import { SmsClient } from "https://esm.sh/@bdcode/sms";
> ```

**Example Usage**

> Using `SMSNetBD` adapter for this example.

```ts
const sms = new SmsGateway("sms-net-bd", { api_key: "<your_api_key_here>" });

// Send SMS
await sms.client.sendSms({ to: "8801300112233", msg: "Hello from SmsNetBD!" });

// Get Balance
await sms.client.getBalance();

// Get Report
await sms.client.getReport("12345");

```

---

**SMS Providers we have covered so far:**

-  ✔ [SMS-NET-BD](https://sms.net.bd)
- ⏳ [Bulk-SMS-Dhaka](https://bulksmsdhaka.com)
- 🔎 (Suggest us or propose & contribute)

Made with 💚 by `@github/codecontinent`
