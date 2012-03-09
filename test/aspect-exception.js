var twill = require("../lib/twill");

exports["when aspecting exceptions on a method"] = {
    "it catches the exception" : function (test) {
        var target = {
            boom: function () {
                throw "errorz";
            }
        };

        twill.aspect(target, function (weave) {
            weave.exception.boom(function (e) {
                test.equal("errorz", e);
                test.done();
            });
        });

        target.boom();
    }
};
