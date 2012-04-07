var twill = require("../lib/twill");

exports["when aspecting in a new method"] = {
    "it can add a new method" : function (test) {
        var target = {};

        twill.fastAspect(target, function (weave) {
            weave.add.asdf = function () {
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
            twill.fastAspect(target, function (weave) {
                weave.add.woohoo = function () {
                };
            });
        } catch (e) {
            test.done();
        }
    },

    "it can unweave the new method" : function (test) {
        var target = {},
            aspect = twill.fastAspect(target, function (weave) {
                weave.add.foo = function () {};
                weave.add.bar = function () {};
                weave.add.baz = function () {};
            });

        twill.unweave(aspect);

        test.equal(undefined, target.foo);
        test.equal(undefined, target.bar);
        test.equal(undefined, target.baz);
        test.done();
    }
};
