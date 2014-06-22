/*global Igloo State */

function GpuSolver(w, h, maze, canvas) {
    this.statesize = new Float32Array([w, h]);
    this.viewsize = new Float32Array([canvas.width, canvas.height]);
    var igloo = this.igloo = new Igloo(canvas);
    if (igloo == null) {
        alert('Could not initialize WebGL!');
        throw new Error('No WebGL');
    }
    var gl = igloo.gl;
    gl.disable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    this.programs = {
        step: igloo.program('glsl/quad.vert', 'glsl/12state.frag'),
        draw: igloo.program('glsl/quad.vert', 'glsl/12draw.frag')
    };
    this.buffers = {
        quad: igloo.array(Igloo.QUAD2)
    };
    this.textures = {
        fore: igloo.texture(null, null, null, gl.NEAREST).blank(w, h),
        back: igloo.texture(null, null, null, gl.NEAREST).blank(w, h)
    };
    this.framebuffers = {
        step: igloo.framebuffer()
    };
    this.set(maze);
    this.done = false;
    this.age = 0;
}

GpuSolver.prototype.swap = function() {
    var tmp = this.textures.fore;
    this.textures.fore = this.textures.back;
    this.textures.back = tmp;
    return this;
};

GpuSolver.prototype.set = function(maze) {
    var w = this.statesize[0], h = this.statesize[1],
        rgba = new Uint8Array(w * h * 4);
    for (var i = 0; i < maze.length; i++) {
        rgba[i * 4 + 0] = maze[i] * 255 / 11;
        rgba[i * 4 + 1] = 0;
        rgba[i * 4 + 2] = 0;
        rgba[i * 4 + 3] = 0;
    }
    rgba[0]               = State.BEGIN * 255 / 11;
    rgba[rgba.length - 4] = State.END   * 255 / 11;
    this.textures.fore.subset(rgba, 0, 0, w, h);
    this.done = false;
    return this;
};

GpuSolver.prototype.step = function(n) {
    n = n || 1;
    var gl = this.igloo.gl;
    gl.viewport(0, 0, this.statesize[0], this.statesize[1]);
    var step = this.programs.step.use()
        .attrib('quad', this.buffers.quad, 2)
        .uniform('scale', this.statesize)
        .uniformi('maze', 0);
    var rgba = new Uint8Array(4);
    while (n-- > 0 && !this.done) {
        this.age++;
        this.framebuffers.step.attach(this.textures.back);
        this.textures.fore.bind(0);
        step.draw(gl.TRIANGLE_STRIP, Igloo.QUAD2.length / 2);
        gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, rgba);
        /* Test if START changed into a ROUTE. */
        if (State.isRoute(Math.round(rgba[0] * 11 / 255))) {
            this.done = true;
        }
        this.swap();
    }
    return this;
};

GpuSolver.prototype.draw = function() {
    var gl = this.igloo.gl;
    this.igloo.defaultFramebuffer.bind();
    this.textures.fore.bind(0);
    gl.viewport(0, 0, this.viewsize[0], this.viewsize[1]);
    this.programs.draw.use()
        .attrib('quad', this.buffers.quad, 2)
        .uniform('scale', this.viewsize)
        .uniformi('maze', 0)
        .draw(gl.TRIANGLE_STRIP, Igloo.QUAD2.length / 2);
    return this;
};

GpuSolver.prototype.animate = function(callback) {
    var _this = this;
    window.requestAnimationFrame(function() {
        if (!_this.done) {
            _this.step(2).draw();
            _this.animate(callback);
        } else {
            callback();
        }
    });
    return this;
};
