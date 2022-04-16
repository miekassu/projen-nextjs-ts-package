import { cdk } from 'projen';

const project = new cdk.JsiiProject({
  name: '@miekassu/projen-nextjs-ts-package',
  author: 'Kasper H',
  authorAddress: 'kasper.hamalainen@gmail.com',
  defaultReleaseBranch: 'main',
  repositoryUrl: 'https://github.com/miekassu/projen-nextjs-ts-package.git',
  projenrcTs: true,
  description: 'Projen project type for NextJS TypeScript project.',
  releaseToNpm: true,
  depsUpgrade: false,
  stale: false,

  deps: ['projen'],
  peerDeps: [
    'projen',
  ],
  // description: undefined,  /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],             /* Build dependencies for this module. */
  // packageName: undefined,  /* The "name" in package.json. */
});

project.synth();