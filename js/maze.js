/**
 * Collection of maze-generation algorithms on typed arrays.
 * @namespace
 */
var Maze = {
    /** @const */
    DIRS: [
        {x:  0, y: -1},
        {x:  1, y:  0},
        {x:  0, y:  1},
        {x: -1, y:  0}
    ],
    /**
     * @returns {Array} a copy of a random direction ordering
     */
    dirs: function() {
        return Maze.shuffle(Maze.DIRS.slice(0));
    }
};

/**
 * @param {Array} array
 * @returns {Array} array
 */
Maze.shuffle = function(array) {
    var counter = array.length, temp, index;
    while (counter > 0) {
        index = Math.floor(Math.random() * counter);
        counter--;
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;
};

/**
 * @param {number} x
 * @param {number} y
 * @param {number} w
 * @param {number} h
 * @returns {boolean} true if (x, y) falls within [0, w) and [0, h).
 */
Maze.inBounds = function(x, y, w, h) {
    return x >= 0 && x < w && y >= 0 && y < h;
};

/**
 * @returns {number} the flat index for (x, y) on a (w, h) grid
 */
Maze.i = function(x, y, w, h) {
    return y * w + x;
};

/**
 * @param {number} w
 * @param {number} h
 * @param {number} value
 * @returns {Uint32Array} filled with value
 */
Maze.filled = function(w, h, value) {
    if (value == null) value = 1;
    var array = new Uint32Array(w * h);
    for (var i = 0; i < array.length; i++) array[i] = value;
    return array;
};

/**
 * Generate a random maze using Kruskal's algorithm. Kruskal mazes
 * have a much higher branching factor than DFS mazes, making them a
 * lot more interesting for this project.
 * @param {number} w maze width
 * @param {number} h maze height
 * @returns {Uint32Array} with walls as 1 and open space as 0
 */
Maze.kruskal = function(w, h) {
    var maze = Maze.filled(w, h),
        cells = {}, walls = [], wall = null;
    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            if ((y % 2) === 0 && (x % 2) === 0) {
                maze[Maze.i(x, y, w, h)] = 0;
                cells[[x, y]] = new Forest();
            } else if ((y % 2) === 0 && (x % 2) === 1) {
                wall = {x: x, y: y, dx: 1, dy: 0};
                walls.push(wall);
            } else if ((y % 2) === 1 && (x % 2) === 0) {
                wall = {x: x, y: y, dx: 0, dy: 1};
                walls.push(wall);
            }
        }
    }
    Maze.shuffle(walls);
    while (walls.length > 0) {
        wall = walls.pop();
        var a = cells[[ wall.dx + wall.x,  wall.dy + wall.y]],
            b = cells[[-wall.dx + wall.x, -wall.dy + wall.y]];
        if (!a.equals(b)) {
            a.merge(b);
            maze[Maze.i(wall.x, wall.y, w, h)] = 0;
        }
    }
    return maze;
};

/**
 * Generate a maze using a random depth-first search.
 * @param {number} w maze width
 * @param {number} h maze height
 * @returns {Uint32Array} with walls as 1 and open space as 0
 */
Maze.dfs = function(w, h) {
    var maze = Maze.filled(w, h),
        stack = [{x: 0, y: 0, dirs: Maze.dirs()}];
    while (stack.length > 0) {
        var top = stack[stack.length - 1];
        if (top.dirs.length === 0) {
            stack.pop();
        } else {
            var dir = top.dirs.pop(),
                xx  = top.x + dir.x * 1,
                yy  = top.y + dir.y * 1,
                xxx = top.x + dir.x * 2,
                yyy = top.y + dir.y * 2;
            if (Maze.inBounds(xx, yy, w, h)) {
                if (maze[Maze.i(xxx, yyy, w, h)] === 1) {
                    maze[Maze.i(xx, yy, w, h)] = 0;
                    maze[Maze.i(xxx, yyy, w, h)] = 0;
                    stack.push({x: xxx, y: yyy, dirs: Maze.dirs()});
                }
            }
        }
    }
    return maze;
};
