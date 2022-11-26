; This set of queries is a starting point.
; Improvements to it from C++ Gurus would be apprecated.
"break" @keyword.condition
"case" @keyword.condition
"catch" @keyword.condition
"class" @keyword.construct
"concept" @keyword
"const" @keyword.modifier
"continue" @keyword.condition
"co_return" @keyword.control
"co_yield" @keyword.control
"decltype" @keyword
"default" @keyword.condition
"delete" @keyword
"do" @keyword.condition
"else" @keyword.condition
"enum" @keyword.construct
"extern" @keyword.modifier
"explicit" @keyword.modifier
"for" @keyword.condition
"friend" @keyword.modifier
"if" @keyword.condition
"inline" @keyword.modifier
"new" @keyword
"namespace" @keyword
"operator" @keyword
"requires" @keyword
"return" @keyword.control
"sizeof" @keyword
"static" @keyword.modifier
"static_assert" @keyword
"struct" @keyword.construct
"switch" @keyword.condition
"template" @keyword.construct
"throw" @keyword.condition
"try" @keyword.condition
"virtual" @keyword.modifier

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

(this) @keyword.self

[
(true)
(false)
] @value.boolean

[
"and"
"and_eq"
"bitand"
"bitor"
"compl"
"co_await" ; c++-20
"not"
"not_eq"
"or"
"or_eq"
"xor"
"xor_eq"
] @keyword.operator

[
"mutable"
"constexpr"
"constinit"
"consteval"
] @keyword.modifier

; TODO:
; these are missing from the tree-sitter-cpp grammar at present
; "alignas" @keyword
; "alignof" @keyword
; "const_cast" @kyeword.modifier
; "reinterpret_cast" @keyword
; "static_cast" @keyword.modifier
; "wchar_t" @keyword.construct

(auto) @keyword.modifier
(string_literal) @string
(system_lib_string) @string
(null) @value.null
(nullptr) @value.null
(number_literal) @value.number
(char_literal) @value.entity
(storage_class_specifier) @keyword.modifier
(access_specifier) @keyword.modifier
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
(primitive_type) @keyword.construct
(sized_type_specifier) @keyword.modifier
(true) @value.boolean
(false) @value.boolean
(enum_specifier (type_identifier) @identifier.type.enum)
(union_specifier (type_identifier) @identifier.type.union)
(struct_specifier (type_identifier) @identifier.type.struct) @definition.struct
(class_specifier name: (type_identifier) @identifier.type.class) @definition.class
; we want an identifier.type.package
(namespace_definition (identifier) @identifier.type.class) @definition.package

; we would really like a label for this
(statement_identifier) @identifier.constant
(escape_sequence) @string.escape

((identifier) @constant
 (#match? @constant "^[A-Z][A-Z\\d_]*$"))

 ; workaround missing wchar_t in tree-sitter grammar
((type_identifier) @_wchar_t
 (#match? @_wchar_t "wchar_t")) @keyword.construct

(type_identifier) @identifier.type

(identifier) @identifier.variable

(comment) @comment
