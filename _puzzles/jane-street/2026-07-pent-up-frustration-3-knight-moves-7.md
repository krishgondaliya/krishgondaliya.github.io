---
title: "‘Pent-Up’ Frustration 3 / Knight Moves 7"
date: 2026-07-01
platform: Jane Street Puzzles
puzzle_url: "https://www.janestreet.com/puzzles/pent-up-frustration-3-knight-moves-7-solution/"
---

The puzzle combines three-dimensional knight movement, pentomino tiling, and arithmetic constraints on an 8×8 board divided into 13 regions, consisting of 12 pentominoes and one 2×2 tetromino. Each region contains exactly one tower, represented by an additional unit cube. A knight starts at the bottom-left corner and must visit all 13 towers without revisiting any square. Its movement follows the three-dimensional knight rule, where the absolute coordinate differences must be 0, 1, and 2. The knight maintains a running score that changes on its Nth move: adding N when remaining at the same altitude, multiplying by N when moving upward, and dividing by N when moving downward, provided the division is exact.

My solution approached the puzzle as a constrained graph traversal problem, where each state was defined by the knight's position, current altitude, running score, move number, visited squares, and tower placements. The recorded scores provided checkpoints that significantly reduced the number of possible paths. The first six checkpoints occurred every three moves through move 18, while subsequent checkpoints followed an unknown interval K. By reconciling the arithmetic transitions with the geometric constraints, I established that K = 7, fixing the remaining checkpoints at moves 25, 32, 39, 46, and 53.

The central challenge was ensuring that the knight's movement, tower distribution, and score progression remained consistent simultaneously. I used a computational verification approach to validate the reconstructed path against the three-dimensional movement rule, prevent repeated visits, enforce exact divisibility on downward moves, and ensure that every pentomino region contained exactly one tower. This produced a valid 54-move traversal, with the final move reaching the last remaining tower. The resulting configuration satisfied all recorded score checkpoints and the requirement to visit all 13 towers.

Once the complete path was reconstructed, I calculated the final answer by identifying the nine unvisited squares. For each unvisited square, I summed the recorded scores of its orthogonally adjacent squares that had been visited by the knight. These nine neighbor sums were 44, 574, 1,436, 2,012, 1,646, 1,890, 9,925, 8,392, and 7,690. Their combined total gave the final answer of 33,609.
