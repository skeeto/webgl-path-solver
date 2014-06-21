/*global CpuSolver */

var solver = null;
$(document).ready(function() {
    var canvas = $('#display')[0],
        scale = 2,
        w = Math.floor(canvas.width / scale),
        h = Math.floor(canvas.height / scale),
        maze = Maze.kruskal(w, h);
    solver = new CpuSolver(maze, 511, 255, canvas).draw().animate();
});
