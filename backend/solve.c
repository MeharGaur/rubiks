#include "emscripten.h"

#include <stdio.h>
#include <stdlib.h>
#include "search.h"

EMSCRIPTEN_KEEPALIVE
extern const char* findSolution(char facelets[54], char destinationFacelets[54])
{
    printf("Arguments: %s, \n %s \n", facelets, destinationFacelets);

    if (facelets && facelets != "\0") {
        char patternized[64];
        // TODO: Add destination facelets (to animate to)
        if (destinationFacelets && destinationFacelets != "\0") {
            patternize(facelets, destinationFacelets, patternized);
            facelets = patternized;
        }
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
