import { Template } from './lib/template';
import { Processor } from './lib/processor';

export const html = (
        strings: TemplateStringsArray, 
        ...args: Array<any>
    ) => new Template([...strings.raw], args);

export const render = (
        template: Template, 
        container: HTMLElement
    ) => new Processor(template, container).render();

export { Template };