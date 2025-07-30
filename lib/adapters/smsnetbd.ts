/*
 *===========================================================
 * [SmsNetBd](https://sms.net.bd) SMS Gateway Adapter
 * This adapter is used to send SMS via SmsNetBd API.
 * It provides the client to have an adapter for SmsNetBd
 * to send SMS messages and others available features.
 * -----------------------------------------------------------
 * Author: Mr. Meaow
 * License: [MIT](https://opensource.org/license/mit/)
 * Version: 0.0.1
 * Date: 2025-30-07
 * ===========================================================
 */

import { z } from "zod";
import { axApiCall, composeHeaders } from "../common";

const SmsNetBdEndpoints = {
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
const basePayloadSchema = z.object({
  api_key: z.string().min(5, "API Key is required"),
});

const validatePayloadWithReqID = basePayloadSchema.extend({
  request_id: z.union([z.string(), z.number()]).transform((val) => String(val)),
});

const validateSendSmsPayload = basePayloadSchema.extend({
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

// [SMSNetBD] Class
export class SmsNetBd {
  constructor(
    protected base: string = "https://api.sms.net.bd" /*= default from SMSNetBD =*/,
  ) {}

  // SEND: SMS
  public async sendSms(payload: SmsNetBdRequestProps) {
    // Validate the payload using zod schema
    const data = validateSendSmsPayload.safeParse(payload);
    if (!data.success) {
      throw new Error(
        `Validation Error: ${data.error.issues.map((issue) => issue.message).join(", ")}`,
      );
    }

    return axApiCall<SmsNetBdResponseProps>(
      "post",
      `${this.base}${SmsNetBdEndpoints.SEND_SMS}`,
      composeHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      data.data,
    );
  }

  // GET: SMS Account Balance
  public async getBalance(api_key: string) {
    const data = basePayloadSchema.parse({ api_key });

    return axApiCall<SmsNetBdResponseProps>(
      "post",
      `${this.base}${SmsNetBdEndpoints.GET_BALANCE}`,
      composeHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      data,
    );
  }

  // GET: SMS Delivery Report \\ {id} is a placeholder for request_id
  public async getReport(request_id: string | number, api_key: string) {
    const data = validatePayloadWithReqID.parse({ request_id, api_key });
    const url = `${this.base}${SmsNetBdEndpoints.GET_REPORT}`.replace(
      "{id}",
      String(data.request_id),
    );

    return axApiCall<SmsNetBdResponseProps>(
      "post",
      url,
      composeHeaders({
        "Content-Type": "application/x-www-form-urlencoded",
      }),
      { api_key: data.api_key },
    );
  }
}

// SMS Send :: Request Interface for SmsNetBd
export interface SmsNetBdRequestProps {
  /*----------------------------------------------------*
   * Your 'API KEY' is used to authenticate in our system.
   *-----------------------------------------------------*/
  api_key: string;

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
