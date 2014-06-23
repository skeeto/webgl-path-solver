#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D maze;
uniform vec2 viewport;
uniform vec2 statesize;
uniform sampler2D arrow;

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
    vec2 coord = (gl_FragCoord.xy + offset) / viewport;
    vec4 color = texture2D(maze, vec2(1, -1) * coord + vec2(0, 1));
    return int(color.r * 11.0 + 0.5);
}

mat2 rotate(float angle) {
    return mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
}

vec3 point(vec3 base, int dir) {
    if ((viewport / statesize).x < 8.0) {
        return base;
    } else {
        /* Compute cell-centered, unit coordinates. */
        vec2 p = 2.0 * (fract(gl_FragCoord.xy / viewport * statesize) - 0.5);
        /* Rotate cell-coordinates to direction. */
        float angle = float(dir) * 3.141592653589 / 2.0;
        p = rotate(angle) * p;
        /* Convert to texture coordinates and sample. */
        vec3 alpha = texture2D(arrow, (p + 1.0) / 2.0).rgb;
        return (1.0 - alpha) * base + alpha * vec3(0.1875);
    }
}

void main() {
    int v = state(vec2(0, 0));
    int dir = int(mod(float(v), 4.0));
    vec3 color;
    if (v == OPEN) {
        color = vec3(1, 1, 1);
    } else if (v == WALL) {
        color = vec3(0, 0, 0);
    } else if (v == BEGIN) {
        color = vec3(1, 0, 0);
    } else if (v == END) {
        color = vec3(1, 0, 0);
    } else if (v >= 4 && v <= 7) {       // flow
        color = point(vec3(0.65, 1, 0.34), dir);
    } else if (v >= 8 && v <= 11) {      // route
        color = point(vec3(0.19, 0.19, 1), dir);
    } else {
        color = vec3(1, 0, 1); // error
    }
    gl_FragColor = vec4(color, 1);
}
