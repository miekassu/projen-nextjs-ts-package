const { cdk } = require("projen");
const project = new cdk.JsiiProject({
  author: "Kasper",
  authorAddress: "kasper.hamalainen@gmail.com",
  defaultReleaseBranch: "main",
  name: "projen-nextjs-ts-package",
  repositoryUrl: "https://github.com/kasper.hamalainen/projen-nextjs-ts-package.git",

  // deps: [],                /* Runtime dependencies of this module. */
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});
project.synth();