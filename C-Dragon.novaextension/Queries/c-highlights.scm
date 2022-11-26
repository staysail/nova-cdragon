"break" @keyword.condition
"case" @keyword.condition
"const" @keyword.modifier
"continue" @keyword.condition
"default" @keyword.condition
"do" @keyword.condition
"else" @keyword.condition
"enum" @keyword.construct
"extern" @keyword.modifier
"for" @keyword.condition
"if" @keyword.condition
"inline" @keyword.modifier
"return" @keyword.control
"sizeof" @keyword
"static" @keyword.modifier
"struct" @keyword.construct
"switch" @keyword.condition
"typedef" @keyword
"union" @keyword.construct
"volatile" @keyword.modifier
"while" @keyword.condition

"#define" @processing
"#elif" @processing
"#else" @processing
"#endif" @processing
"#if" @processing
"#ifdef" @processing
"#ifndef" @processing
"#include" @processing
(preproc_directive) @processing
"--" @operator
"-" @operator
"-=" @operator
"->" @operator
"=" @operator
"!=" @operator
"*" @operator
"&" @operator
"&&" @operator
"+" @operator
"++" @operator
"+=" @operator
"<" @operator
"==" @operator
">" @operator
"||" @operator

"." @delimiter
";" @delimiter

(string_literal) @string
(system_lib_string) @string
(null) @value.null
(number_literal) @value.number
(char_literal) @value.entity
(storage_class_specifier) @keyword.modifier
(type_qualifier) @keyword.modifier
(ms_call_modifier) @keyword.modifier
(ms_pointer_modifier) @keyword.modifier

(call_expression
  function: (identifier) @identifier.function)
(call_expression
  function: (field_expression
	field: (field_identifier) @identifier.function))
(function_declarator
  declarator: (identifier) @function)
(preproc_function_def
  name: (identifier) @function.special)

(field_identifier) @identifier.property
(type_identifier) @identifier.type
(primitive_type) @keyword.construct
(sized_type_specifier) @keyword.modifier
(true) @value.boolean
(false) @value.boolean
(enum_specifier (type_identifier) @identifier.type.enum)
(union_specifier (type_identifier) @identifier.type.union)
(struct_specifier (type_identifier) @identifier.type.struct) @definition.struct

; we would really like a label for this
(statement_identifier) @identifier.constant
(escape_sequence) @string.escape

((identifier) @value.boolean
(#match? @value.boolean "(true|false)"))

((identifier) @constant
 (#match? @constant "^[A-Z][A-Z\\d_]*$"))

(identifier) @identifier.variable

(comment) @comment
