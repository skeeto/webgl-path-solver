/*global CpuSolver GpuSolver Maze */

function nearest(dim, scale) {
    var floor = Math.floor(dim / scale);
    return (floor % 2 == 0) ? floor - 1 : floor;
}

var solver = null;
$(document).ready(function() {
    var canvas = $('#display')[0],
        scale = 3,
        w = nearest(canvas.width, scale),
        h = nearest(canvas.height, scale),
        maze = Maze.kruskal(w, h);
    canvas.width = w * scale;
    canvas.height = h * scale;
    solver = new GpuSolver(w, h, maze, canvas).draw().animate();
});
