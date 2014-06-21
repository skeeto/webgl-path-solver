/*global State Maze */

function CpuSolver(maze, w, h, canvas) {
    this.w = w;
    this.h = h;
    this.ctx = canvas == null ? null : canvas.getContext('2d');
    this.done = false;
    this.age = 0;
    this.fore = new Uint32Array(w * h);
    this.back = maze;

    this.set(0, 0, State.BEGIN);
    this.set(this.w - 1, this.h - 1, State.END);
    this.swap();
}

CpuSolver.prototype.swap = function() {
    var tmp = this.fore;
    this.fore = this.back;
    this.back = tmp;
    return this;
};

CpuSolver.prototype.get = function(x, y) {
    if (x >= 0 && x < this.w && y >= 0 && y < this.h) {
        return this.fore[y * this.w + x];
    } else {
        return State.WALL;
    }
};

CpuSolver.prototype.set = function(x, y, value) {
    this.back[y * this.w + x] = value;
    return value;
};

CpuSolver.prototype.step = function(count) {
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

CpuSolver.prototype.draw = function() {
    if (this.ctx == null) return this;
    var w = this.w, h = this.h, ctx = this.ctx,
        sx = Math.floor(ctx.canvas.width / w),
        sy = Math.floor(ctx.canvas.height / h);
    for (var y = 0; y < this.h; y++) {
        for (var x = 0; x < this.w; x++) {
            ctx.fillStyle = State.color(this.get(x, y));
            ctx.fillRect(sx * x, sy * y, sx, sy);
        }
    }
    return this;
};

CpuSolver.prototype.animate = function(canvas) {
    var _this = this;
    window.requestAnimationFrame(function() {
        if (!_this.done) {
            _this.step().draw(canvas);
        }
        _this.animate(canvas);
    });
    return this;
};
