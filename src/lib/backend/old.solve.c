#include "emscripten.h"

#include <stdio.h>
#include <stdlib.h>
#include "search.h"

EMSCRIPTEN_KEEPALIVE
extern int solve(int argc, char **argv)
{

    // EM_ASM is a macro to call in-line JavaScript code.
    EM_ASM(
        // Make a directory other than '/'
        FS.mkdir('/cache');

        // Then mount with IDBFS type
        FS.mount(IDBFS, {}, '/cache');

        // Then populate the in-memory filesystem from IndexedDB one
        FS.syncfs(true, (error) => {
          assert(!error)
        });
    );

    if (argc > 1) {
        char patternized[64];
        char* facelets = argv[1];

        if (argc > 2) {
            patternize(facelets, argv[2], patternized);
            facelets = patternized;
        }

        char *sol = solution(
            facelets,
            24,
            1000,
            0,
            "/cache"
        );

        // Sync in-memory filesystem offline to IndexedDB
        EM_ASM(
          FS.syncfs((error) => {
            assert(!error)
          })
        );

        if (sol == NULL) {
            puts("Unsolvable cube!");
            return 2;
        }

        puts(sol);
        free(sol);
        return 0;
    }
    
    else {
        return 1;
    }
}
