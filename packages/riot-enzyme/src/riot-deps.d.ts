declare module 'riot-compiler' {
  function compile(src: string, userOpts?: any): string;
}

declare module 'riot-tmpl' {
  function tmpl(template: string, data: any): any;
  const brackets: any;
}
