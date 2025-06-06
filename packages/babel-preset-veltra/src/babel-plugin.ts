import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";
import { wrapExpressionInArrow } from "./utils";
import { NodePath, PluginPass } from "@babel/core";

const veltraImports = new Set<string>();

function handleImports(path: NodePath<t.Program>, state: PluginPass) {
  const isInVeltraApp = state.filename && state.filename.includes("veltra-app");
  if (isInVeltraApp) return;

  let hasMemoImport = false;
  let hasCleanLogImport = false;

  path.traverse({
    ImportDeclaration(importPath) {
      const importSource = importPath.node.source.value;

      if (importSource === "@veltra/app") {
        importPath.node.specifiers.forEach((specifier) => {
          if (t.isImportSpecifier(specifier)) {
            let importedName = "";
            if (t.isIdentifier(specifier.imported)) {
              importedName = specifier.imported.name;
            } else if (t.isStringLiteral(specifier.imported)) {
              importedName = specifier.imported.value;
            }

            const localName = specifier.local.name; // ← actual used name (could be aliased)

            if (importedName === "loop") {
              veltraImports.add(localName); // ← this could now be "loop" or "looper" or any alias
            }
          }
        });

        const specifiers = importPath.node.specifiers;

        const hasMemo = specifiers.some(
          (s) =>
            t.isImportSpecifier(s) &&
            t.isIdentifier(s.imported, { name: "memo" })
        );

        const hasCleanLog = specifiers.some(
          (s) =>
            t.isImportSpecifier(s) &&
            t.isIdentifier(s.imported, { name: "cleanLog" })
        );

        if (!hasMemo) {
          specifiers.push(
            t.importSpecifier(t.identifier("memo"), t.identifier("memo"))
          );
        }
        if (!hasCleanLog) {
          specifiers.push(
            t.importSpecifier(
              t.identifier("cleanLog"),
              t.identifier("cleanLog")
            )
          );
        }

        hasMemoImport = hasMemoImport || hasMemo;
        hasCleanLogImport = hasCleanLogImport || hasCleanLog;
      }
    },
  });

  if (!hasMemoImport) {
    path.node.body.unshift(
      t.importDeclaration(
        [t.importSpecifier(t.identifier("memo"), t.identifier("memo"))],
        t.stringLiteral("@veltra/app")
      )
    );
  }

  if (!hasCleanLogImport) {
    path.node.body.unshift(
      t.importDeclaration(
        [t.importSpecifier(t.identifier("cleanLog"), t.identifier("cleanLog"))],
        t.stringLiteral("@veltra/app")
      )
    );
  }
}

function handleCallExpression(path: NodePath<t.CallExpression>) {
  const callee = path.node.callee;

  // Check for console.* calls
  const isConsole =
    t.isMemberExpression(callee) &&
    t.isIdentifier(callee.object, { name: "console" });

  if (isConsole) {
    path.node.arguments = path.node.arguments.map((arg) => {
      if (t.isJSXElement(arg) || t.isJSXFragment(arg)) {
        return t.callExpression(t.identifier("cleanLog"), [arg]);
      }
      return arg;
    });
    return;
  }

  // Handle loop().each()
  if (
    t.isCallExpression(path.node) &&
    t.isIdentifier(path.node.callee) &&
    veltraImports.has(path.node.callee.name) // check for ANY valid imported alias
  ) {
    const binding = path.scope.getBinding(path.node.callee.name);

    if (
      binding &&
      binding.path.isImportSpecifier() &&
      binding.path.parentPath &&
      binding.path.parentPath.isImportDeclaration()
    ) {
      const importDecl = binding.path.parentPath.node;

      if (importDecl.source.value === "@veltra/app") {
        const arg = path.node.arguments[0];
        if (!t.isFunction(arg) && t.isExpression(arg)) {
          path.node.arguments[0] = t.arrowFunctionExpression([], arg);
        }
      }
    }
  }
}

