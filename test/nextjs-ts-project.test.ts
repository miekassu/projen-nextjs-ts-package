import { web } from 'projen';
import { synthSnapshot } from 'projen/lib/util/synth';
import { NextJsTs } from '../src';

test('defaults', () => {
  const p = new TestNextJsTs();
  expect(synthSnapshot(p)).toMatchSnapshot();
});

class TestNextJsTs extends NextJsTs {
  constructor(options: Partial<web.NextJsTypeScriptProjectOptions> = {}) {
    super({
      ...options,
      clobber: false,
      name: 'test-nextjs-project',
      defaultReleaseBranch: 'main',
    });
  }
}