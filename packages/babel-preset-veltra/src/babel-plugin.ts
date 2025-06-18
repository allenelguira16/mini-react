// import { declare } from "@babel/helper-plugin-utils";
// import * as t from "@babel/types";
// import { wrapExpressionInArrow } from "./utils";
// import { NodePath, PluginPass } from "@babel/core";

// const veltraImports = new Set<string>();
// const importedNames = new Map<string, string>(); // importedName -> localName
// let shouldInjectLoop = false;
// let shouldInjectCleanLog = false;

// function handleImports(path: NodePath<t.Program>, state: PluginPass) {
//   const isInVeltraApp = state.filename && state.filename.includes("veltra-app");
//   if (isInVeltraApp) return;

//   path.traverse({
//     ImportDeclaration(importPath) {
//       const importSource = importPath.node.source.value;

//       if (importSource === "@veltra/app") {
//         importPath.node.specifiers.forEach((specifier) => {
//           if (t.isImportSpecifier(specifier)) {
//             const imported = specifier.imported.name;
//             const local = specifier.local.name;
//             importedNames.set(imported, local);
//             if (imported === "loop" || imported === "cleanLog") {
//               veltraImports.add(local); // marks both loop & cleanLog as from @veltra/app
//             }
//           }
//         });
//       }
//     },
//   });
// }

// function injectMissingImports(path: NodePath<t.Program>, state: PluginPass) {
//   const isInVeltraApp = state.filename && state.filename.includes("veltra-app");
//   if (isInVeltraApp) return; // 🚫 Don't inject inside @veltra/app itself

//   if (!importedNames.has("loop") && shouldInjectLoop) {
//     const loopImport = t.importDeclaration(
//       [t.importSpecifier(t.identifier("loop"), t.identifier("loop"))],
//       t.stringLiteral("@veltra/app")
//     );
//     path.node.body.unshift(loopImport);
//   }

//   if (!importedNames.has("cleanLog") && shouldInjectCleanLog) {
//     const cleanLogImport = t.importDeclaration(
//       [t.importSpecifier(t.identifier("cleanLog"), t.identifier("cleanLog"))],
//       t.stringLiteral("@veltra/app") // now from @veltra/app as per your fix
//     );
//     path.node.body.unshift(cleanLogImport);
//   }
// }

// function handleCallExpression(path: NodePath<t.CallExpression>) {
//   const callee = path.node.callee;

//   const isConsole =
//     t.isMemberExpression(callee) &&
//     t.isIdentifier(callee.object, { name: "console" });

//   if (isConsole) {
//     shouldInjectCleanLog = true;

//     const cleanLogName = importedNames.get("cleanLog") || "cleanLog";

//     path.node.arguments = path.node.arguments.map((arg) => {
//       if (t.isJSXElement(arg) || t.isJSXFragment(arg)) {
//         return t.callExpression(t.identifier(cleanLogName), [arg]);
//       }
//       return arg;
//     });
//     return;
//   }

//   // handle loop direct call e.g., loop(items)
//   if (
//     t.isCallExpression(path.node) &&
//     t.isIdentifier(path.node.callee) &&
//     veltraImports.has(path.node.callee.name)
//   ) {
//     const arg = path.node.arguments[0];
//     if (!t.isFunction(arg) && t.isExpression(arg)) {
//       path.node.arguments[0] = t.arrowFunctionExpression([], arg);
//     }
//   }
// }

// function handleJSXExpressionContainer(
//   path: NodePath<t.JSXExpressionContainer>
// ) {
//   const expr = path.node.expression;

//   if (
//     !t.isJSXEmptyExpression(expr) &&
//     !t.isJSXElement(expr) &&
//     !t.isJSXFragment(expr)
//   ) {
//     path.node.expression = wrapExpressionInArrow(expr);
//   }
// }

// function handleJSXAttribute(path: NodePath<t.JSXAttribute>) {
//   const attr = path.node;

//   if (
//     t.isJSXIdentifier(attr.name, { name: "ref" }) &&
//     t.isJSXExpressionContainer(attr.value)
//   ) {
//     const expression = attr.value.expression;
//     if (t.isIdentifier(expression)) {
//       const param = t.identifier("el");
//       const body = t.assignmentExpression("=", expression, param);
//       attr.value.expression = t.arrowFunctionExpression([param], body);
//     }
//   }

//   if (
//     t.isJSXExpressionContainer(attr.value) &&
//     (t.isJSXElement(attr.value.expression) ||
//       t.isJSXFragment(attr.value.expression))
//   ) {
//     attr.value.expression = t.arrowFunctionExpression(
//       [],
//       attr.value.expression
//     );
//   }
// }

