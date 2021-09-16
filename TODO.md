# TODO 

## UI and Controls
  - Add solve and scramble buttons to the UI. Use a bottom bar, arrange it like google meet UI
      - Put canvas and ActionBar together in a `<main>` make sure canvas doesn't overlap with ActionBar. Will need to set body background color same as canvas. 
  
  - When you hover over a piece it glows and shows arrows in a tooltip with the directions that you can turn it (3d arrows would be better)

  - When you start turning it the entire layer you are turning glows instead of just the piece

  - Any facelets of the same color beside each other should glow. Make you feel good when you align a new one but bad when you move one and lose glow.

  - When my cursor is over the general scene, then it should be the *4-way arrow* cursor. When I hover over any piece, it switches to the hand *grab* cursor. When I click down on a piece it switches to *grabbing*

  - Use Hammer.js to simplify the touch/mouse event handling and gesture recognition.

  - See how the Google Doodle rubiks cube handles solving and user interaction at the same time. Should user be able to interact in the middle of solving?
      - When cube is solving itself, add a slider to adjust tempo on the fly

