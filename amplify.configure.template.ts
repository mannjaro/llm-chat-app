import type { ResourcesConfig } from "aws-amplify";
export const config: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: "ap-northeast-1_xxxxx",
      userPoolClientId: "xxxxxxxxxxxx",
    },
  },
};
