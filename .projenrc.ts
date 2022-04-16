import { cdk } from 'projen';

const project = new cdk.JsiiProject({
  name: '@miekassu/projen-nextjs-ts-package',
  author: 'Kasper H',
  authorAddress: 'kasper.hamalainen@gmail.com',
  defaultReleaseBranch: 'main',
  repositoryUrl: 'https://github.com/miekassu/projen-nextjs-ts-package.git',
  projenrcTs: true,
  description: 'Projen project type for NextJS TypeScript project.',
  depsUpgrade: false,
  stale: false,
  npmDistTag: 'latest',
  npmRegistryUrl: 'https://registry.npmjs.com/',

  deps: [],
  devDeps: ['projen'],
  peerDeps: [
    'projen',
  ],
});

project.synth();