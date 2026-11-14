---
title: "Arch Madness"
date: 2026-05-01
platform: Jane Street Puzzles
puzzle_url: "https://www.janestreet.com/puzzles/arch-madness-solution/"
---

The puzzle is built around placing quarter-circle arcs on a 9x9 grid to form connected regions, where each region's score equals its area, meaning cell count, multiplied by its piece count, meaning number of arcs. The goal is to satisfy row and column sum constraints, where each row and column sum is the total of scores from every region touching it. The final answer is the sum of all squared row sums plus all squared column sums.

My solution produced 12 regions, with the most structurally significant being Region 3, which had a score of 288 from area 18 and 16 pieces. This region spanned a large portion of the board and contributed its score to multiple rows and columns at once, so I treated it as the natural anchor for the configuration.

Rather than reasoning about arc placements purely by hand, I built a custom interactive visualizer in JavaScript. It performed live region detection with connected-component analysis on arc entry and exit pairs, recomputed all 12 region scores after every arc change, and displayed current row and column sums alongside the puzzle's hint targets in real time. The arc validity counter flagged geometrically illegal connections and acted as a constant sanity check during backtracking.

Once all 12 regions were valid and all hint constraints were satisfied, I verified the final answer manually. The row sums were 733, 197, 715, 779, 534, 1618, 592, 1052, and 851, giving a squared sum of 6,778,613. The column sums were 482, 281, 823, 1359, 1512, 775, 801, 548, and 490, giving 6,904,269. The combined final answer is 13,682,882.
