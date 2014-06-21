/*global State */

function Grid(w, h, s) {
    this.w = w; this.h = h; this.s = s || 8;
    this.done = false;
    this.age = 0;
    this.fore = new Uint32Array(w * h);
    this.back = new Uint32Array(w * h);
    this.fillMaze();
}

Grid.DIRS = [
    {x:  0, y: -1},
    {x:  1, y:  0},
    {x:  0, y:  1},
    {x: -1, y:  0}
];

Grid.shuffle = function(array) {
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

Grid.prototype.fillMaze = function() {
    /* Temporary remove foreground buffer. */
    var fore = this.fore;
    this.fore = this.back;

    function fresh() { return Grid.shuffle(Grid.DIRS.slice(0)); };
    var stack = [{x: 0, y: 0, dirs: fresh()}];
    while (stack.length > 0) {
        var top = stack[stack.length - 1];
        if (top.dirs.length === 0) {
            stack.pop();
        } else {
            var dir = top.dirs.pop();
            var xx  = top.x + dir.x * 1,
                yy  = top.y + dir.y * 1,
                xxx = top.x + dir.x * 2,
                yyy = top.y + dir.y * 2;
            if (this.inBounds(xx, yy) && this.get(xxx, yyy) === State.WALL) {
                this.set(xx, yy, State.OPEN);
                this.set(xxx, yyy, State.OPEN);
                stack.push({x: xxx, y: yyy, dirs: fresh()});
            }
        }
    }
    this.set(0, 0, State.OPEN);

    this.set(0, 0, State.BEGIN);
    this.set(this.w - 1, this.h - 1, State.END);

    /* Restore and swap into place. */
    this.fore = fore;
    this.swap();
};

Grid.prototype.swap = function() {
    var tmp = this.fore;
    this.fore = this.back;
    this.back = tmp;
    return this;
};

Grid.prototype.inBounds = function(x, y) {
    return x >= 0 && x < this.w && y >= 0 && y < this.h;
};

Grid.prototype.get = function(x, y) {
    if (this.inBounds(x, y)) {
        return this.fore[y * this.w + x];
    } else {
        return State.WALL;
    }
};

Grid.prototype.set = function(x, y, value) {
    this.back[y * this.w + x] = value;
    return value;
};

Grid.prototype.step = function(count) {
    count = count || 1;
    var states = [null, null, null, null];
    while (count-- > 0 && !this.done) {
        this.age++;
        var changes = 0;
        for (var y = 0; y < this.h; y++) {
            for (var x = 0; x < this.w; x++) {
                states[0] = this.get(x + 0, y + -1); // N
                states[1] = this.get(x + 1, y +  0); // E
                states[2] = this.get(x + 0, y +  1); // S
                states[3] = this.get(x +-1, y +  0); // W
                var current = this.get(x, y),
                    next = State.next(current, states);
                if (current !== next) changes++;
                this.set(x, y, next);
            }
        }
        this.swap();
        if (changes === 0) this.done = true;
    }
    return this;
};

Grid.prototype.draw = function(canvas) {
    var w = this.w, h = this.h, s = this.s;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = 'purple';
    ctx.fillRect(0, 0, w * s, h * s); // debug
    for (var y = 0; y < this.h; y++) {
        for (var x = 0; x < this.w; x++) {
            ctx.fillStyle = State.color(this.get(x, y));
            ctx.fillRect(s * x, s * y, s, s);
        }
    }
    return this;
};

Grid.prototype.animate = function(canvas) {
    var _this = this;
    window.setTimeout(function() {
        if (!_this.done) {
            _this.step().draw(canvas);
        }
        _this.animate(canvas);
    }, 50);
    return this;
};
