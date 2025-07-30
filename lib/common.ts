import axios from "axios";

// Depends on various adapters for different HTTP clients
export const httpRequestTypes = ["get", "post"] as const;
export type HttpRequestType = (typeof httpRequestTypes)[number];

// Testing mode helper base_url composer
// modes. 'mock' for local testing, or development mock only
// and '*' for production or live environment
export const getBaseUrl = (
  base: string,
  url: string,
  mode: "mock" | "*" = "*",
  localBase: string = "",
) => {
  // If mode is 'mock', append 'mock' to the base URL
  if (mode === "mock") {
    // bypass the base_url for local testing with mock-server base_url
    if (url.startsWith(base)) {
      url = url.slice(base.length);
    }
    return `${localBase}${url}`;
  }

  // If mode is '*' (default), return the original URL
  return url;
};

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
      data: body ? JSON.stringify(body) : undefined,
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
