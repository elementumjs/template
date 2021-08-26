# Module: error

## Table of contents

### Classes

- [TemplateError](../classes/error.TemplateError.md)

### Functions

- [InlineFnErr](error.md#inlinefnerr)
- [NotSlotErr](error.md#notsloterr)
- [NotTemplateErr](error.md#nottemplateerr)

## Functions

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

[src/lib/error.ts:63](https://github.com/elementumjs/template/blob/86af5b9/src/lib/error.ts#L63)

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

[src/lib/error.ts:72](https://github.com/elementumjs/template/blob/86af5b9/src/lib/error.ts#L72)

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

[src/lib/error.ts:81](https://github.com/elementumjs/template/blob/86af5b9/src/lib/error.ts#L81)
