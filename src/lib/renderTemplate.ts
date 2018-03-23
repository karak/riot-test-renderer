import { tmpl } from 'riot-tmpl';

/**
 * Expand template
 *
 * Similar to `riot.render()`, rendering method for SSR.
 *
 */
export default function renderTemplate(this: any, template: string, data: any) {
  return tmpl.apply(this, [template, data]);
}
