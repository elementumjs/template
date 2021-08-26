# Class: Template

[template](../modules/template.md).Template

Template class abstracts the current template strings, args and slots.

## Table of contents

### Constructors

- [constructor](template.Template.md#constructor)

### Properties

- [slots](template.Template.md#slots)
- [strings](template.Template.md#strings)

### Accessors

- [element](template.Template.md#element)
- [html](template.Template.md#html)
- [regexp](template.Template.md#regexp)

### Methods

- [match](template.Template.md#match)
- [prepare](template.Template.md#prepare)
- [toString](template.Template.md#tostring)

## Constructors

### constructor

• **new Template**(`strings`, `values?`)

Creates the [Template](template.Template.md), initializes some internal variables and
starts the building process.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `strings` | `string`[] | `undefined` | The parts of the [Template](template.Template.md). |
| `values` | `any`[] | `[]` | The literal strings values. |

#### Defined in

[src/lib/template.ts:28](https://github.com/elementumjs/template/blob/86af5b9/src/lib/template.ts#L28)

## Properties

### slots

• **slots**: [`Slot`](slot.Slot.md)[]

The list of [Slot](slot.Slot.md)'s of the [Template](template.Template.md).

#### Defined in

[src/lib/template.ts:20](https://github.com/elementumjs/template/blob/86af5b9/src/lib/template.ts#L20)

___

### strings

• **strings**: `string`[]

The parts of the [Template](template.Template.md).

#### Defined in

[src/lib/template.ts:18](https://github.com/elementumjs/template/blob/86af5b9/src/lib/template.ts#L18)

## Accessors

### element

• `get` **element**(): `DocumentFragment`

element returns a generated DocumentFragment element with the template
html definition inside of it.

#### Returns

`DocumentFragment`

The generated HTML element.

#### Defined in

[src/lib/template.ts:109](https://github.com/elementumjs/template/blob/86af5b9/src/lib/template.ts#L109)

___

### html

• `get` **html**(): `string`

html function returns the string definition of the template, including
the [Slot](slot.Slot.md)'s marks (attributes and interpolation marks) and the
value of the [Slot](slot.Slot.md)'s injected.

#### Returns

`string`

The composed html string definition.

#### Defined in

[src/lib/template.ts:75](https://github.com/elementumjs/template/blob/86af5b9/src/lib/template.ts#L75)

___

### regexp

• `Private` `get` **regexp**(): `RegExp`

regexp getter function returns a composed RegExp of the current element
to check if any HTMLElement match with the current [Template](template.Template.md) and
its [Slot](slot.Slot.md) areas.

#### Returns

`RegExp`

- The composed RegExp of the current
[Template](template.Template.md).

#### Defined in

[src/lib/template.ts:42](https://github.com/elementumjs/template/blob/86af5b9/src/lib/template.ts#L42)

## Methods

### match

▸ **match**(`node`): `boolean`

match function test the current [Template.regexp](template.Template.md#regexp) against the
{@link HTMLElement.outerHTML} representation of the HTMLElement
provided as argument.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `Node` \| `HTMLElement` | The target of the test. |

#### Returns

`boolean`

- The result of the test, returns `true` if the
HTMLElement matches.

#### Defined in

[src/lib/template.ts:128](https://github.com/elementumjs/template/blob/86af5b9/src/lib/template.ts#L128)

___

### prepare

▸ `Private` **prepare**(`values`): `void`

prepare functions detect the [Slot](slot.Slot.md)'s in the current template, its
type between interpolation and attribute, and the slot index. Iterates
over the template strings composing each slot.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `values` | `any`[] | The current values of the [Slot](slot.Slot.md)'s |

#### Returns

`void`

#### Defined in

[src/lib/template.ts:139](https://github.com/elementumjs/template/blob/86af5b9/src/lib/template.ts#L139)

___

### toString

▸ **toString**(): `string`

Returns the composed template definition as string.

#### Returns

`string`

The composed html string definition.

#### Defined in

[src/lib/template.ts:118](https://github.com/elementumjs/template/blob/86af5b9/src/lib/template.ts#L118)
