# WebGL Shortest Path Solver

Finds the shortest path on a grid using a GPU with WebGL. It uses a
12-state cellular automata to search all known branches in parallel.
The automata is described entirely in `state.js`, a pure JavaScript
implementation of the solver.

* [Online Demo](http://skeeto.github.io/webgl-path-solver/)
* [A GPU Approach to Path Finding](http://nullprogram.com/blog/2014/06/22)

![](http://nullprogram.com/img/path/maze.gif)
