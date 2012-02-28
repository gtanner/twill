var twill = require("../lib/twill");

exports["when aspecting in a new method"] = {
    "it can add a new method" : function (test) {
        var target = {};

        twill.aspect(target, function (weave) {
            weave.create.asdf = function () {
                test.done();
            };
        });

        target.asdf();
    },

    "it throws an exception if the method already exists" : function (test) {
        var target = {
            woohoo: function () {}
        };

        try {
            twill.aspect(target, function (weave) {
                weave.create.woohoo = function () {
                };
            });
        } catch (e) {
            test.done();
        }
    },

    "it can unweave the new method" : function (test) {
        var target = {},
            aspect = twill.aspect(target, function (weave) {
                weave.create.foo = function () {};
                weave.create.bar = function () {};
                weave.create.baz = function () {};
            });

        twill.unweave(aspect);

        test.equal(undefined, target.foo);
        test.equal(undefined, target.bar);
        test.equal(undefined, target.baz);
        test.done();
    }
};
