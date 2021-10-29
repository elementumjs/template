# Class: Slot

[slot](../modules/slot.md).Slot

Slot class abstracts a fillable slot of a template. It will affect to a
HTMLElement as an argument, value or another or anothers
[Template](template.Template.md)'s.

## Table of contents

### Constructors

- [constructor](slot.Slot.md#constructor)

### Properties

- [attr](slot.Slot.md#attr)
- [slotIndex](slot.Slot.md#slotindex)
- [value](slot.Slot.md#value)

### Accessors

- [containsTemplate](slot.Slot.md#containstemplate)
- [isAttr](slot.Slot.md#isattr)
- [stringValue](slot.Slot.md#stringvalue)

### Methods

- [commit](slot.Slot.md#commit)
- [commitAttr](slot.Slot.md#commitattr)
- [commitTemplate](slot.Slot.md#committemplate)
- [commitTemplates](slot.Slot.md#committemplates)
- [commitValue](slot.Slot.md#commitvalue)

## Constructors

### constructor

• **new Slot**(`index`, `value`, `attr?`)

Slot constructor assings the provided arguments to the current instance
properties.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `index` | `number` | The [Slot](slot.Slot.md) index into a [Template](template.Template.md). |
| `value` | `any` | The current [Slot](slot.Slot.md) value. |
| `attr?` | `string` | If the current [Slot](slot.Slot.md) is an attribute of a HTMLElement it defines the attribute name. |

#### Defined in

[src/lib/slot.ts:65](https://github.com/elementumjs/template/blob/7413e6a/src/lib/slot.ts#L65)

## Properties

### attr

• `Optional` **attr**: `string`

If the current [Slot](slot.Slot.md) is an attribute of a HTMLElement it
defines the attribute name.

#### Defined in

[src/lib/slot.ts:20](https://github.com/elementumjs/template/blob/7413e6a/src/lib/slot.ts#L20)

___

### slotIndex

• **slotIndex**: `number`

The [Slot](slot.Slot.md) index into a [Template](template.Template.md).

#### Defined in

[src/lib/slot.ts:15](https://github.com/elementumjs/template/blob/7413e6a/src/lib/slot.ts#L15)

___

### value

• **value**: `any`

The current [Slot](slot.Slot.md) value.

#### Defined in

[src/lib/slot.ts:22](https://github.com/elementumjs/template/blob/7413e6a/src/lib/slot.ts#L22)

## Accessors

### containsTemplate

• `get` **containsTemplate**(): `boolean`

containsTemplate property getter returns a boolean that is `true` if the current
[Slot](slot.Slot.md) value is an instance of a Template.

#### Returns

`boolean`

- The result of the assertion.

#### Defined in

[src/lib/slot.ts:38](https://github.com/elementumjs/template/blob/7413e6a/src/lib/slot.ts#L38)

___

### isAttr

• `get` **isAttr**(): `boolean`

isAttr property getter returns a boolean that is `true` if the current
[Slot](slot.Slot.md) has been parsed as a HTML attribute.

#### Returns

`boolean`

- The result of the assertion.

#### Defined in

[src/lib/slot.ts:29](https://github.com/elementumjs/template/blob/7413e6a/src/lib/slot.ts#L29)

___

### stringValue

• `Private` `get` **stringValue**(): `string`

stringValue property getter returns a string version of the current
[Slot](slot.Slot.md) value.

#### Returns

`string`

- The result of the casting.

#### Defined in

[src/lib/slot.ts:52](https://github.com/elementumjs/template/blob/7413e6a/src/lib/slot.ts#L52)

## Methods

### commit

▸ **commit**(`startMark`): `void`

commit function checks the current [Slot](slot.Slot.md) to decide if it is a HTML
attribute, a interpolation value, another [Template](template.Template.md) or a group of
them, and calls the specific commit function by the detected [Slot](slot.Slot.md)
type. If the [Slot](slot.Slot.md) is a group of {@link Templates} its necessary
to get the end [Slot](slot.Slot.md) mark iterating over the start mark siblings.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `startMark` | `Node` | The start [Slot](slot.Slot.md) mark, generated during the [Template](template.Template.md) creation. |

#### Returns

`void`

#### Defined in

[src/lib/slot.ts:80](https://github.com/elementumjs/template/blob/7413e6a/src/lib/slot.ts#L80)

___

### commitAttr

▸ `Private` **commitAttr**(`node`): `void`

commitAttr function updates the current [Slot](slot.Slot.md) as a HTML attribute
of the provided Node. It checks if the attribute value
is distinct that the new one before update it.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `Node` \| `HTMLElement` | The target Node to update. |

#### Returns

`void`

#### Defined in

[src/lib/slot.ts:120](https://github.com/elementumjs/template/blob/7413e6a/src/lib/slot.ts#L120)

___

### commitTemplate

▸ `Private` **commitTemplate**(`node`, `startMark`, `childTemplate?`): `void`

commitTemplate updates a Node content with the correct
[Template](template.Template.md) instance. If the provided Node is `undefined`,
it will create a new one with the [Template.element](template.Template.md#element). If it is a
[Slot](slot.Slot.md) end mark it will append it before this mark. Lastly, if the
current Node does not match with the new [Template](template.Template.md),
replace it with the new one. Else, updates the [Template](template.Template.md) into the
Node provided.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `Node` | The target Node to update. |
| `startMark` | `Node` | The Comment that references the start of the [Slot](slot.Slot.md). |
| `childTemplate?` | [`Template`](template.Template.md) | - |

#### Returns

`void`

#### Defined in

[src/lib/slot.ts:161](https://github.com/elementumjs/template/blob/7413e6a/src/lib/slot.ts#L161)

___

### commitTemplates

▸ `Private` **commitTemplates**(`nodes`, `startMark`, `endMark`): `void`

commitTemplates function iterates over the [Slot](slot.Slot.md) values as
[Template](template.Template.md)'s and its Node's commiting the changes. If
any Node has not a asigned [Template](template.Template.md) it will be removed.
Else, it calls iteratively [Slot.commitTemplate](slot.Slot.md#committemplate).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `nodes` | `Node`[] | The target Nodes to update. |
| `startMark` | `Node` | The Comment that references the start of the [Slot](slot.Slot.md). |
| `endMark` | `Node` | The Comment that references the end of the [Slot](slot.Slot.md). |

#### Returns

`void`

#### Defined in

[src/lib/slot.ts:185](https://github.com/elementumjs/template/blob/7413e6a/src/lib/slot.ts#L185)

___

### commitValue

▸ `Private` **commitValue**(`node`, `startMark`): `void`

commitValue updates a {@link Node.TEXT_NODE} content with the value
provided as argument. If the provided Node is not created yet,
it will create it before the [Slot](slot.Slot.md) startMark and setted with the
provided value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `Node` | The target Node to update. |
| `startMark` | `Node` | The Comment that references the start of the [Slot](slot.Slot.md). |

#### Returns

`void`

#### Defined in

[src/lib/slot.ts:136](https://github.com/elementumjs/template/blob/7413e6a/src/lib/slot.ts#L136)
