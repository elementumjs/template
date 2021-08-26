# Module: common

## Table of contents

### Variables

- [openHint](common.md#openhint)

### Functions

- [endAttrParser](common.md#endattrparser)
- [escapePart](common.md#escapepart)
- [isEndMark](common.md#isendmark)
- [markGenerator](common.md#markgenerator)
- [startAttrParser](common.md#startattrparser)

## Variables

### openHint

• `Const` **openHint**: `string` = `"<"`

openHint the initial character of a HTMLElement string
representation. It allows to find the correct position into a string part for
a start [Slot](../classes/slot.Slot.md) mark.

#### Defined in

[src/lib/common.ts:6](https://github.com/elementumjs/template/blob/ef55a53/src/lib/common.ts#L6)

## Functions

### endAttrParser

▸ `Const` **endAttrParser**(`part`): `string`

endAttrParser function parses a part string like the end of an HTML attribute
representation. If the provided part is not an attribute, it returns `null`.
Else, returns the attribute content suffix.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `part` | `string` | The part to parse. |

#### Returns

`string`

- The result of the parse process.

#### Defined in

[src/lib/common.ts:76](https://github.com/elementumjs/template/blob/ef55a53/src/lib/common.ts#L76)

___

### escapePart

▸ `Const` **escapePart**(`part`): `string`

escapePart return an escaped version of the provided string to use it into a
RegExp definition without special characters errors.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `part` | `string` | The string part to escape. |

#### Returns

`string`

- The escaped part string.

#### Defined in

[src/lib/common.ts:40](https://github.com/elementumjs/template/blob/ef55a53/src/lib/common.ts#L40)

___

### isEndMark

▸ `Const` **isEndMark**(`node`): `boolean`

isEndMark function checks if the provided node (Node or the string
definition) matches with the [Slot](../classes/slot.Slot.md) endMark, generated using
[markGenerator](common.md#markgenerator) with [openHint](common.md#openhint) as argument.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `node` | `string` \| `Node` | The target of the test. |

#### Returns

`boolean`

- The test result.

#### Defined in

[src/lib/common.ts:29](https://github.com/elementumjs/template/blob/ef55a53/src/lib/common.ts#L29)

___

### markGenerator

▸ `Const` **markGenerator**(`hint?`): `string`

markGenerator function returns a Comment string definition
with the slot mark content as value.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `hint` | `any` | Content to place into the mark. By default {@link endHint}. |

#### Returns

`string`

#### Defined in

[src/lib/common.ts:20](https://github.com/elementumjs/template/blob/ef55a53/src/lib/common.ts#L20)

___

### startAttrParser

▸ `Const` **startAttrParser**(`part`): `string`[]

startAttrParser function parses a part string like the start of an HTML
attribute string representation. If the provided part is not an attribute,
it returns `null`. Else, returns a the name of the attribute and the prefix
part from its content.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `part` | `string` | The part to parse. |

#### Returns

`string`[]

- The result of the parse process.

#### Defined in

[src/lib/common.ts:58](https://github.com/elementumjs/template/blob/ef55a53/src/lib/common.ts#L58)
