/*
 *===========================================================
 * [SmsNetBd](https://sms.net.bd) SMS Gateway Adapter
 * This adapter is used to send SMS via SmsNetBd API.
 * -----------------------------------------------------------
 * Author: @codecontinent/opensource team.
 * License: [MIT](https://opensource.org/license/mit/)
 * Version: 0.0.1
 * Date: 2025-30-07
 * ===========================================================
 */

import { z } from "zod";
import { axApiCall, composeHeaders } from "../common.js";

export const SmsNetBdEndpoints = {
  SEND_SMS: "/sendsms",
  GET_BALANCE: "/user/balance/",
  GET_REPORT: "/report/request/{id}/", // {id} is a placeholder for request_id
  // ... add more if newly added in their API_DOCS
} as const;

/*---------------------------------------------------------------
 * Note: SmsNetBD API expects form-urlencoded data for requests.
 *       The `composeHeaders` function is used to set the correct
 *       'Content-Type' header for form submissions.
 *       In this case, we use 'application/x-www-form-urlencoded'
 *       as the content type for the requests, which is
 *       compatible to send data in the form submission as expected.
 *       For more, visit: https://sms.net.bd/api
 *----------------------------------------------------------------*/

// schema for validating the payloads ...
export const validatePayloadWithReqID = z.object({
  request_id: z.union([z.string(), z.number()]).transform((val) => String(val)),
});

export const validateSendSmsPayload = z.object({
  msg: z.string().min(1, "Message content is required"),
  to: z
    .string()
    .min(1, "Recipient number(s) are required")
    .refine(
      (val) =>
        val
          .split(",")
          .map((num) => num.trim())
          .every((num) => /^(\+?8801\d{9}|01\d{9})$/.test(num)),
      {
        message:
          "Each recipient number must start with country code (880) or Standard 01X and be valid.",
      },
    ),
  schedule: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(val),
      {
        message:
          "Schedule must be formatted as Y-m-d H:i:s (e.g. 2021-10-13 16:00:52)",
      },
    ),
  sender_id: z.string().optional(),
  content_id: z.string().optional(),
});

/**
 * Configuration options for the SmsNetBd adapter.
 *
 * @property api_key - API key for authentication. **Required.**
 * @property base - Base URL for the API. Defaults to `"https://api.sms.net.bd"` if not provided.
 */
export interface SmsNetBdConfig {
  api_key: string; // @required \\ API key for authentication
  base?: string; // Base URL for the API, default is "https://api.sms.net.bd"
}

/**
 * SmsNetBd Adapter Class
 *
 * This class provides methods to interact with the SmsNetBd API for sending SMS, checking balance, and getting delivery reports.
 * It uses the `axios` library for HTTP requests and `zod` for payload validation.
 *
 * @class SmsNetBd
 * @param {SmsNetBdConfig} config - Configuration options for the adapter.
 * @property {string} base - Base URL for the API, defaults to "https://api.sms.net.bd".
 * @property {string} api_key - API key for authentication.
 * @throws {Error} If the payload validation fails or if the API response indicates an error.
 */
export class SmsNetBd {
  private base: string;
  private api_key: string;

  constructor(protected config: SmsNetBdConfig) {
    // Set default base URL if not provided
    this.base = config.base ?? "https://api.sms.net.bd";
    this.api_key = config.api_key;
  }

  // SEND: SMS
  public async sendSms(payload: SmsNetBdRequestProps) {
    // Validate the payload using zod schema
    const parsed = validateSendSmsPayload.safeParse(payload);
    if (!parsed.success) {
      throw new Error(
        `Validation Error: ${parsed.error.issues.map((issue) => issue.message).join(", ")}`,
      );
    }

    const res = await axApiCall<SmsNetBdResponseProps>(
      "post",
      `${this.base}${SmsNetBdEndpoints.SEND_SMS}`,
      composeHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      { ...parsed.data, api_key: this.api_key }, // Include api_key from config
      "form", // Use form-urlencoded for sending SMS
    );

    if (res.error !== 0) {
      throw new Error(`${res.error}: ${res.msg}`);
    }

    return res;
  }

