var twill = require("../lib/twill");

exports["it validates the arguments"] = {
    "and throws an error when no arguments are passed" : function (test) {
        test.throws(twill.aspect);
        test.done();
    },
    "and throws an error when missing the target" : function (test) {
        test.throws(function () {
            twill.aspect(undefined, function () {
            });
        });
        test.done();
    },
    "and throws an error when missing the advice" : function (test) {
        test.throws(function () {
            twill.aspect({});
        });
        test.done();
    },
    "and doesn't throw an Error when everything is fine" : function (test) {
        test.doesNotThrow(function () {
            twill.aspect({}, function () {
            }, Error);
        });

        test.done();
    }
};

exports["when calling the aspect function"] = {
    "it passes the weave object" : function (test) {
        twill.aspect({}, function (weave) {
            test.ok(weave, "weave should be defined");
            test.done();
        });
    },

    "the target is set to the context of the weave function" : function (test) {
        var target = {};
        twill.aspect(target, function (weave) {
            test.strictEqual(target, this);
            test.done();
        });
    },

    "weave has a before object" : function (test) {
        twill.aspect({}, function (weave) {
            test.ok(typeof weave.before === 'object', "before should be a object");
            test.done();
        });
    },

    "weave has an after object" : function (test) {
        twill.aspect({}, function (weave) {
            test.ok(typeof weave.after === 'object', "after should be a object");
            test.done();
        });
    },

    "weave has an around object" : function (test) {
        twill.aspect({}, function (weave) {
            test.ok(typeof weave.around === 'object', "around should be a object");
            test.done();
        });
    },

    "weave has a create object" : function (test) {
        twill.aspect({}, function (weave) {
            test.ok(typeof weave.create === 'object', "create should be a object");
            test.done();
        });
    }, 

    "weave has an all object with the same methods as the weave object" : function (test) {

        twill.aspect({}, function (weave) {
            test.ok(weave.all, "expected weave to expose the all object");
            test.ok(typeof weave.all.before === 'function', "before should be a function");
            test.ok(typeof weave.all.after === 'function', "after should be a function");
            test.ok(typeof weave.all.around === 'function', "around should be a function");
            test.done();
        });
    },

    "weave returns a pointer to the aspect" : function (test) {
        var x = twill.aspect({}, function (weave) {});
        test.ok(x !== undefined);
        test.done();
    }
};

var target = {
    a: function () {},
    b: function () {},
    c: "asdf"
};

exports["methods are exposed on"] = {
    "the before object" : function (test) {
        twill.aspect(target, function (weave) {
            test.ok(typeof weave.before.a === "function", "expected a to exist");
            test.ok(typeof weave.before.b === "function", "expected b to exist");
            test.ok(weave.before.c === undefined, "expected c to not exist");
            test.done();
        });
    },
    "the after object" : function (test) {
        twill.aspect(target, function (weave) {
            test.ok(typeof weave.after.a === "function", "expected a to exist");
            test.ok(typeof weave.after.b === "function", "expected b to exist");
            test.ok(weave.after.c === undefined, "expected c to not exist");
            test.done();
        });
    },
    "the around object" : function (test) {
        twill.aspect(target, function (weave) {
            test.ok(typeof weave.around.a === "function", "expected a to exist");
            test.ok(typeof weave.around.b === "function", "expected b to exist");
            test.ok(weave.around.c === undefined, "expected c to not exist");
            test.done();
        });
    }
};


exports["when aspecting"] = {
    "it can declare and use multiple aspects" : function (test) {
        var foo = {
                bar: function () {},
                baz: function () {},
                fred: function () {}
            },
            result = "";

        twill.aspect(foo, function (weave) {
            weave.before.bar(function () {
                result += "a";
            });

            weave.after.baz(function () {
                result += "b";
            });

            weave.around.fred(function () {
                result += "c";
            });
        });

        foo.bar();
        foo.baz();
        foo.fred();

        test.equal("abc", result);
        test.done();
    }
};
