/**
 * Disjoint-set forest with O(logn) worse-case merging and testing.
 */
function Forest() {
    if (!(this instanceof Forest)) {
        return new Forest();
    } else {
        this.parent = this;
        return this;
    }
};

/**
 * @returns {Forest} the root node of this forest
 */
Forest.prototype._root = function() {
    var set = this;
    while (set.parent !== set) set = set.parent;
    return (this.parent = set);
};

/**
 * @param {Forest} set
 * @returns {boolean} true if these are the same set (merged)
 */
Forest.prototype.equals = function(set) {
    return this._root() === set._root();
};

/**
 * Merge two sets into a single set.
 * @param {Forest} set
 */
Forest.prototype.merge = function(set) {
    set._root().parent = this._root();
};
