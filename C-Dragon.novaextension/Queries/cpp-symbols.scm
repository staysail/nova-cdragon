; TODO: argument queries, clean up constant queries
;
((function_definition
  ((function_declarator declarator: (_) @name))) @subtree
  (#set! role function-or-method)
)

; (((function_definition declarator: (_) @name) @subtree) (#set! role function-or-method))

; you might be thinking... what? well, we need to pick out multiple pointer dereference types
; single pointer return
((function_definition
  (pointer_declarator (function_declarator declarator: (identifier) @name))
 ) @subtree
  (#set! role function)
)
; also reference returns
((function_definition
  (reference_declarator (function_declarator declarator: (identifier) @name))
 ) @subtree
  (#set! role function)
)

; double pointer return (e.g. int **f())
(
  (function_definition
    (pointer_declarator (pointer_declarator (function_declarator declarator: (identifier) @name)))
  ) @subtree
  (#set! role function)
)

; triple pointer return (e.g. int ***f()) you sick b*st*rd
(
  (function_definition
    (pointer_declarator (pointer_declarator (pointer_declarator (function_declarator declarator: (identifier) @name))))
  ) @subtree
  (#set! role function)
)

; quadruple pointer return (e.g. int ****f()) -- now you're just being obnoxious
; this is as far as we will go - if you need more than that, you need a better editor, or more likely a better brain
(
  (function_definition
    (pointer_declarator (pointer_declarator (pointer_declarator (pointer_declarator (function_declarator declarator: (identifier) @name)))))
  ) @subtree
  (#set! role function)
;   (#set! arguments.query "c-arguments.scm")
)

((_ declarator: (type_identifier) @name) @subtree (#set! role type))

; struct specifier is a struct definition only if it has a body
; we are not symbolicating anonymous structs yet (not sure how they would be useful)
((struct_specifier name: (type_identifier) @name body: (field_declaration_list)) @subtree (#set! role struct))

((class_specifier name: (type_identifier) @name body: (field_declaration_list)) @subtree (#set! role class))

((enum_specifier name: (type_identifier) @name body: (enumerator_list)) @subtree (#set! role enum))

((enum_specifier (enumerator_list (enumerator name:(identifier) @name) @subtree (#set! role enum-member))))

((union_specifier name: (type_identifier) @name body: (field_declaration_list)) @subtree (#set! role union))

((comment) @subtree (#set! role comment))

(((declaration declarator: (identifier) @name) @subtree (#set! role variable)))
(((parameter_declaration declarator: (identifier) @name) @subtree (#set! role variable)))
(((init_declarator declarator: (identifier) @name) @subtree (#set! role variable)))
(((pointer_declarator declarator: (identifier) @name) @subtree (#set! role variable)))
(((array_declarator declarator: (identifier) @name) @subtree (#set! role variable)))
(((reference_declarator (identifier) @name) @subtree (#set! role variable)))
(((_ declarator: (field_identifier) @name) @subtree (#set! role property)))

; preprocessor queries
((preproc_def name: (identifier) @name) @subtree (#set! role constant))
((preproc_function_def name: (identifier) @name) @subtree (#set! role function))

((namespace_definition name: (identifier) @name) @subtree (#set! role package))
