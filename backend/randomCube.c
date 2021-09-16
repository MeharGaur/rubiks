#include "emscripten.h"

#include <time.h>
#include <string.h>
#include <assert.h>
#include <stdio.h>
#include <stdlib.h>
#include "facecube.h"
#include "cubiecube.h"
#include "coordcube.h"


/* Returns an integer in the range [0, n).
 *
 * Uses rand(), and so is affected-by/affects the same seed.
 */
int randint(int n) {
  if ((n - 1) == RAND_MAX) {
    return rand();
  } 
  else {
    // Supporting larger values for n would requires an even more
    // elaborate implementation that combines multiple calls to rand()
    assert (n <= RAND_MAX);

    // Chop off all of the values that would cause skew...
    int end = RAND_MAX / n; // truncate skew
    assert (end > 0);
    end *= n;

    // ... and ignore results from rand() that fall above that limit.
    // (Worst case the loop condition should succeed 50% of the time,
    // so we can expect to bail out of this loop pretty quickly.)
    int r;
    while ((r = rand()) >= end);

    return r % n;
  }
}



/** 
 * Generates a random cube. 
 * @return A random cube in the string representation. Each cube in the possible cube space has the same probability.
 */
EMSCRIPTEN_KEEPALIVE
extern const char* randomCube() {
  srand(time(NULL)); // Initialization, should only be called once.

  cubiecube_t* cubiecube = (cubiecube_t*) calloc(1, sizeof(cubiecube_t));
  
  setFlip(cubiecube, randint(N_FLIP - 1));
  setTwist(cubiecube, randint(N_TWIST - 1));

  while (1)
  {
    setURFtoDLB(cubiecube, randint(N_URFtoDLB - 1));
    setURtoBR(cubiecube, randint(N_URtoBR - 1));

    if ( (edgeParity(cubiecube) ^ cornerParity(cubiecube)) == 0 ) {
      break;
    }
  }

  facecube_t* facecube = (facecube_t *) calloc(1, sizeof(facecube_t));
  facecube = toFaceCube(cubiecube);

  char* result = "";

  to_String(facecube, result);

  free(cubiecube);
  free(facecube);

  return result;
  
}



