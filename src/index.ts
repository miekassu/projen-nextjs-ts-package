import { Component, javascript, SampleDir, SampleFile, typescript } from 'projen';
import { deepMerge } from 'projen/lib/util';

export interface NextJsCommonProjectOptions {
  /**
   * Assets directory
   *
   * @default "public"
   */
  readonly assetsdir?: string;
}

export interface NextJsTypeScriptProjectOptions extends NextJsCommonProjectOptions, typescript.TypeScriptProjectOptions {
  /**
   * Lock React version to 17.0.2
   *
   * Handy due to the on-going issue where child package peer-dependency resolves wrong @types/react
   *
   * default: true
   */
  readonly lockReactVersion?: boolean;
}

/**
 * Next.js project with TypeScript.
 *
 * @pjid nextjs-ts
 */
export class NextJsTs extends typescript.TypeScriptAppProject {
  /**
   * The directory in which app assets reside.
   */
  public readonly assetsdir: string;

  constructor(options: NextJsTypeScriptProjectOptions) {
    const defaultOptions = {
      srcdir: '.',
      eslint: false,
      minNodeVersion: '14.17.0',
      jest: false,
      tsconfig: {
        include: [
          'next-env.d.ts',
          '**/*.ts',
          '**/*.tsx',
        ],
        exclude: [
          'node_modules',
        ],
        compilerOptions: {
          // required by Next.js
          esModuleInterop: true,
          module: 'CommonJS',
          moduleResolution: javascript.TypeScriptModuleResolution.NODE,
          isolatedModules: true,
          resolveJsonModule: true,
          jsx: javascript.TypeScriptJsxMode.PRESERVE,

          // recommended by Next.js
          allowJs: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true,
          noEmit: true,
          lib: [
            'dom',
            'dom.iterable',
            'esnext',
          ],
          strict: true,
          target: 'es5',
          incremental: true,
        },
      },
    };

    // never generate default TypeScript sample code, since this class provides its own
    super(deepMerge([
      defaultOptions,
      options,
      { sampleCode: false },
    ]) as typescript.TypeScriptProjectOptions);

    this.assetsdir = options.assetsdir ?? 'public';

    new NextComponent(this, {
      typescript: true,
      lockReactVersion: options.lockReactVersion,
    });

    // 'next build' command fails if tsconfig.json is immutable
    if (this.tsconfig) {
      this.tsconfig.file.readonly = false;
    }

    // generate sample code in `pages` and `public` if these directories are empty or non-existent.
    if (options.sampleCode ?? true) {
      new NextSampleCode(this, {
        assetsdir: this.assetsdir,
      });
    }
  }
}

export interface NextComponentOptions {
  /**
   * Whether to apply options specific for TypeScript Next.js projects.
   *
   * @default false
   */
  readonly typescript?: boolean;

  /**
   * Lock React version to 17
   *
   * @default true
   */
  readonly lockReactVersion?: boolean;
}

export class NextComponent extends Component {
  private readonly lockReactVersion: boolean;

  constructor(project: javascript.NodeProject, options: NextComponentOptions) {
    super(project);

    this.lockReactVersion = options.lockReactVersion ?? true;

    if (this.lockReactVersion === false) {
      project.addDeps('next', 'react', 'react-dom');
      project.addDevDeps('@types/react', '@types/react-dom');
    } else {
      project.addDeps('next@12.1.0', 'react@17.0.2', 'react-dom@17.0.2');
      project.addDevDeps('@types/react@17.0.40', '@types/react-dom@17.0.13');
    }


    // NextJS CLI commands, see: https://nextjs.org/docs/api-reference/cli
    project.removeTask('dev');
    project.addTask('dev', {
      description: 'Starts the Next.js application in development mode',
      exec: 'next dev',
    });

    project.compileTask.exec('next build');

    project.removeTask('export');
    project.addTask('export', {
      description: 'Exports the application for production deployment',
      exec: 'next export',
    });

    project.removeTask('server');
    project.addTask('server', {
      description: 'Starts the Next.js application in production mode',
      exec: 'next start',
    });

    project.removeTask('telemetry');
    project.addTask('telemetry', {
      description: 'Checks the status of Next.js telemetry collection',
      exec: 'next telemetry',
    });

    project.npmignore?.exclude('# Next.js', '/.next/');
    project.gitignore.exclude('# Next.js', '/.next/');
  }
}

