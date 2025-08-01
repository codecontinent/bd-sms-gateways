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

> [!NOTE]  
> If you are using Deno, then follow the CDN (e.g. esm.sh) way
>
> ```ts
> // Example: Import via esm.sh CDN
> import { SmsGateway } from "https://esm.sh/@bdcode/sms";
> ```

**Example Usage**

> Using `SMSNetBD` adapter for this example.

```ts
const sms = new SmsGateway(
    "sms-net-bd", 
    { api_key: "<your_api_key_here>" }
);


// Send SMS
await sms.client.sendSms({ 
    to: "8801300112233", 
    msg: "Hello from SmsNetBD!" 

    // schedule: "2021-10-13 16:00:52", // can be scheduled
    // sender_id: "YourSenderID", // uses sender-id/masking 
    // content_id: "YourContentID", // only for bulk-sms
});

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

Made with 💚 by @codecontinent/opensource team and contributors.
