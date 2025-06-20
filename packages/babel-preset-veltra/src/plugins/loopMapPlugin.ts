import { NodePath } from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

export const loopMapPlugin = declare((api) => {
  api.assertVersion(7);
  return {
    visitor: {
      Program(path, state) {
        const filename = state.filename || "";

        // Skip transforming files from Veltra's own source or installed package
        if (
          filename.includes("/veltra-router/") ||
          filename.includes("\\veltra-router\\") || // local dev
          filename.includes("/veltra-app/") ||
          filename.includes("\\veltra-app\\") || // local dev
          filename.includes("/node_modules/@veltra/app/") ||
          filename.includes("\\node_modules\\@veltra\\app\\") // package
        ) {
          return;
        }

        let hasLoop = false;

        path.get("body").forEach((child) => {
          if (
            child.isImportDeclaration() &&
            child.node.source.value === "@veltra/app"
          ) {
            child.node.specifiers.forEach((spec) => {
              if (t.isImportSpecifier(spec)) {
                const imported = spec.imported;
                if (t.isIdentifier(imported)) {
                  if (imported.name === "loop") hasLoop = true;
                }
              }
            });
          }
        });

        const newImports: t.ImportSpecifier[] = [];
        if (!hasLoop)
          newImports.push(
            t.importSpecifier(t.identifier("loop"), t.identifier("loop"))
          );

        if (newImports.length) {
          const importDecl = t.importDeclaration(
            newImports,
            t.stringLiteral("@veltra/app")
          );
          path.unshiftContainer("body", importDecl);
        }
      },

      JSXExpressionContainer(path) {
        const expr = path.get("expression");

        function transformMap(
          exprPath: NodePath<t.Expression | t.JSXEmptyExpression>
        ): t.CallExpression | null {
          const node = exprPath.node;
          if (
            t.isCallExpression(node) &&
            t.isMemberExpression(node.callee) &&
            t.isIdentifier(node.callee.property) &&
            node.callee.property.name === "map"
          ) {
            const mapFn = node.arguments[0];
            const arrExpr = node.callee.object;

            if (
              t.isArrowFunctionExpression(mapFn) &&
              mapFn.params.length >= 2
            ) {
              const indexParam = mapFn.params[1];
              if (t.isIdentifier(indexParam)) {
                t.traverseFast(mapFn.body, (n) => {
                  if (t.isIdentifier(n) && n.name === indexParam.name) {
                    const memberExpr = t.memberExpression(
                      t.identifier(indexParam.name),
                      t.identifier("value")
                    );
                    Object.assign(n, memberExpr);
                  }
                });
              }
            }

            return t.callExpression(
              t.memberExpression(
                t.callExpression(t.identifier("loop"), [
                  t.arrowFunctionExpression([], arrExpr),
                ]),
                t.identifier("each")
              ),
              [mapFn as t.Expression]
            );
          }
          return null;
        }

        function handleExpression(
          exprPath: NodePath<t.Expression | t.JSXEmptyExpression>
        ) {
          const node = exprPath.node;

          if (t.isLogicalExpression(node)) {
            const right = exprPath.get("right") as NodePath<
              t.Expression | t.JSXEmptyExpression
            >;
            const transformedRight = transformMap(right);
            if (transformedRight) {
              right.replaceWith(transformedRight);
            }
          } else if (t.isConditionalExpression(node)) {
            const consequent = exprPath.get("consequent") as NodePath<
              t.Expression | t.JSXEmptyExpression
            >;
            const alternate = exprPath.get("alternate") as NodePath<
              t.Expression | t.JSXEmptyExpression
            >;

            const transformedCons = transformMap(consequent);
            const transformedAlt = transformMap(alternate);

            if (transformedCons) {
              consequent.replaceWith(transformedCons);
            }
            if (transformedAlt) {
              alternate.replaceWith(transformedAlt);
            }
          } else {
            const transformed = transformMap(exprPath);
            if (transformed) {
              exprPath.replaceWith(transformed);
            }
          }
        }

        handleExpression(expr);
      },
    },
  };
});
