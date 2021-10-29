# Module: error

## Table of contents

### Classes

- [TemplateError](../classes/error.TemplateError.md)

### Functions

- [EmptyTemplateSlots](error.md#emptytemplateslots)
- [InlineFnErr](error.md#inlinefnerr)
- [NotSlotErr](error.md#notsloterr)
- [NotTemplateErr](error.md#nottemplateerr)

## Functions

### EmptyTemplateSlots

▸ `Const` **EmptyTemplateSlots**(`metadata?`): [`TemplateError`](../classes/error.TemplateError.md)

EmptyTemplateSlots function creates a [TemplateError](../classes/error.TemplateError.md) using the error
code [TemplateError.EMPTY_SLOTS](../classes/error.TemplateError.md#empty_slots).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `metadata?` | `any` | Extra data to append to the error to debug it. |

#### Returns

[`TemplateError`](../classes/error.TemplateError.md)

- The created error.

#### Defined in

[src/lib/error.ts:93](https://github.com/elementumjs/template/blob/7413e6a/src/lib/error.ts#L93)

___

### InlineFnErr

▸ `Const` **InlineFnErr**(`metadata?`): [`TemplateError`](../classes/error.TemplateError.md)

InlineFnErr function creates a [TemplateError](../classes/error.TemplateError.md) using the error
code [TemplateError.INLINE_FN](../classes/error.TemplateError.md#inline_fn).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `metadata?` | `any` | Extra data to append to the error to debug it. |

#### Returns

[`TemplateError`](../classes/error.TemplateError.md)

- The created error.

#### Defined in

[src/lib/error.ts:66](https://github.com/elementumjs/template/blob/7413e6a/src/lib/error.ts#L66)

___

### NotSlotErr

▸ `Const` **NotSlotErr**(`metadata?`): [`TemplateError`](../classes/error.TemplateError.md)

NotSlotErr function creates a [TemplateError](../classes/error.TemplateError.md) using the error
code [TemplateError.NOT_SLOT](../classes/error.TemplateError.md#not_slot).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `metadata?` | `any` | Extra data to append to the error to debug it. |

#### Returns

[`TemplateError`](../classes/error.TemplateError.md)

- The created error.

#### Defined in

[src/lib/error.ts:75](https://github.com/elementumjs/template/blob/7413e6a/src/lib/error.ts#L75)

___

### NotTemplateErr

▸ `Const` **NotTemplateErr**(`metadata?`): [`TemplateError`](../classes/error.TemplateError.md)

NotTemplateErr function creates a [TemplateError](../classes/error.TemplateError.md) using the error
code [TemplateError.NOT_TEMPLATE](../classes/error.TemplateError.md#not_template).

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `metadata?` | `any` | Extra data to append to the error to debug it. |

#### Returns

[`TemplateError`](../classes/error.TemplateError.md)

- The created error.

#### Defined in

[src/lib/error.ts:84](https://github.com/elementumjs/template/blob/7413e6a/src/lib/error.ts#L84)
