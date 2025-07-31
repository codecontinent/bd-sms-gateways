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
const safeComposeRequestBodyData = (body: unknown) => {
  if (typeof body === "object" && body !== null) {
    // If Object / Array, convert to JSON string
    return JSON.stringify(body);
  }

  return body; // string / number / boolean etc.
};

// API calling helper function uses 'Axios' as the HTTP client
export const axApiCall = async <R = unknown>(
  method: HttpRequestType,
  endpoint: string,
  headers: Record<string, unknown> | undefined = undefined,
  body: unknown = undefined,
) => {
  try {
    // Example axios call
    const response = await axios[method]<R>(endpoint, {
      headers,
      data: body ? safeComposeRequestBodyData(body) : undefined,
    });

    if (!response) {
      throw new Error("No response data received from the API.");
    }
    return response.data;
  } catch (err) {
    if (axios.isAxiosError(err)) {
      // Handle Axios error
      throw new Error(`API Error: ${err.response?.data?.msg || err.message}`);
    } else {
      // Handle other errors
      throw new Error(
        `Unexpected Error: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  }
};
