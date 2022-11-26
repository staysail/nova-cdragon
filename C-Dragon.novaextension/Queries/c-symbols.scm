; TODO: argument queries, clean up constant queries
;
((function_definition
  ((function_declarator declarator: (identifier) @name))) @subtree
  (#set! role function)
)

; you might be thinking... what? well, we need to pick out multiple pointer dereference types
; single pointer return
((function_definition
  (pointer_declarator (function_declarator declarator: (identifier) @name))
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

((type_definition declarator: (type_identifier) @name) @subtree (#set! role type))

((struct_specifier name: (type_identifier) @name) @subtree (#set! role struct))

((enum_specifier name: (type_identifier) @name) @subtree (#set! role enum))

((enum_specifier (enumerator_list (enumerator name:(identifier) @name) @subtree (#set! role enum-member))))

((union_specifier name: (type_identifier) @name) @subtree (#set! role union))

((comment) @subtree (#set! role comment))

((((_) declarator: (identifier) @name) @subtree (#set! role variable)))
((((_) declarator: (field_identifier) @name) @subtree (#set! role property)))

; preprocessor queries
((preproc_def name: (identifier) @name) @subtree (#set! role constant))
((preproc_function_def name: (identifier) @name) @subtree (#set! role function))

