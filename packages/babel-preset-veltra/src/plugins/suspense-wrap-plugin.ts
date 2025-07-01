import { declare } from "@babel/helper-plugin-utils";
import { NodePath } from "@babel/traverse";
import * as t from "@babel/types";

let uid = 0;

export const suspenseWrapPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    name: "suspense-memo-wrapper",
    visitor: {
      Program(programPath) {
        const suspenseNames = new Set<string>(["Suspense"]);
        let hasMemo = false;

        // Detect Suspense and memo imports from @veltra/app
        programPath.traverse({
          ImportDeclaration(importPath) {
            if (importPath.node.source.value === "@veltra/app") {
              for (const spec of importPath.node.specifiers) {
                if (t.isImportSpecifier(spec) && t.isIdentifier(spec.imported)) {
                  if (spec.imported.name === "Suspense") {
                    suspenseNames.add(spec.local.name);
                  }
                  if (spec.imported.name === "memo") {
                    hasMemo = true;
                  }
                }
              }
            }
          },
        });

        // Inject memo import if missing
        if (!hasMemo) {
          programPath.unshiftContainer(
            "body",
            t.importDeclaration(
              [t.importSpecifier(t.identifier("memo"), t.identifier("memo"))],
              t.stringLiteral("@veltra/app"),
            ),
          );
        }

        // Process <Suspense> elements
        programPath.traverse({
          JSXElement(path) {
            const opening = path.node.openingElement;

            // Check if it's a Suspense element
            if (!t.isJSXIdentifier(opening.name)) return;
            if (!suspenseNames.has(opening.name.name)) return;

            // Filter out whitespace-only JSXText
            const children = path.node.children.filter(
              (child) => !t.isJSXText(child) || child.value.trim().length > 0,
            );

            if (children.length === 0) return;

            // Already wrapped? (e.g. {() => ...})
            if (
              children.length === 1 &&
              t.isJSXExpressionContainer(children[0]) &&
              t.isArrowFunctionExpression(children[0].expression)
            ) {
              return;
            }

            // Wrap children in fragment if multiple
            const jsxExpr =
              children.length > 1
                ? t.jsxFragment(t.jsxOpeningFragment(), t.jsxClosingFragment(), children)
                : children[0]!;

            let body: t.Expression;

            if (t.isJSXExpressionContainer(jsxExpr)) {
              if (t.isJSXEmptyExpression(jsxExpr.expression)) return; // Skip invalid case
              body = jsxExpr.expression;
            } else {
              body = t.parenthesizedExpression(jsxExpr as t.JSXElement | t.JSXFragment);
            }

            const arrowFn = t.arrowFunctionExpression([], body);

            // Generate: const memoizedComponentN = memo(() => <...>)
            const memoId = path.scope.generateUidIdentifier(`memoizedComponent${uid++}`);

            const memoDecl = t.variableDeclaration("const", [
              t.variableDeclarator(memoId, t.callExpression(t.identifier("memo"), [arrowFn])),
            ]);

            // Replace children with {() => memoizedComponentN()}
            path.node.children = [
              t.jsxExpressionContainer(t.arrowFunctionExpression([], t.callExpression(memoId, []))),
            ];

            // Hoist memo decl to nearest block or program
            const insertTarget = path.findParent(
              (p): p is NodePath<t.BlockStatement | t.Program> =>
                p.isBlockStatement() || p.isProgram(),
            );

            if (insertTarget) {
              if (insertTarget.isProgram()) {
                (insertTarget as NodePath<t.Program>).unshiftContainer("body", memoDecl);
              } else if (insertTarget.isBlockStatement()) {
                (insertTarget as NodePath<t.BlockStatement>).unshiftContainer("body", memoDecl);
              }
            }
          },
        });
      },
    },
  };
});
