var Maze = {
    DIRS: [
        {x:  0, y: -1},
        {x:  1, y:  0},
        {x:  0, y:  1},
        {x: -1, y:  0}
    ],
    dirs: function() {
        return Maze.shuffle(Maze.DIRS.slice(0));
    }
};

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

Maze.inBounds = function(x, y, w, h) {
    return x >= 0 && x < w && y >= 0 && y < h;
};

Maze.i = function(x, y, w, h) {
    return y * w + x;
};

Maze.kruskal = function(w, h) {
    var maze = new Uint32Array(w * h);
    return maze;
};

Maze.dfs = function(w, h) {
    var maze = new Uint32Array(w * h),
        stack = [{x: 0, y: 0, dirs: Maze.dirs()}];
    for (var i = 0; i < maze.length; i++) maze[i] = 1;
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