// function handleLoopJSXExpression(path: NodePath<t.JSXExpressionContainer>) {
//   const expr = path.node.expression;

//   if (
//     t.isCallExpression(expr) &&
//     t.isMemberExpression(expr.callee) &&
//     t.isCallExpression(expr.callee.object) &&
//     t.isIdentifier(expr.callee.object.callee)
//   ) {
//     const loopCalleeName = expr.callee.object.callee.name;
//     if (
//       importedNames.get("loop") === loopCalleeName ||
//       loopCalleeName === "loop"
//     ) {
//       const arg = expr.callee.object.arguments[0];
//       if (!t.isArrowFunctionExpression(arg) && t.isExpression(arg)) {
//         expr.callee.object.arguments[0] = t.arrowFunctionExpression([], arg);
//       }
//     }
//   }
// }

// function transformArrayMapToLoop(path: NodePath<t.JSXExpressionContainer>) {
//   const expr = path.node.expression;

//   if (
//     t.isCallExpression(expr) &&
//     t.isMemberExpression(expr.callee) &&
//     t.isIdentifier(expr.callee.property, { name: "map" }) &&
//     expr.arguments.length === 1 &&
//     t.isFunction(expr.arguments[0])
//   ) {
//     const callbackFn = expr.arguments[0];
//     const arrayExpr = expr.callee.object;

//     const params = callbackFn.params;
//     const [itemParam, indexParam] = params as t.Identifier[];

//     const callbackBody = t.isBlockStatement(callbackFn.body)
//       ? callbackFn.body
//       : t.blockStatement([t.returnStatement(callbackFn.body)]);

//     // if index exists, wrap its usage in `.value`
//     if (indexParam) {
//       const indexName = indexParam.name;
//       t.traverseFast(callbackBody, (node) => {
//         if (t.isIdentifier(node, { name: indexName })) {
//           // Replace index usage with index.value unless part of MemberExpression property
//           if (
//             !t.isMemberExpression(node.parent) ||
//             node.parent.property !== node
//           ) {
//             Object.assign(
//               node,
//               t.memberExpression(t.identifier(indexName), t.identifier("value"))
//             );
//           }
//         }
//       });
//     }

//     const loopLocal = importedNames.get("loop") || "loop";
//     const loopCall = t.callExpression(t.identifier(loopLocal), [arrayExpr]);
//     const eachCall = t.memberExpression(loopCall, t.identifier("each"));
//     const eachFn = t.arrowFunctionExpression(params, callbackBody);

//     path.node.expression = t.callExpression(eachCall, [eachFn]);
//     shouldInjectLoop = true;
//   }
// }

// function handleDirectLoopCall(path: NodePath<t.JSXExpressionContainer>) {
//   const expr = path.node.expression;

//   if (
//     t.isCallExpression(expr) &&
//     t.isIdentifier(expr.callee) &&
//     veltraImports.has(expr.callee.name)
//   ) {
//     const arg = expr.arguments[0];

//     if (!t.isArrowFunctionExpression(arg) && t.isExpression(arg)) {
//       expr.arguments[0] = t.arrowFunctionExpression([], arg);
//     }
//   }
// }

// function handleLoopCallExpression(path: NodePath<t.CallExpression>) {
//   const { node } = path;

//   // Check if it's loop()
//   if (t.isIdentifier(node.callee) && veltraImports.has(node.callee.name)) {
//     const arg = node.arguments[0];
//     if (!t.isArrowFunctionExpression(arg) && t.isExpression(arg)) {
//       // WRAP the loop argument with arrow function
//       node.arguments[0] = t.arrowFunctionExpression([], arg);
//     }
//   }
// }

// export const babelPlugin = declare((api) => {
//   api.assertVersion(7);

//   return {
//     name: "veltra-plugin-babel",
//     visitor: {
//       Program: {
//         enter(path, state) {
//           handleImports(path, state);
//         },
//         exit(path, state) {
//           injectMissingImports(path, state);
//         },
//       },
//       JSXExpressionContainer(path) {
//         handleDirectLoopCall(path);
//         handleLoopJSXExpression(path);
//         transformArrayMapToLoop(path);
//         handleJSXExpressionContainer(path);
//       },
//       JSXAttribute(path) {
//         handleJSXAttribute(path);
//       },
//       CallExpression(path) {
//         handleLoopCallExpression(path);
//         handleCallExpression(path);
//       },
//     },
//   };
// });
