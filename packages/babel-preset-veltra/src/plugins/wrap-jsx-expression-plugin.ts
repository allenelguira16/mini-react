import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

// Second plugin: Wrap every JSX expression in arrow function
export const wrapJSXExpressionsPlugin = declare((api) => {
  api.assertVersion(7);
  return {
    visitor: {
      JSXExpressionContainer(path) {
        const expr = path.get("expression");

        // Skip wrapping if it's an empty expression (like in fragments or empty slots)
        if (t.isJSXEmptyExpression(expr.node)) return;

        path.node.expression = t.arrowFunctionExpression([], expr.node);
      },
    },
  };
});
