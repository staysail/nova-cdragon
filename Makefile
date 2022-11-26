##
## Makefile for Nova ClangD extension.
## This builds the tree-sitter dynamic libraries for C and C++.
##

EXT_DIR		= ClangD.novaextension
SYNTAX_DIR	= $(EXT_DIR)/Syntaxes
APPBUNDLE	= /Applications/Nova.app
FRAMEWORKS	= "${APPBUNDLE}/Contents/Frameworks/"
CODESIGN	= codesign
CP			= cp

C_SRC_DIR	= tree-sitter-c/src
C_OBJS		= c_parser.o
C_LIBNAME	= libtree-sitter-c.dylib
C_DYLIB		= $(SYNTAX_DIR)/$(C_LIBNAME)

CPP_SRC_DIR	= tree-sitter-cpp/src
CPP_OBJS	= cpp_parser.o cpp_scanner.o
CPP_LIBNAME	= libtree-sitter-cpp.dylib
CPP_DYLIB	= $(SYNTAX_DIR)/$(CPP_LIBNAME)

OSXFLAGS = -arch arm64 -arch x86_64 -mmacosx-version-min=11.6

CFLAGS = -O3 -Wall -Wextra -Wno-unused -Wno-unused-parameter -fPIC
CXXFLAGS = -O3 -Wall -Wextra -Wno-unused -Wno-unused-parameter -fPIC
LDFLAGS=-F${FRAMEWORKS} -framework SyntaxKit -rpath @loader_path/../Frameworks

LINKSHARED := $(LINKSHARED)-dynamiclib -Wl,
LINKSHARED := $(LINKSHARED)-install_name,/lib/$(LIBNAME),-rpath,@executable_path/../Frameworks

all: $(C_DYLIB) $(CPP_DYLIB)

c_%.o: $(C_SRC_DIR)/%.c
	$(CC) $(OSXFLAGS) $(CFLAGS) -I $(C_SRC_DIR) -c -o $@ $<

cpp_%.o: $(CPP_SRC_DIR)/%.c
	$(CC) $(OSXFLAGS) $(CFLAGS) -I $(CPP_SRC_DIR) -c -o $@ $<

cpp_%.o: $(CPP_SRC_DIR)/%.cc
	$(CXX) $(OSXFLAGS) $(CXXFLAGS) -I $(CPP_SRC_DIR) -c -o $@ $<

$(C_DYLIB): $(C_OBJS)
	$(CC) $(OSXFLAGS) -I $(C_SRC_DIR) $(LDFLAGS) $(LINKSHARED) $^ $(LDLIBS) -o $@
	$(CODESIGN) -s - $@

$(CPP_DYLIB): $(CPP_OBJS)
	$(CXX) $(OSXFLAGS) -I $(CPP_SRC_DIR) $(LDFLAGS) $(LINKSHARED) $^ $(LDLIBS) -lc++ -o $@
	$(CODESIGN) -s - $@

clean:
	rm -f $(C_OBJS) $(CPP_OBJS)

clobber: clean
	rm -f $(C_DYLIB) $(CPP_DYLIB)

.PHONY: all install clean
