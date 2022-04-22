import { cdk } from 'projen';

const project = new cdk.JsiiProject({
  name: '@miekassu/projen-nextjs-ts-package',
  author: 'Kasper Hämäläinen',
  authorAddress: 'kasper.hamalainen@gmail.com',
  defaultReleaseBranch: 'main',
  repositoryUrl: 'https://github.com/miekassu/projen-nextjs-ts-package.git',
  projenrcTs: true,
  description: 'Projen project type for NextJS TypeScript project.',
  depsUpgrade: false,
  stale: false,
  npmDistTag: 'latest',
  npmRegistryUrl: 'https://registry.npmjs.com/',
  projenVersion: '0.54.28',

  deps: [],
  devDeps: ['projen@0.54.28'],
  peerDeps: [
    'projen',
  ],
});

project.synth();