import { NodePath, PluginObj } from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

type Metadata = {
  loopLocalNames: Set<string>;
};

/**
 * babel plugin to wrap jsx expressions except loop
 *
 * @param api - The babel api.
 * @returns The babel options.
 */
export const wrapJSXExpressionsPlugin = declare((api): PluginObj => {
  api.assertVersion(7);

  return {
    name: "wrap-jsx-expressions-except-loop",

    pre() {
      const meta = this.file.metadata as Partial<Metadata>;
      meta.loopLocalNames = new Set();
    },

    visitor: {
      ImportDeclaration(path, state) {
        const meta = state.file.metadata as Metadata;
        if (path.node.source.value === "@veltra/app") {
          for (const specifier of path.node.specifiers) {
            if (
              t.isImportSpecifier(specifier) &&
              t.isIdentifier(specifier.imported, { name: "loop" })
            ) {
              meta.loopLocalNames.add(specifier.local.name); // handles alias
            }
          }
        }
      },

      JSXExpressionContainer(path: NodePath<t.JSXExpressionContainer>, state) {
        const meta = state.file.metadata as Metadata;
        const loopLocalNames = meta.loopLocalNames ?? new Set();

        const expr = path.get("expression");

        if (t.isJSXEmptyExpression(expr.node)) return;

        if (isLoopCallOrEach(expr.node, loopLocalNames)) {
          return;
        }

        // 4. Wrap in arrow function
        path.node.expression = t.arrowFunctionExpression([], expr.node);
      },
    },
  };
});

/**
 * Detects:
 * - loop(...)
 * - loop(...).each(...)
 */
function isLoopCallOrEach(node: t.Expression, loopNames: Set<string>): boolean {
  // match loop(...)
  if (t.isCallExpression(node) && t.isIdentifier(node.callee) && loopNames.has(node.callee.name)) {
    return true;
  }

  // match loop(...).each(...)
  if (
    t.isCallExpression(node) && // outer .each(...)
    t.isMemberExpression(node.callee) &&
    t.isCallExpression(node.callee.object) &&
    t.isIdentifier(node.callee.object.callee) &&
    loopNames.has(node.callee.object.callee.name)
  ) {
    return true;
  }

  return false;
}
