SRC_DIR = src/lib/backend/
CKOCIEMBA_SRC = $(SRC_DIR)coordcube.c $(SRC_DIR)cubiecube.c $(SRC_DIR)facecube.c $(SRC_DIR)search.c $(SRC_DIR)prunetable_helpers.c
CKOCIEMBA_INCLUDE = $(SRC_DIR)include

# TODO: add -O3 for proper optimization for prod
CFLAGS = -std=gnu99 -gsource-map --source-map-base /backend/ -s WASM=1 -s ALLOW_MEMORY_GROWTH=1 -s ENVIRONMENT=web -s EXPORTED_FUNCTIONS='["_solve"]' -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap"]' --preload-file src/lib/backend/cache@
# -lidbfs.js

BINDIR = static/backend
BIN = solve.js

solve: 
	mkdir -p $(BINDIR)
	emcc $(CFLAGS) $(CKOCIEMBA_SRC) -I $(CKOCIEMBA_INCLUDE) $(SRC_DIR)solve.c -o $(BINDIR)/$(BIN) 

