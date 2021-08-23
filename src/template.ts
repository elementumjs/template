import { Template } from './lib/template';
import { Processor } from './lib/processor';

const html = (
        strings: TemplateStringsArray, 
        ...args: Array<any>
    ) => new Template(strings.raw.slice(0), args);

const render = (
        template: Template, 
        container: HTMLElement
    ) => new Processor(template, container).render();

export { Template, html, render };