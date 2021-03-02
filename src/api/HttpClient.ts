import * as Actions from "../actions";

const API_DOMAIN = "url-to-your-api-server-ending-with-a-slash/";

function GetContentType(headers?: (Record<string, string> | null)): string {
  if (headers && headers["Content-Type"])
    return headers["Content-Type"];
  return "application/json";
}

interface Config {
  method?: string;
  body?: BodyInit | Record<string, unknown> | null;
  headers?: Record<string, string>;
  as_raw_stream?: boolean;
}

export async function HttpClient<T = unknown>(
  endpoint: string,
  {
    method,
    body,
    as_raw_stream,
    headers: custom_headers,
    ...custom_config
  }: Config = {}
): Promise<T> {
  const token = localStorage.getItem("access_token");
  const content_type = GetContentType(custom_headers);

  const headers: Record<string, string> = {
    ...(as_raw_stream ? {} : { "Content-Type": content_type }),
    "Accept": "*/*"
  };

  if (token && token.length !== 0)
    headers["X-Authorization"] = token;

  method = method || (body ? "POST" : "GET");

  if (body)
    body = (as_raw_stream ? (body as BodyInit) : JSON.stringify(body));

  const init: RequestInit = {
    ...custom_config,
    method: method,
    body: body,
    headers: {
      ...headers,
      ...custom_headers
    }
  };

  return window
    .fetch(encodeURI(API_DOMAIN + endpoint), init)
    .then((response) => {
      if (response.status >= 200 && response.status < 300) {
        // Return raw stream if content_type isn't application/json
        // or as_raw_stream was set on initial request
        if (as_raw_stream || content_type !== GetContentType(null))
          return response as Response;
        return response.json();
      }

      if (response.status === 401) {
        return new Promise(() => {
          Actions.Logout();
          return response;
        });
      }

      return Promise.reject(response);
    })
    .catch((error) => Promise.reject(error));
}