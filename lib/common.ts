import axios from "axios";

// Depends on various adapters for different HTTP clients
export const httpRequestTypes = ["get", "post"] as const;
export type HttpRequestType = (typeof httpRequestTypes)[number];

// Request Headers for various HTTP clients
export const commonHttpReqContentTypes = [
  "application/json", // <-- common for REST APIs that accept JSON payloads
  "application/x-www-form-urlencoded", // <-- common for 'form' submissions based api
  // ... add more content types as needed
] as const;

export type CommonHttpReqContentType =
  (typeof commonHttpReqContentTypes)[number];

// Base request headers for HTTP requests to various provider's APIs
export type IRequestHeaders = {
  "Content-Type": CommonHttpReqContentType;
  [key: string]: string | number | boolean | undefined;
};

// common headers composition function
export const composeHeaders = (
  headers: IRequestHeaders,
): Record<string, string> => {
  const composedHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (value !== undefined) {
      composedHeaders[key] = String(value);
    }
  }
  return composedHeaders;
};

// Check request body payload type
const safeComposeRequestBodyData = (
  body: unknown,
  target: "form" | "json" = "json",
) => {
  if (typeof body === "object" && body !== null) {
    // If Object / Array, convert to JSON string

    // if target is 'form', convert to URLSearchParams
    if (target === "form") {
      const formData = new URLSearchParams();
      for (const [key, value] of Object.entries(body)) {
        if (value !== undefined) {
          formData.append(key, String(value));
        }
      }
      return formData;
    }

    // else, JSON payload
    return JSON.stringify(body);
  }

  return body; // string / number / boolean etc.
};

// API calling helper function uses 'Axios' as the HTTP client
export const axApiCall = async <R = unknown>(
  method: HttpRequestType,
  endpoint: string,
  headers: Record<string, string> = {},
  body: unknown = undefined,
  target: "form" | "json" = "json",
) => {
  try {
    const isWriteMethod = ["post", "put", "patch", "delete"].includes(
      method.toLowerCase(),
    );

    const formattedBody = body
      ? safeComposeRequestBodyData(body, target)
      : undefined;

    // Set content-type based on target
    if (formattedBody) {
      headers["Content-Type"] =
        target === "form"
          ? "application/x-www-form-urlencoded"
          : "application/json";
    }

    const axiosConfig = {
      headers,
    };

    // We are recommending to use 'POST' method for all write operations
    // even, read operations if supported with payload JSON/FORM data
    // by the API providers e.g. SMSNetBd does support both methods
    // For more, visit https://sms.net.bd/api
    const response = isWriteMethod
      ? await axios[method]<R>(endpoint, formattedBody, axiosConfig)
      : await axios[method]<R>(endpoint, axiosConfig); // e.g., GET

    if (!response || !response.data) {
      throw new Error("No response data received from the API.");
    }

    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      throw new Error(`API Error: ${err.response?.data?.msg || err.message}`);
    }
    throw new Error(
      `Unexpected Error: ${err instanceof Error ? err.message : "Unknown error"}`,
    );
  }
};