  // GET: SMS Account Balance
  public async getBalance() {
    const res = await axApiCall<SmsNetBdResponseProps>(
      "post",
      `${this.base}${SmsNetBdEndpoints.GET_BALANCE}`,
      composeHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      { api_key: this.api_key },
      "form", // Use form-urlencoded for getting balance
    );

    if (res.error !== 0) {
      throw new Error(`${res.error}: ${res.msg}`);
    }

    return res;
  }

  // GET: SMS Delivery Report \\ {id} is a placeholder for request_id
  public async getReport(request_id: string | number) {
    const data = validatePayloadWithReqID.parse({ request_id });
    const url = `${this.base}${SmsNetBdEndpoints.GET_REPORT}`.replace(
      "{id}",
      String(data.request_id),
    );

    const res = await axApiCall<SmsNetBdResponseProps>(
      "post",
      url,
      composeHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      { api_key: this.api_key },
      "form", // Use form-urlencoded for getting report
    );

    if (res.error !== 0) {
      throw new Error(`${res.error}: ${res.msg}`);
    }

    return res;
  }
}

/**
 * Represents the properties required to send an SMS request via SmsNetBd.
 *
 * @property {string} msg - The body content of your message.
 * @property {string} to - The recipient numbers. Multiple numbers must be separated by comma (,) (applicable for only campaign SMS). The number must start with country code (880) or standard 01X.
 * @property {string} [schedule] - (Optional) The schedule date and time to send your message. Date and time must be formatted as Y-m-d H:i:s (e.g., 2021-10-13 16:00:52).
 * @property {string} [sender_id] - (Optional) If you have an approved Sender ID, you can use this parameter to set your Sender ID as the sender in your messages.
 * @property {string} [content_id] - (Required for bulk SMS) If you have an approved campaign content, you can use this parameter to set the ID of the content to use.
 */
export interface SmsNetBdRequestProps {
  /*----------------------------------------------------*
   * The body content of your message.
   *-----------------------------------------------------*/
  msg: string;

  /*----------------------------------------------------*
   * The recipient numbers. Multiple numbers must be
   * separated by comma(,) (applicable for only campaign SMS).
   * The Number must start with country code(880) or Standard 01X.
   *-----------------------------------------------------*/
  to: string;

  /*----------------------------------------------------*
   * The schedule date and time to send your message.
   * Date and time must be formatted as Y-m-d H:i:s
   * (eg. 2021-10-13 16:00:52 )
   * (Optional) field
   *-----------------------------------------------------*/
  schedule?: string;

  /*----------------------------------------------------*
   * If you have an approved Sender ID, you can use this
   * parameter to set your Sender ID as from in you messages.
   * (Optional) field
   *-----------------------------------------------------*/
  sender_id?: string;

  /*----------------------------------------------------*
   * (Required for bulk sms) If you have an approved
   * campaign content, you can use this parameter to
   * set the ID of the content to use.
   *-----------------------------------------------------*/
  content_id?: string;
}

// SMS Send :: Response Interface from SmsNetBd
export interface SmsNetBdResponseProps {
  error: number;
  msg: string;
  data: {
    balance?: string;
    request_id?: number;
    request_status?: string;
    request_charge?: string;
    recipients?: {
      number: string;
      charge: string;
      status: string;
    }[];
  };
}

// SMS Net BD Error Codes constants
// Can be used in future or removed if we decide not to use this
export const SmsNetBdErrors = {
  0: "Success. Everything worked as expected.",
  400: "The request was rejected, due to a missing or invalid parameter.",
  403: "You don't have permissions to perform the request.",
  404: "The requested resource not found.",
  405: "Authorization required.",
  409: "Unknown error occurred on Server end.",
  410: "Account expired",
  411: "Reseller Account expired or suspended",
  412: "Invalid Schedule",
  413: "Invalid Sender ID",
  414: "Message is empty",
  415: "Message is too long",
  416: "No valid number found",
  417: "Insufficient balance",
  420: "Content Blocked",
} as const;