interface NextSampleCodeOptions {
  /**
   * The directory in which app assets reside.
   */
  readonly assetsdir: string;
}

class NextSampleCode extends Component {
  private readonly fileExt: string;
  private readonly assetsdir: string;

  constructor(project: javascript.NodeProject, options: NextSampleCodeOptions) {
    super(project);

    this.fileExt = 'tsx';
    this.assetsdir = options.assetsdir;

    const indexJs = [
      'import Head from "next/head"',
      '',
      'export default function Home() {',
      '  return (',
      '    <div className="container">',
      '      <Head>',
      '        <title>Create Next App</title>',
      '      </Head>',
      '',
      '      <main>',
      '        <h1 className="title">',
      '          Welcome to <a href="https://nextjs.org">Next.js!</a>',
      '        </h1>',
      '',
      '        <p className="description">',
      '          Get started by editing <code>pages/index.js</code>',
      '        </p>',
      '',
      '        <div className="grid">',
      '          <a href="https://nextjs.org/docs" className="card">',
      '            <h3>Documentation &rarr;</h3>',
      '            <p>Find in-depth information about Next.js features and API.</p>',
      '          </a>',
      '',
      '          <a href="https://nextjs.org/learn" className="card">',
      '            <h3>Learn &rarr;</h3>',
      '            <p>Learn about Next.js in an interactive course with quizzes!</p>',
      '          </a>',
      '',
      '          <a',
      '            href="https://github.com/vercel/next.js/tree/master/examples"',
      '            className="card"',
      '          >',
      '            <h3>Examples &rarr;</h3>',
      '            <p>Discover and deploy boilerplate example Next.js projects.</p>',
      '          </a>',
      '',
      '          <a',
      '            href="https://vercel.com/import?filter=next.js&utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"',
      '            className="card"',
      '          >',
      '            <h3>Deploy &rarr;</h3>',
      '            <p>',
      '              Instantly deploy your Next.js site to a public URL with Vercel.',
      '            </p>',
      '          </a>',
      '        </div>',
      '      </main>',
      '',
      '      <footer>',
      '        <a',
      '          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"',
      '          target="_blank"',
      '          rel="noopener noreferrer"',
      '        >',
      '          Powered by Vercel',
      '          <img src="/vercel.svg" alt="Vercel Logo" className="logo" />',
      '        </a>',
      '      </footer>',
      '',
      '      <style jsx>{`',
      '        .container {',
      '          min-height: 100vh;',
      '          padding: 0 0.5rem;',
      '          display: flex;',
      '          flex-direction: column;',
      '          justify-content: center;',
      '          align-items: center;',
      '        }',
      '',
      '        main {',
      '          padding: 5rem 0;',
      '          flex: 1;',
      '          display: flex;',
      '          flex-direction: column;',
      '          justify-content: center;',
      '          align-items: center;',
      '        }',
      '',
      '        footer {',
      '          width: 100%;',
      '          height: 100px;',
      '          border-top: 1px solid #eaeaea;',
      '          display: flex;',
      '          justify-content: center;',
      '          align-items: center;',
      '        }',
      '',
      '        footer img {',
      '          margin-left: 0.5rem;',
      '        }',
      '',
      '        footer a {',
      '          display: flex;',
      '          justify-content: center;',
      '          align-items: center;',
      '        }',
      '',
      '        a {',
      '          color: inherit;',
      '          text-decoration: none;',
      '        }',
      '',
      '        .title a {',
      '          color: #0070f3;',
      '          text-decoration: none;',
      '        }',
      '',
      '        .title a:hover,',
      '        .title a:focus,',
      '        .title a:active {',
      '          text-decoration: underline;',
      '        }',
      '',
      '        .title {',
      '          margin: 0;',
      '          line-height: 1.15;',
      '          font-size: 4rem;',
      '        }',
      '',
      '        .title,',
      '        .description {',
      '          text-align: center;',
      '        }',
      '',
      '        .description {',
      '          line-height: 1.5;',
      '          font-size: 1.5rem;',
      '        }',
      '',
      '        code {',
      '          background: #fafafa;',
      '          border-radius: 5px;',
      '          padding: 0.75rem;',
      '          font-size: 1.1rem;',
      '          font-family: Menlo, Monaco, Lucida Console, Liberation Mono,',
      '            DejaVu Sans Mono, Bitstream Vera Sans Mono, Courier New, monospace;',
      '        }',
      '',
      '        .grid {',
      '          display: flex;',
      '          align-items: center;',
      '          justify-content: center;',
      '          flex-wrap: wrap;',
      '',
      '          max-width: 800px;',
      '          margin-top: 3rem;',
      '        }',
      '',
      '        .card {',
      '          margin: 1rem;',
      '          flex-basis: 45%;',
      '          padding: 1.5rem;',
      '          text-align: left;',
      '          color: inherit;',
      '          text-decoration: none;',
      '          border: 1px solid #eaeaea;',
      '          border-radius: 10px;',
      '          transition: color 0.15s ease, border-color 0.15s ease;',
      '        }',
      '',
      '        .card:hover,',
      '        .card:focus,',
      '        .card:active {',
      '          color: #0070f3;',
      '          border-color: #0070f3;',
      '        }',
      '',
      '        .card h3 {',
      '          margin: 0 0 1rem 0;',
      '          font-size: 1.5rem;',
      '        }',
      '',
      '        .card p {',
      '          margin: 0;',
      '          font-size: 1.25rem;',
      '          line-height: 1.5;',
      '        }',
      '',
      '        .logo {',
      '          height: 1em;',
      '        }',
      '',
      '        @media (max-width: 600px) {',
      '          .grid {',
      '            width: 100%;',
      '            flex-direction: column;',
      '          }',
      '        }',
      '      `}</style>',
      '',
      '      <style jsx global>{`',
      '        html,',
      '        body {',
      '          padding: 0;',
      '          margin: 0;',
      '          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,',
      '            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,',
      '            sans-serif;',
      '        }',
      '',
      '        * {',
      '          box-sizing: border-box;',
      '        }',
      '      `}</style>',
      '    </div>',
      '  )',
      '}',
      '',
    ];

    const vercelSvg = [
      '<svg width="283" height="64" viewBox="0 0 283 64" fill="none" ',
      '    xmlns="http://www.w3.org/2000/svg">',
      '    <path d="M141.04 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.46 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM248.72 16c-11.04 0-19 7.2-19 18s8.96 18 20 18c6.67 0 12.55-2.64 16.19-7.09l-7.65-4.42c-2.02 2.21-5.09 3.5-8.54 3.5-4.79 0-8.86-2.5-10.37-6.5h28.02c.22-1.12.35-2.28.35-3.5 0-10.79-7.96-17.99-19-17.99zm-9.45 14.5c1.25-3.99 4.67-6.5 9.45-6.5 4.79 0 8.21 2.51 9.45 6.5h-18.9zM200.24 34c0 6 3.92 10 10 10 4.12 0 7.21-1.87 8.8-4.92l7.68 4.43c-3.18 5.3-9.14 8.49-16.48 8.49-11.05 0-19-7.2-19-18s7.96-18 19-18c7.34 0 13.29 3.19 16.48 8.49l-7.68 4.43c-1.59-3.05-4.68-4.92-8.8-4.92-6.07 0-10 4-10 10zm82.48-29v46h-9V5h9zM36.95 0L73.9 64H0L36.95 0zm92.38 5l-27.71 48L73.91 5H84.3l17.32 30 17.32-30h10.39zm58.91 12v9.69c-1-.29-2.06-.49-3.2-.49-5.81 0-10 4-10 10V51h-9V17h9v9.2c0-5.08 5.91-9.2 13.2-9.2z" fill="#000"/>',
      '</svg>',
    ];

    new SampleDir(project, 'pages', {
      files: {
        ['index.' + this.fileExt]: indexJs.join('\n'),
      },
    });

    new SampleDir(project, this.assetsdir, {
      files: {
        'vercel.svg': vercelSvg.join('\n'),
      },
    });

    new SampleFile(project, 'next-env.d.ts', {
      contents: [
        '/// <reference types="next" />',
        '/// <reference types="next/image-types/global" />',
        '// NOTE: This file should not be edited',
        '// see https://nextjs.org/docs/basic-features/typescript for more information.',
        '',
      ].join('\n'),
    });

    new SampleFile(project, 'next.config.js', {
      contents: [
        '/** @type {import(\'next\').NextConfig} */',
        'const nextConfig = {',
        '  reactStrictMode: true,',
        '}',
        '',
        'module.exports = nextConfig',
      ].join('\n'),
    });
  }
}
