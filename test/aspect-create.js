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

    }

};
