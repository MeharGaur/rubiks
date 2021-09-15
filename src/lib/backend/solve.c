#include "emscripten.h"

#include <stdio.h>
#include <stdlib.h>
#include "search.h"

EMSCRIPTEN_KEEPALIVE
extern const char* solve(int argc, char sourceDefinition[54])
{
    printf("Argument: %s \n", sourceDefinition);

    if (argc > 1) {
        char patternized[64];
        // TODO: Add targetDefinition
        // if (argc > 2) {
        //     patternize(sourceDefinition, &argv[2], patternized);
        //     sourceDefinition = patternized;
        // }
        char *sol = solution(
            sourceDefinition,
            24,
            1000,
            0,
            "cache"
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
