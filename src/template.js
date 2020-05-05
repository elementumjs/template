import Template from './lib/template.js';
import Processor from './lib/processor.js';

export const html = (strings, ...args) => new Template(strings, args);
export const render = (template, container) => new Processor(template, container).render();