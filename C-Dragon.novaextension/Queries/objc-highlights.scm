"auto" @keyword.modifier
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

[
"@end"
"@import"
"@property"
"@selector"
"@encode"
"@compatibility_alias"
"@synchronized"
"@autoreleasepool"
] @keyword
[
"@interface"
"@implementation"
"@class"
"@protocol"
"@dynamic"
"NS_ENUM"
"NS_ERROR_ENUM"
"NS_OPTIONS"
] @keyword.construct
[
(private)
(protected)
(public)
(package)
] @keyword.modifier

; SIC
(class_interface_attribute_sepcifier) @keyword.modifier
(swift_name_attribute_sepcifier) @keyword.modifier
(availability_attribute_specifier) @keyword.modifier
(method_attribute_specifier) @keyword.modifier
(method_variadic_arguments_attribute_specifier) @keyword.modifier

[
(optional)
(required)
(atomic)
(null_resettable)
(unsafe_unretained)
(null_unspecified)
(direct)
(nonatomic)
(readonly)
(readwrite)
(copy)
(strong)
(weak)
(nullable)
(class)
(setter)
(getter)
(retain)
(assign)
(DISPATCH_QUEUE_REFERENCE_TYPE)
"NS_NOESCAPE"
"_Atomic"
"in"
"@synthesize"
"__attribute__"
"__attribute"
] @keyword.modifier

[
"@try"
"@catch"
"@finally"
"@throw"
] @keyword.control
[
(self)
(super)
] @keyword.self

[
"typeof"
"__typeof"
"__typeof__"
"__builtin_available"
"@available"
"__GENERICS"
] @keyword.operator

"string_literal" @string
"number_literal" @value.number
[
(auto)
(BOOL)
(nonnull)
(instancetype)
(id)
(Method)
(Class)
(SEL)
(IMP)
] @keyword.construct
[
(YES)
(NO)
] @value.boolean
[
"@"
] @operator

"#define" @processing
"#elif" @processing
"#else" @processing
"#endif" @processing
"#if" @processing
"#ifdef" @processing
"#ifndef" @processing
"#include" @processing
"#import" @processing
(preproc_directive) @processing
(pragma) @processing
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
(nil) @value.null
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
  declarator: (identifier) @identifier.function)
(protocol_declaration
  name: (identifier) @identifier.protocol)
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
