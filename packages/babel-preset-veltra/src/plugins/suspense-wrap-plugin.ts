import { NodePath } from "@babel/core";
import { declare } from "@babel/helper-plugin-utils";
import * as t from "@babel/types";

export const suspenseWrapPlugin = declare((api) => {
  api.assertVersion(7);

  return {
    visitor: {
      Program(path) {
        let suspenseNames = new Set<string>(["Suspense"]);

        // Detect imported Suspense aliases
        path.traverse({
          ImportDeclaration(importPath) {
            if (importPath.node.source.value === "@veltra/app") {
              importPath.node.specifiers.forEach((spec) => {
                if (
                  t.isImportSpecifier(spec) &&
                  t.isIdentifier(spec.imported) &&
                  spec.imported.name === "Suspense"
                ) {
                  suspenseNames.add(spec.local.name);
                }
              });
            }
          },
        });

        path.traverse({
          JSXElement(jsxPath: NodePath<t.JSXElement>) {
            const openingElement = jsxPath.node.openingElement;

            if (
              t.isJSXIdentifier(openingElement.name) &&
              suspenseNames.has(openingElement.name.name)
            ) {
              const children = jsxPath.node.children;

              if (children.length === 0) return;

              // If the first child is already an expression container, skip
              if (t.isJSXExpressionContainer(children[0])) return;

              // Wrap original children in a Fragment inside an ExpressionContainer
              const wrappedExpression = t.jSXExpressionContainer(
                t.jSXFragment(t.jSXOpeningFragment(), t.jSXClosingFragment(), children),
              );

              // Replace all children with single wrapped fragment
              jsxPath.node.children = [wrappedExpression];
            }
          },
        });
      },
    },
  };
});
