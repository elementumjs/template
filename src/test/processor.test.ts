import { html } from "../template";
import { Processor } from '../lib/processor';

test("Processor.render", () => {
    const emptyContainer = document.createElement('container');
    const processor = new Processor(html`<p>${'Test'}</p>`, emptyContainer);
    
    const parentHandler = jest.spyOn(processor.container as any, 'appendChild');
    processor.render();
    expect(emptyContainer.innerHTML).toBe('<p><!--1-->Test<!-----></p>');
    expect(parentHandler).toHaveBeenCalledTimes(1);
    
    processor.template = html`<p>${'Ey!'}</p>`;
    const slotsHandler = jest.spyOn(processor as any, 'getSlots');
    const commitHandler = jest.spyOn(processor.template.slots[0] as any, 'commit');
    processor.render();
    expect(emptyContainer.innerHTML).toBe('<p><!--1-->Ey!<!-----></p>');
    expect(commitHandler).toHaveBeenCalled();
    expect(slotsHandler).toHaveBeenCalled();
});