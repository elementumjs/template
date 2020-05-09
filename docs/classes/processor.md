
# Class: Processor

Processor class interprets a template, renders, and updates its slots into a
provided container. It checks if the template has not rendered yet into the
container and inject it into the container. If it is already rendered,
iterates over its slots and checks if they have changed to update them.

## Hierarchy

* **Processor**

## Index

### Constructors

* [constructor](processor.md#constructor)

### Properties

* [container](processor.md#container)
* [template](processor.md#template)

### Methods

* [commitNode](processor.md#commitnode)
* [render](processor.md#render)

## Constructors

###  constructor

\+ **new Processor**(`template`: [Template](template.md), `container`: HTMLElement): *[Processor](processor.md)*

Processor constructor receives the template to process and the container
where it will be rendered.
{@link HTMLElement}.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`template` | [Template](template.md) | The template to process. |
`container` | HTMLElement | The container to render the template.  |

**Returns:** *[Processor](processor.md)*

## Properties

###  container

• **container**: *HTMLElement*

___

###  template

• **template**: *[Template](template.md)*

## Methods

###  commitNode

▸ **commitNode**(`node`: HTMLElement | Node, `slotIndex`: number): *void*

commitNode gets the slot referenced by the index and compares its value
with the target node value. If its not equal, the target node will be
updated.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`node` | HTMLElement &#124; Node | The target node of the slot. |
`slotIndex` | number | The index of the slot referenced.  |

**Returns:** *void*

___

###  render

▸ **render**(): *void*

render checks if the template is already rendered into the container
after injecting it. If it was rendered, it iterates over template slots
to render them. If it was not rendered, it appends the template to the
container.

**Returns:** *void*
