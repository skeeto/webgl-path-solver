/*global State */

/**
 * Find the shortest path on the CPU using cellular automata (slow!).
 * @param {number} w width
 * @param {number} h height
 * @param {Uint8Array} maze
 * @param {HTMLCanvasElement} [canvas] for drawing progress
 */
function CpuSolver(w, h, maze, canvas) {
    this.w = w;
    this.h = h;
    this.ctx = canvas == null ? null : canvas.getContext('2d');
    this.fore = new Uint32Array(w * h);
    this.done = false;
    this.cancelled = false;
    this.age = 0;
    this.reset(maze);
}

/**
 * Swap the foreground and background buffers.
 * @returns {CpuSolver} this
 */
CpuSolver.prototype.swap = function() {
    var tmp = this.fore;
    this.fore = this.back;
    this.back = tmp;
    return this;
};

/**
 * @param {number} x
 * @param {number} y
 * @returns {number} the state at (x, y) on the foreground buffer
 */
CpuSolver.prototype.get = function(x, y) {
    if (x >= 0 && x < this.w && y >= 0 && y < this.h) {
        return this.fore[y * this.w + x];
    } else {
        return State.WALL;
    }
};

/**
 * Sets the state on the background buffer.
 * @param {number} x
 * @param {number} y
 * @param {number} value
 * @returns {number} value
 */
CpuSolver.prototype.set = function(x, y, value) {
    this.back[y * this.w + x] = value;
    return value;
};

/**
 * Set a new maze to solve, resetting the solver.
 * @param {Uint8Array} maze
 * @returns {CpuSolver} this
 */
CpuSolver.prototype.reset = function(maze) {
    this.back = new Uint8Array(maze);
    this.set(0, 0, State.BEGIN);
    this.set(this.w - 1, this.h - 1, State.END);
    this.swap();
    this.done = false;
    this.cancelled = false;
    this.age = 0;
    return this;
};

/**
 * Take one or more steps towards the solution.
 * @param {number} [n] the number of steps to take
 * @returns {CpuSolver} this
 */
CpuSolver.prototype.step = function(n) {
    n = n || 1;
    var states = [null, null, null, null];
    while (n-- > 0 && !this.done) {
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

/**
 * Draw the current solution state to the canvas.
 * @returns {CpuSolver} this
 */
CpuSolver.prototype.draw = function() {
    if (this.ctx == null) return this;
    var w = this.w, h = this.h, ctx = this.ctx,
        sx = Math.floor(ctx.canvas.width / w),
        sy = Math.floor(ctx.canvas.height / h),
        arrow = sx >= 8 && sy >= 8;
    for (var y = 0; y < this.h; y++) {
        for (var x = 0; x < this.w; x++) {
            var state = this.get(x, y);
            ctx.fillStyle = State.color(state);
            ctx.fillRect(sx * x, sy * y, sx, sy);
            if (arrow && (State.isFlow(state) || State.isRoute(state))) {
                ctx.fillStyle = '#333';
                ctx.save();
                ctx.scale(sx, sy);
                ctx.translate(x + 0.5, y + 0.5);
                ctx.rotate((state % 4) * Math.PI / 2);
                ctx.beginPath();
                ctx.moveTo( 0/4, -1/4);
                ctx.lineTo(-1/4,  1/4);
                ctx.lineTo( 1/4,  1/4);
                ctx.fill();
                ctx.restore();
            }
        }
    }
    return this;
};

/**
 * Animate the solution using requestAnimationFrame.
 * @param {Function} [callback]
 */
CpuSolver.prototype.animate = function(callback) {
    var _this = this;
    if (this.gif == null) {
        this.gif = new GIF({
            workers: 2,
            quality: 20,
            workerScript: 'lib/gif.worker.js'
        });
        this.gif.on('finished', function(blob) {
            window.open(URL.createObjectURL(blob));
        });
    }
    window.requestAnimationFrame(function() {
        if (!_this.done && !_this.cancelled) {
            _this.gif.addFrame(_this.ctx.canvas, {copy: true, delay: 200});
            _this.step(1).draw();
            _this.animate(callback);
        } else {
            _this.gif.addFrame(this.ctx, {copy: true, delay: 200});
            _this.gif.render();
            if (!_this.cancelled && callback != null) callback();
            _this.cancelled = false;
        }
    });
    return this;
};

/**
 * Stop animation without calling the callback.
 * @returns {CpuSolver} this
 */
CpuSolver.prototype.cancel = function() {
    this.cancelled = true;
    return this;
};
