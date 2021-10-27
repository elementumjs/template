import { html } from "../template";
import { Processor } from '../lib/processor';

test("Processor.render", () => {
    const emptyContainer = document.createElement('container');
    const processor = new Processor(html`<p>${'Test'}</p>`, emptyContainer);
    let commitHandler = jest.spyOn(processor.template.slots[0] as any, 'commit');
    processor.render();
    expect(emptyContainer.innerHTML).toBe('<p><!--1-->Test<!-----></p>');
    expect(commitHandler).toHaveBeenCalledTimes(0);

    processor.template = html`<p>${'Ey!'}</p>`;
    commitHandler = jest.spyOn(processor.template.slots[0] as any, 'commit');
    processor.render();
    expect(emptyContainer.innerHTML).toBe('<p><!--1-->Ey!<!-----></p>');
    expect(commitHandler).toHaveBeenCalled();
});