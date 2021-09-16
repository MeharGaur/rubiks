#include "emscripten.h"

#include <stdio.h>
#include <stdlib.h>
#include "search.h"

EMSCRIPTEN_KEEPALIVE
extern const char* solve(int argc, char facelets[54])
{
    printf("Argument: %s \n", facelets);

    if (argc > 1) {
        char patternized[64];
        // TODO: Add destination facelets (to animate to)
        // if (argc > 2) {
        //     patternize(facelets, &argv[2], patternized);
        //     facelets = patternized;
        // }
        char *sol = solution(
            facelets,
            24,
            1000,
            0,
            "/"
        );
        
        if (sol == NULL) {
            // TODO: Put some kind of error code so frontend knows it errored
            return "Unsolvable cube!";
        }

        return sol; // memory should be freed for sol lol
    }
    else {
        // TODO: Put some kind of error code so frontend knows it errored
        return "Bruh - no arguments";
    }
}
