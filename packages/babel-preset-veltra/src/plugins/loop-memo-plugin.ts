import { PluginObj } from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";
import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

type Metadata = {
  importedLoops: Set<string>;
  hasMemoImport: boolean;
};

/**
 * babel plugin to wrap loop in memo
 *
 * @param api - The babel api.
 * @returns The babel options.
 */
export const loopMemoPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    name: "wrap-loop-in-memo",

    pre() {
      const meta = this.file.metadata as Partial<Metadata>;
      meta.importedLoops = new Set();
      meta.hasMemoImport = false;
    },

    visitor: {
      Program(path, state) {
        const meta = state.file.metadata as Metadata;

        path.get("body").forEach((child) => {
          if (child.isImportDeclaration() && child.node.source.value === "@veltra/app") {
            for (const spec of child.node.specifiers) {
              if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
                if (spec.imported.name === "loop") {
                  meta.importedLoops.add(spec.local.name);
                }
                if (spec.imported.name === "memo") {
                  meta.hasMemoImport = true;
                }
              }
            }
          }
        });

        // Inject memo import if missing
        if (!meta.hasMemoImport) {
          path.unshiftContainer(
            "body",
            t.importDeclaration(
              [t.importSpecifier(t.identifier("memo"), t.identifier("memo"))],
              t.stringLiteral("@veltra/app"),
            ),
          );
        }
      },

      JSXExpressionContainer(path, state) {
        const meta = state.file.metadata as Metadata;
        const loopNames = meta.importedLoops;
        let replaced = false;

        path.traverse({
          CallExpression(callPath) {
            if (replaced) return;

            const callExpr = callPath.node;

            // Check for loop(...).each(...)
            if (
              t.isMemberExpression(callExpr.callee) &&
              t.isCallExpression(callExpr.callee.object) &&
              t.isIdentifier(callExpr.callee.object.callee) &&
              loopNames.has(callExpr.callee.object.callee.name) &&
              t.isIdentifier(callExpr.callee.property, { name: "each" })
            ) {
              const loopCall = callExpr.callee.object;

              // Wrap loop(data) → loop(() => data)
              const loopArg = loopCall.arguments[0];
              if (loopArg && !t.isArrowFunctionExpression(loopArg) && t.isExpression(loopArg)) {
                loopCall.arguments[0] = t.arrowFunctionExpression([], loopArg);
              }

              // Generate const _memo = memo(() => loop(...).each(...))
              const memoId = path.scope.generateUidIdentifier("loopMemo");
              const memoDecl = t.variableDeclaration("const", [
                t.variableDeclarator(
                  memoId,
                  t.callExpression(t.identifier("memo"), [t.arrowFunctionExpression([], callExpr)]),
                ),
              ]);

              // Hoist to block
              const blockPath = path.findParent(
                (p) => p.isBlockStatement() || p.isProgram(),
              ) as NodePath<t.BlockStatement | t.Program>;
              blockPath.unshiftContainer("body", memoDecl);

              // Replace full expression with _memo()
              callPath.replaceWith(t.callExpression(memoId, []));
              replaced = true;
            }
          },
        });
      },
    },
  } satisfies PluginObj;
});
