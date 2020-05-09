
# Class: Template

Template class abstracts the current template strings, args and slots.

## Hierarchy

* **Template**

## Index

### Constructors

* [constructor](template.md#constructor)

### Properties

* [slots](template.md#slots)
* [strings](template.md#strings)

### Accessors

* [html](template.md#html)

### Methods

* [prepare](template.md#prepare)

## Constructors

###  constructor

\+ **new Template**(`strings`: Array‹string›, `values`: Array‹any›): *[Template](template.md)*

Creates the [Template](template.md), initializes some internal variables and
starts the building process.

**Parameters:**

Name | Type | Default | Description |
------ | ------ | ------ | ------ |
`strings` | Array‹string› | - | The literal string tag strings |
`values` | Array‹any› | [] | The literal string tag args  |

**Returns:** *[Template](template.md)*

## Properties

###  slots

• **slots**: *Array‹[Slot](../interfaces/slot.md)›*

___

###  strings

• **strings**: *Array‹string›*

## Accessors

###  html

• **get html**(): *string*

html function returns the string definition of the template, including
the slots marks (attributes and interpolation marks) and the value of
the slots injected.

**Returns:** *string*

The composed html string definition.

## Methods

###  prepare

▸ **prepare**(`values`: Array‹any›): *void*

prepare functions detect the slots in the current template, its type
between interpolation and attribute, and the slot index. Iterates over
the template strings composing each slot.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`values` | Array‹any› | The current values of the slots  |

**Returns:** *void*
