# Class: Processor

[processor](../modules/processor.md).Processor

Processor class interprets a [Template](template.Template.md), renders, and updates its slots
into a provided container Node. It checks if the [Template](template.Template.md) has
not rendered yet into the container and inject it into the container
Node. If it is already rendered, iterates over its [Slot](slot.Slot.md)s and
checks if they have changed to update them.

## Table of contents

### Constructors

- [constructor](processor.Processor.md#constructor)

### Properties

- [container](processor.Processor.md#container)
- [template](processor.Processor.md#template)

### Methods

- [getSlot](processor.Processor.md#getslot)
- [render](processor.Processor.md#render)

## Constructors

### constructor

• **new Processor**(`template`, `container`)

Processor constructor receives the [Template](template.Template.md) to process and the
container where it will be rendered.
HTMLElement.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `template` | [`Template`](template.Template.md) | The [Template](template.Template.md) instance to process. |
| `container` | `Node` \| `HTMLElement` | The container Node to render the [Template](template.Template.md). |

#### Defined in

[src/lib/processor.ts:41](https://github.com/elementumjs/template/blob/86af5b9/src/lib/processor.ts#L41)

## Properties

### container

• **container**: `Node` \| `HTMLElement`

The container Node to render the [Template](template.Template.md).

#### Defined in

[src/lib/processor.ts:31](https://github.com/elementumjs/template/blob/86af5b9/src/lib/processor.ts#L31)

___

### template

• **template**: [`Template`](template.Template.md)

The [Template](template.Template.md) instance to process.

#### Defined in

[src/lib/processor.ts:29](https://github.com/elementumjs/template/blob/86af5b9/src/lib/processor.ts#L29)

## Methods

### getSlot

▸ `Private` **getSlot**(`index`): [`Slot`](slot.Slot.md)

getSlot method iterates over the current template definition
[Slot](slot.Slot.md)'s searching for a [Slot](slot.Slot.md) with the same index that the
provided one.

#### Parameters

| Name | Type |
| :------ | :------ |
| `index` | `number` |

#### Returns

[`Slot`](slot.Slot.md)

- The desired slot.

#### Defined in

[src/lib/processor.ts:53](https://github.com/elementumjs/template/blob/86af5b9/src/lib/processor.ts#L53)

___

### render

▸ **render**(): `void`

render checks if the template is already rendered into the container
after injecting it. If it was rendered, it iterates over template
[Slot](slot.Slot.md)'s to commit them. If it was not rendered, it appends
the [Template](template.Template.md) to the container.

#### Returns

`void`

#### Defined in

[src/lib/processor.ts:76](https://github.com/elementumjs/template/blob/86af5b9/src/lib/processor.ts#L76)
