import { html } from "../template";
import { Processor } from '../lib/processor';

test("Processor.render", () => {
    const emptyContainer = document.createElement('container');
    const processor = new Processor(html`<p>${'Test'}</p>`, emptyContainer);
    processor.render();
    expect(emptyContainer.innerHTML).toBe('<p><!--1-->Test<!-----></p>');

    processor.template = html`<p>${'Ey!'}</p>`;
    processor.render();
    expect(emptyContainer.innerHTML).toBe('<p><!--1-->Ey!<!-----></p>');
});