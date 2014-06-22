# WebGL Shortest Path Solver

Finds the shortest path on a grid using a GPU with WebGL. It uses a
12-state cellular automata to search all known branches in parallel.
The automata is described entirely in `state.js`, a pure JavaScript
implementation of the solver.

* [Online Demo](http://skeeto.github.io/webgl-path-solver/)
