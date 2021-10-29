# Class: TemplateError

[error](../modules/error.md).TemplateError

TemplateError extends Error to provide custom errors to the library.
It allows to manage the error message easely.

## Hierarchy

- `Error`

  ↳ **`TemplateError`**

## Table of contents

### Constructors

- [constructor](error.TemplateError.md#constructor)

### Properties

- [code](error.TemplateError.md#code)
- [message](error.TemplateError.md#message)
- [metadata](error.TemplateError.md#metadata)
- [name](error.TemplateError.md#name)
- [stack](error.TemplateError.md#stack)
- [EMPTY\_SLOTS](error.TemplateError.md#empty_slots)
- [INLINE\_FN](error.TemplateError.md#inline_fn)
- [NOT\_SLOT](error.TemplateError.md#not_slot)
- [NOT\_TEMPLATE](error.TemplateError.md#not_template)
- [prepareStackTrace](error.TemplateError.md#preparestacktrace)
- [stackTraceLimit](error.TemplateError.md#stacktracelimit)

### Methods

- [captureStackTrace](error.TemplateError.md#capturestacktrace)
- [create](error.TemplateError.md#create)

## Constructors

### constructor

• **new TemplateError**(`message`, `code?`, `metadata?`)

TemplateError constructor method fill the class attributes of a
[TemplateError](error.TemplateError.md).

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `message` | `string` | `undefined` | Human readable error message to throw. |
| `code` | `number` | `-1` | The error code of the error message. |
| `metadata?` | `any` | `undefined` | The error metadata to append to the error as extra data to debug it. |

#### Overrides

Error.constructor

#### Defined in

[src/lib/error.ts:38](https://github.com/elementumjs/template/blob/7413e6a/src/lib/error.ts#L38)

## Properties

### code

• **code**: `number`

The error code of the error message.

#### Defined in

[src/lib/error.ts:17](https://github.com/elementumjs/template/blob/7413e6a/src/lib/error.ts#L17)

___

### message

• **message**: `string`

#### Inherited from

Error.message

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:974

___

### metadata

• **metadata**: `any`

The error metadata to append to the error as extra data to debug it.

#### Defined in

[src/lib/error.ts:19](https://github.com/elementumjs/template/blob/7413e6a/src/lib/error.ts#L19)

___

### name

• **name**: `string`

#### Inherited from

Error.name

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:973

___

### stack

• `Optional` **stack**: `string`

#### Inherited from

Error.stack

#### Defined in

node_modules/typescript/lib/lib.es5.d.ts:975

___

### EMPTY\_SLOTS

▪ `Static` **EMPTY\_SLOTS**: `number` = `4`

#### Defined in

[src/lib/error.ts:28](https://github.com/elementumjs/template/blob/7413e6a/src/lib/error.ts#L28)

___

### INLINE\_FN

▪ `Static` **INLINE\_FN**: `number` = `1`

#### Defined in

[src/lib/error.ts:22](https://github.com/elementumjs/template/blob/7413e6a/src/lib/error.ts#L22)

___

### NOT\_SLOT

▪ `Static` **NOT\_SLOT**: `number` = `2`

#### Defined in

[src/lib/error.ts:24](https://github.com/elementumjs/template/blob/7413e6a/src/lib/error.ts#L24)

___

### NOT\_TEMPLATE

▪ `Static` **NOT\_TEMPLATE**: `number` = `3`

#### Defined in

[src/lib/error.ts:26](https://github.com/elementumjs/template/blob/7413e6a/src/lib/error.ts#L26)

___

### prepareStackTrace

▪ `Static` `Optional` **prepareStackTrace**: (`err`: `Error`, `stackTraces`: `CallSite`[]) => `any`

#### Type declaration

▸ (`err`, `stackTraces`): `any`

Optional override for formatting stack traces

**`see`** https://v8.dev/docs/stack-trace-api#customizing-stack-traces

##### Parameters

| Name | Type |
| :------ | :------ |
| `err` | `Error` |
| `stackTraces` | `CallSite`[] |

##### Returns

`any`

#### Inherited from

Error.prepareStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:11

___

### stackTraceLimit

▪ `Static` **stackTraceLimit**: `number`

#### Inherited from

Error.stackTraceLimit

#### Defined in

node_modules/@types/node/globals.d.ts:13

## Methods

### captureStackTrace

▸ `Static` **captureStackTrace**(`targetObject`, `constructorOpt?`): `void`

Create .stack property on a target object

#### Parameters

| Name | Type |
| :------ | :------ |
| `targetObject` | `object` |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

Error.captureStackTrace

#### Defined in

node_modules/@types/node/globals.d.ts:4

___

### create

▸ `Static` **create**(`code`, `metadata?`): [`TemplateError`](error.TemplateError.md)

create function a error by its code. Gets the error message from
{@link ERROR_MESSAGES}.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `code` | `number` | The numeric identifier of the error. |
| `metadata?` | `any` | Extra data to append to the error to debug it. |

#### Returns

[`TemplateError`](error.TemplateError.md)

- The created error.

#### Defined in

[src/lib/error.ts:54](https://github.com/elementumjs/template/blob/7413e6a/src/lib/error.ts#L54)