function handleJSXExpressionContainer(
  path: NodePath<t.JSXExpressionContainer>
) {
  const expr = path.node.expression;

  // Handle cond && <JSXElement>
  if (
    t.isLogicalExpression(expr) &&
    expr.operator === "&&" &&
    t.isJSXElement(expr.right)
  ) {
    const jsxElement = expr.right;
    const scopePath = path.findParent((p) => p.isProgram() || p.isFunction());
    const varName = path.scope.generateUidIdentifier("memoized");

    const memoizedVar = t.variableDeclaration("const", [
      t.variableDeclarator(
        varName,
        t.callExpression(t.identifier("memo"), [
          t.arrowFunctionExpression([], jsxElement),
        ])
      ),
    ]);

    if (scopePath) {
      if (scopePath.isProgram()) {
        scopePath.unshiftContainer("body", memoizedVar);
      } else if (
        scopePath.isFunctionDeclaration() ||
        scopePath.isFunctionExpression() ||
        scopePath.isArrowFunctionExpression()
      ) {
        const bodyPath = scopePath.get("body");
        if (Array.isArray(bodyPath)) {
          const firstBody = bodyPath[0];
          if (firstBody && firstBody.isBlockStatement()) {
            firstBody.unshiftContainer("body", memoizedVar);
          }
        } else if (bodyPath.isBlockStatement()) {
          bodyPath.unshiftContainer("body", memoizedVar);
        }
      }
    }

    path.node.expression = t.arrowFunctionExpression(
      [],
      t.logicalExpression("&&", expr.left, t.callExpression(varName, []))
    );

    return;
  }

  // Wrap other non-JSX expressions
  if (
    !t.isJSXEmptyExpression(expr) &&
    !t.isJSXElement(expr) &&
    !t.isJSXFragment(expr)
  ) {
    path.node.expression = wrapExpressionInArrow(expr);
  }
}

function handleJSXAttribute(path: NodePath<t.JSXAttribute>) {
  const attr = path.node;

  // Handle ref
  if (
    t.isJSXIdentifier(attr.name, { name: "ref" }) &&
    t.isJSXExpressionContainer(attr.value)
  ) {
    const expression = attr.value.expression;
    if (t.isIdentifier(expression)) {
      const param = t.identifier("el");
      const body = t.assignmentExpression("=", expression, param);
      attr.value.expression = t.arrowFunctionExpression([param], body);
    }
  }

  // Wrap JSXElement or JSXFragment in attributes
  if (
    t.isJSXExpressionContainer(attr.value) &&
    (t.isJSXElement(attr.value.expression) ||
      t.isJSXFragment(attr.value.expression))
  ) {
    attr.value.expression = t.arrowFunctionExpression(
      [],
      attr.value.expression
    );
  }
}

function handleLoopJSXExpression(path: NodePath<t.JSXExpressionContainer>) {
  const expr = path.node.expression;

  if (
    t.isCallExpression(expr) && // loop().each()
    t.isMemberExpression(expr.callee) &&
    t.isCallExpression(expr.callee.object) &&
    t.isIdentifier(expr.callee.object.callee) &&
    veltraImports.has(expr.callee.object.callee.name) && // imported loop alias
    t.isIdentifier(expr.callee.property, { name: "each" })
  ) {
    const scopePath = path.findParent((p) => p.isProgram() || p.isFunction());
    const varName = path.scope.generateUidIdentifier("looped");

    // Wrap in memo(() => ...)
    const memoCall = t.callExpression(t.identifier("memo"), [
      t.arrowFunctionExpression([], expr),
    ]);

    const loopedVar = t.variableDeclaration("const", [
      t.variableDeclarator(varName, memoCall),
    ]);

    // Hoist to the top of the scope
    if (scopePath) {
      if (scopePath.isProgram()) {
        scopePath.unshiftContainer("body", loopedVar);
      } else if (
        scopePath.isFunctionDeclaration() ||
        scopePath.isFunctionExpression() ||
        scopePath.isArrowFunctionExpression()
      ) {
        const bodyPath = scopePath.get("body");

        if (Array.isArray(bodyPath)) {
          bodyPath.forEach((p) => {
            if (p.isBlockStatement()) {
              p.unshiftContainer("body", loopedVar);
            }
          });
        } else if (bodyPath.isBlockStatement()) {
          bodyPath.unshiftContainer("body", loopedVar);
        }
      }
    }

    // Replace JSX expression with looped()
    path.node.expression = t.callExpression(varName, []);
  }
}

export const babelPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    name: "veltra-plugin-babel",
    visitor: {
      Program(path, state) {
        handleImports(path, state);
      },
      JSXExpressionContainer(path) {
        handleLoopJSXExpression(path);
        handleJSXExpressionContainer(path);
      },
      JSXAttribute(path) {
        handleJSXAttribute(path);
      },
      CallExpression(path) {
        handleCallExpression(path);
      },
    },
  };
});
