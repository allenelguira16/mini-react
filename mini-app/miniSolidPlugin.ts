import babel from "vite-plugin-babel";

import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

export const miniSolidBabelPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    name: "mini-solid",
    visitor: {
      JSXExpressionContainer(path) {
        const expr = path.node.expression;

        // Skip empty expressions
        if (t.isJSXEmptyExpression(expr)) return;

        // Skip if already a function
        if (t.isFunctionExpression(expr) || t.isArrowFunctionExpression(expr))
          return;

        // JSX attribute case
        if (path.parentPath.isJSXAttribute()) {
          const attributeNameNode = path.parentPath.node.name;

          // If attribute name is an identifier (e.g., onClick, value, etc.)
          if (t.isJSXIdentifier(attributeNameNode)) {
            const name = attributeNameNode.name;

            // Skip if the attribute is an event handler (starts with "on")
            if (name.startsWith("on")) return;
          }

          // For non-event attributes, wrap the expression
          path.node.expression = t.arrowFunctionExpression([], expr);
          return;
        }

        // For JSX children, always wrap
        path.node.expression = t.arrowFunctionExpression([], expr);
      },
    },
  };
});

const miniSolidPlugin = ({ importSource }: { importSource: string }) =>
  babel({
    babelConfig: {
      presets: [
        [
          "@babel/preset-react",
          {
            runtime: "automatic",
            importSource,
          },
        ],
        "@babel/preset-typescript",
      ],
      plugins: [miniSolidBabelPlugin],
    },
    filter: /\.(t|j)sx?$/, // make sure Babel runs on TSX files too
  });

export default miniSolidPlugin;
