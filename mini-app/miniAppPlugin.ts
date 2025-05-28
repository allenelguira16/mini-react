import babel from "vite-plugin-babel";

import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";
import { NodePath } from "@babel/core";

export const miniAppBabelPlugin = declare((api) => {
  api.assertVersion(7);

  function isMapCall(callee: t.Node | null | undefined): boolean {
    if (!callee) return false;
    return (
      (t.isMemberExpression(callee) || t.isOptionalMemberExpression(callee)) &&
      t.isIdentifier(callee.property, { name: "map" })
    );
  }

  function injectWarn(
    path: NodePath<t.CallExpression | t.OptionalCallExpression>
  ) {
    const { line, column } = path.node.loc?.start ?? { line: "?", column: "?" };

    // Create an arrow function expression:
    // (() => {
    //   console.warn("[mini-solid] ⚠️ Detected .map() inside JSX at line ..., column ....");
    //   return ORIGINAL_MAP_CALL;
    // })()

    const originalCall = path.node;

    const warnStatement = t.expressionStatement(
      t.callExpression(
        t.memberExpression(t.identifier("console"), t.identifier("warn")),
        [
          t.stringLiteral(
            `[mini-solid] ⚠️ Detected .map() inside JSX at line ${line}, column ${column}. Consider using <For> for more efficient rendering.`
          ),
        ]
      )
    );

    const iife = t.callExpression(
      t.arrowFunctionExpression(
        [],
        t.blockStatement([warnStatement, t.returnStatement(originalCall)])
      ),
      []
    );

    path.replaceWith(iife);
    path.skip();
  }

  return {
    name: "mini-solid",
    visitor: {
      JSXExpressionContainer(path) {
        const expr = path.node.expression;

        // Skip empty expressions
        if (t.isJSXEmptyExpression(expr)) return;

        // For JSX children, always wrap
        path.node.expression = t.arrowFunctionExpression([], expr);

        // Traverse and inject .map() warnings with IIFE
        path.traverse({
          CallExpression(innerPath) {
            if (isMapCall(innerPath.node.callee)) {
              injectWarn(innerPath);
              innerPath.skip();
            }
          },
          OptionalCallExpression(innerPath) {
            if (isMapCall(innerPath.node.callee)) {
              injectWarn(innerPath);
              innerPath.skip();
            }
          },
        });
      },
    },
  };
});

// Vite Plugin
const miniAppPlugin = ({ importSource }: { importSource: string }) =>
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
      plugins: [miniAppBabelPlugin],
      sourceMaps: true, // generate external source map files
    },
    filter: /\.(t|j)sx?$/, // make sure Babel runs on TSX files too
  });

export default miniAppPlugin;
