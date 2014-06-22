/**
 * A JavaScript version of the 12-state path solving cellular automata.
 */
var State = {
    OPEN:    0,
    WALL:    1,
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

    /**
     * @param {number} state
     * @returns {boolean} true if state is a FLOW state
     */
    isFlow: function(state) {
        return state >= 4 && state <= 7;
    },

    /**
     * @param {number} state
     * @returns {boolean} true if state is a ROUTE state
     */
    isRoute: function(state) {
        return state >= 8 && state <= 11;
    },

    /**
     * @param {Function} f
     * @param {Array} states
     * @returns {number} position where predicate f returns true
     */
    find: function(f, states) {
        for (var i = 0; i < states.length; i++) {
            if (f(states[i])) {
                return i;
            }
        }
        return -1;
    },

    /**
     * @param {Array} states
     * @returns {number} position of the first BEGIN, or -1
     */
    findBegin: function(states) {
        return State.find(function(x) { return x === State.BEGIN; }, states);
    },

    /**
     * @param {Array} states
     * @returns {number} position of the first END, or -1
     */
    findEnd: function(states) {
        return State.find(function(x) { return x === State.END; }, states);
    },

    /**
     * @param {Array} states
     * @returns {number} position of the first FLOW state, or -1
     */
    findFlow: function(states) {
        return State.find(State.isFlow, states);
    },

    /**
     * @param {Array} states
     * @returns {number} position of the first ROUTE state, or -1
     */
    findRoute: function(states) {
        return State.find(State.isRoute, states);
    },

    /**
     * @param {number} state
     * @param {number} relation (0=north, 1=east, 2=south, 3=west)
     * @returns {boolean} true if state points in given direction
     */
    pointsAtMe: function(state, relation) {
        return (state % 4) == ((relation + 2) % 4);
    },

    /**
     * @param {numner} state
     * @param {Array} states
     * @returns {number} the next state given neighbors neighbors
     */
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
            } else {
                return state;
            }
        case State.BEGIN:
            if (route >= 0) {
                return states[route];
            } else {
                return state;
            }
        default:
            return state;
        }
    },

    /**
     * @param {number} state
     * @returns {string} a CSS color representation for a state
     */
    color: function(state) {
        return ['#fff', '#000', '#f00', '#f00',
                '#af5', '#af5', '#af5', '#af5',
                '#33f', '#33f', '#33f', '#33f'][state];
    },

    /**
     * @param {number} state
     * @returns {string} the human-readable name for a state
     */
    name: function(state) {
        return ['OPEN',    'WALL',    'BEGIN',   'END',
                'FLOW_N',  'FLOW_E',  'FLOW_S',  'FLOW_W',
                'ROUTE_N', 'ROUTE_E', 'ROUTE_S', 'ROUTE_W',
               ][state];
    }
};
