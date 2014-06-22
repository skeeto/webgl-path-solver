function Forest() {
    if (!(this instanceof Forest)) {
        return new Forest();
    } else {
        this.parent = this;
        return this;
    }
};

Forest.prototype.root = function() {
    var set = this;
    while (set.parent !== set) set = set.parent;
    return (this.parent = set);
};

Forest.prototype.equals = function(set) {
    return this.root() === set.root();
};

Forest.prototype.merge = function(set) {
    set.root().parent = this.root();
};
