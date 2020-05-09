
# @elementumjs/template

## Index

### Classes

* [Processor](classes/processor.md)
* [Template](classes/template.md)

### Interfaces

* [Slot](interfaces/slot.md)

### Variables

* [attributeNameAndPrefixRgx](globals.md#const-attributenameandprefixrgx)
* [attributeSufixRgx](globals.md#const-attributesufixrgx)
* [openingHint](globals.md#const-openinghint)

### Functions

* [acceptNode](globals.md#const-acceptnode)
* [markGenerator](globals.md#const-markgenerator)

## Variables

### `Const` attributeNameAndPrefixRgx

• **attributeNameAndPrefixRgx**: *RegExp* = /\s(\S+)\=[\"\']([^\"]*)$/

Regex expressions to detect attributes name and its prefix.

___

### `Const` attributeSufixRgx

• **attributeSufixRgx**: *RegExp* = /^([^\"]*)[\"|\'][\s|\>]/

Regex expressions to catchs the slot attribute sufix.

___

### `Const` openingHint

• **openingHint**: *string* = "<"

openingHint string contains and empty Comment representation.

## Functions

### `Const` acceptNode

▸ **acceptNode**(`node`: Node): *number*

acceptNode its a function to filter Comment nodes with a number as nodeValue.
This kind of Comments represents the template slot marks.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`node` | Node | Node candidate to filter. |

**Returns:** *number*

Returns if node provided is allowed.

___

### `Const` markGenerator

▸ **markGenerator**(`needle`: any): *string*

markGenerator function returns a HTML comment string definition with the slot
mark content as value.

**Parameters:**

Name | Type | Description |
------ | ------ | ------ |
`needle` | any | Content to place into the mark  |

**Returns:** *string*
