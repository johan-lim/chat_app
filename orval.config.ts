import { defineConfig } from "orval";

export default defineConfig({
  api: {
    output: {
      client: "react-query",
      mode: "split",
      target: "src/api/api.ts",
      mock: false,
      prettier: true,
      override: {
        mutator: {
          path: "src/api/api.instance.ts",
          name: "customInstance",
        },
      },
    },
    input: {
      target: "./swagger/swagger.json",
    },
  },
});
