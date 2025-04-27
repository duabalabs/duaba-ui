import { IParseServerAPICred } from "@duabalabs/lib-parse";

export const environmentVariables: {
  parseConfig: IParseServerAPICred;
} = {
  parseConfig: {
    serverURL: import.meta.env.VITE_PARSE_SERVER_URL,
    appId: import.meta.env.VITE_PARSE_APP_ID,
    javascriptKey: import.meta.env.VITE_PARSE_JAVASCRIPT_KEY,
  },
};
