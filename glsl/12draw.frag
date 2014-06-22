#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D maze;
uniform vec2 scale;

const int OPEN    = 0;
const int WALL    = 1;
const int BEGIN   = 2;
const int END     = 3;
const int FLOW_N  = 4;
const int FLOW_E  = 5;
const int FLOW_S  = 6;
const int FLOW_W  = 7;
const int ROUTE_N = 8;
const int ROUTE_E = 9;
const int ROUTE_S = 10;
const int ROUTE_W = 11;

int state(vec2 offset) {
    vec2 coord = (gl_FragCoord.xy + offset) / scale;
    vec4 color = texture2D(maze, vec2(1, -1) * coord + vec2(0, 1));
    return int(color.r * 11.0 + 0.5);
}

void main() {
    int v = state(vec2(0, 0));
    if (v == OPEN) {
        gl_FragColor = vec4(1, 1, 1, 1);
    } else if (v == WALL) {
        gl_FragColor = vec4(0, 0, 0, 0);
    } else if (v == BEGIN) {
        gl_FragColor = vec4(0, 1, 0, 1);
    } else if (v == END) {
        gl_FragColor = vec4(0, 1, 0, 1);
    } else if (v >= 4 && v <= 7) {
        gl_FragColor = vec4(1, 0, 0, 1);
    } else if (v >= 8 && v <= 11) {
        gl_FragColor = vec4(0, 0, 1, 1);
    } else {
        gl_FragColor = vec4(1, 0, 1, 1); // error
    }
}
