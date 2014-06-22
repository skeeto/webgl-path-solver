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
    vec4 color = texture2D(maze, coord);
    return int(color.r * 11.0 + 0.5);
}

bool isFlow(int state) {
    return (state >= 4 && state <= 7);
}

int findFlow(int n, int e, int s, int w) {
    if (isFlow(n) || n == BEGIN)
        return 0;
    else if (isFlow(e) || e == BEGIN)
        return 1;
    else if (isFlow(s) || s == BEGIN)
        return 2;
    else if (isFlow(w) || w == BEGIN)
        return 3;
    else
        return -1;
}

bool isRoute(int state) {
    return state >= 8 && state <= 11;
}

int findRoute(int n, int e, int s, int w) {
    if (isRoute(n) || n == END)
        return 0;
    else if (isRoute(e) || e == END)
        return 1;
    else if (isRoute(s) || s == END)
        return 2;
    else if (isRoute(w) || w == END)
        return 3;
    else
        return -1;
}

void main() {
    int v = state(vec2( 0,  0));
    int n = state(vec2( 0, -1));
    int e = state(vec2( 1,  0));
    int s = state(vec2( 0,  1));
    int w = state(vec2(-1,  0));
    int flow = findFlow(n, e, s, w);
    int route = findRoute(n, e, s, w);
    if (v == OPEN) {
        if (flow >= 0) {
            v = 4 + flow;
        }
    }
    gl_FragColor = vec4(float(v) / 11.0, 0, 0, 1);
}
