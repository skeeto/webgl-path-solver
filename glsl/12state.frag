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

int findFlow(int ns[4]) {
    if (isFlow(ns[0]) || ns[0] == BEGIN)
        return 0;
    else if (isFlow(ns[1]) || ns[1] == BEGIN)
        return 1;
    else if (isFlow(ns[2]) || ns[2] == BEGIN)
        return 2;
    else if (isFlow(ns[3]) || ns[3] == BEGIN)
        return 3;
    else
        return -1;
}

bool isRoute(int state) {
    return state >= 8 && state <= 11;
}

int findRoute(int ns[4]) {
    if (isRoute(ns[0]) || ns[0] == END)
        return 0;
    else if (isRoute(ns[1]) || ns[1] == END)
        return 1;
    else if (isRoute(ns[2]) || ns[2] == END)
        return 2;
    else if (isRoute(ns[3]) || ns[3] == END)
        return 3;
    else
        return -1;
}

bool pointsAtMe(int v, int relation) {
    return mod(float(v), 4.0) == mod(float(relation + 2), 4.0);
}

int get(int ns[4], int i) {
    if (i == 0)
        return ns[0];
    else if (i == 1)
        return ns[1];
    else if (i == 2)
        return ns[2];
    else
        return ns[3];
}

void main() {
    int v = state(vec2( 0,  0));
    int ns[4];
    ns[0] = state(vec2( 0, -1));
    ns[1] = state(vec2( 1,  0));
    ns[2] = state(vec2( 0,  1));
    ns[3] = state(vec2(-1,  0));
    int flow = findFlow(ns);
    int route = findRoute(ns);
    if (v == OPEN) {
        if (flow >= 0) {
            v = 4 + flow;
        }
    } else if (isFlow(v)) {
        if (route >= 0 && pointsAtMe(get(ns, route), route)) {
            v = v + 4;
        }
    } else if (v == END) {
        if (flow >= 0) {
            v = flow + 8;
        }
    } else if (v == BEGIN) {
        if (route >= 0) {
            v = get(ns, route);
        }
    }
    gl_FragColor = vec4(float(v) / 11.0, 0, 0, 1);
}
