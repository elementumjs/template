import { Template } from './lib/template';
import { Processor } from './lib/processor';

export const TemplateClass = Template;
export const html = (strings: TemplateStringsArray, ...args: Array<any>) => new Template(strings.raw.slice(0), args);
export const render = (template: Template, container: HTMLElement) => new Processor(template, container).render();