var State = {
    WALL:    0,
    OPEN:    1,
    BEGIN:   2,
    END:     3,
    FLOW_N:  4,
    FLOW_E:  5,
    FLOW_S:  6,
    FLOW_W:  7,
    ROUTE_N: 8,
    ROUTE_E: 9,
    ROUTE_S: 10,
    ROUTE_W: 11,

    isFlow: function(state) {
        return state >= 4 && state <= 7;
    },

    isRoute: function(state) {
        return state >= 8 && state <= 11;
    },

    find: function(f, states) {
        for (var i = 0; i < states.length; i++) {
            if (f(states[i])) {
                return i;
            }
        }
        return -1;
    },

    findBegin: function(states) {
        return State.find(function(x) { return x === State.BEGIN; }, states);
    },

    findEnd: function(states) {
        return State.find(function(x) { return x === State.END; }, states);
    },

    findFlow: function(states) {
        return State.find(State.isFlow, states);
    },

    findRoute: function(states) {
        return State.find(State.isRoute, states);
    },

    pointsAtMe: function(state, relation) {
        return (state % 4) == ((relation + 2) % 4);
    },

    next: function(state, states) {
        var begin = State.findBegin(states),
            end   = State.findEnd(states),
            flow  = begin >= 0 ? begin : State.findFlow(states),
            route = State.findRoute(states);
        switch (state) {
        case State.OPEN:
            if (flow >= 0) {
                return 4 + flow;
            } else {
                return state;
            }
        case State.FLOW_N:
        case State.FLOW_E:
        case State.FLOW_S:
        case State.FLOW_W:
            if (route >= 0 && State.pointsAtMe(states[route], route)) {
                return state += 4;
            } else {
                return state;
            }
        case State.END:
            if (flow >= 0) {
                return flow + 8;
            }
        default:
            return state;
        }
    },

    color: function(state) {
        return ['#000', '#fff', '#0f0', '#070',
                '#f00', '#f00', '#f00', '#f00',
                '#00f', '#00f', '#00f', '#00f'][state];
    },

    name: function(state) {
        return ['WALL', 'OPEN', 'BEGIN', 'END',
                'FLOW_N', 'FLOW_E', 'FLOW_S', 'FLOW_W',
                'ROUTE_N', 'ROUTE_E', 'ROUTE_S', 'ROUTE_W',
               ][state];
    }
};
