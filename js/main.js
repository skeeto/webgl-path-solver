/*global CpuSolver */

var solver = null;
$(document).ready(function() {
    var canvas = $('#display')[0];
    solver = new CpuSolver(511, 255, canvas).draw().animate();
});
