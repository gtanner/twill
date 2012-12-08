# twill

A new approch to javascript aspect oriented programming.  Twill is an attempt to create
an AOP framework for javascript that feels like it was written for javascript. Twill
will run fine in both node and in the browser.

## install

twill can be installed via npm:

    npm install twill

using in node:

    var twill = require('twill');

    twill.aspect(foo, advice);

or in the browser:

    <script type="text/javascript" src="twill.js"></script>

    <script type="text/javascript">
        twill.aspect(foo, advice);
    </script>

## Using Twill

to use twill you start with the aspect method.

    var id = twill.aspect(target, function (weave) {
    };

The id returned is used to unweave any changes made to the target 

    twill.unweave(id);

Tthe function passed to aspect is called the advice.  This is where
you define the pointcuts you wish to weave onto the target.

## the weave object

All of the functionality of twill is handed via the weave object exposed
to the advice function.

the weave object allows adding pointcuts for various pointcuts on the
the target. A property is added to the weave object for each of the 
functions on the target.

    weave.<method>.<pointcut_location>();

### The Before Pointcut

Adding a pointcut before allows you to run the aspect code before the original method 
is called. You have access to the parameters passed in but can not change them.

    var target = {
        addTwelve: function (a) { return a + 12; }
    };

    twill.aspect(target, function (weave) {
        weave.addTwelve.before(function (a) {
            console.log("the value passed in was: " + a);
        });
    });

### The After Pointcut

Adding a pointcut after allows you to run the aspect to after the original method was called.
You have access to the paramters passed in but can not change them.  You don't have access to the
return value and can not change it.

    var target = {
        takeOverTheWorld: function () {
            return false;
        }
    };

    twill.aspect(target, function (weave) {
        weave.takeOverTheWorld.after(function () {
            world.warn();
        });
    });

### The Around Pointcut

Adding a pointcut around gives you the most flexability. This allows you to wrap around
the method being called and both change the parameters in and the return value out.

    var target = {
        add: function (a, b) { return a + b; } 
    };

    twill.aspect(target, function (weave) {
        weave.around.add(function (args, orig) {
            return orig(args[0] + 1, args[1] + 1) * 2;
        });
    });

    target.add(2, 2);
    //returns 12;

### The Exception Pointcut

This pointcut allows you to act when a method throws an exception.

    var target = {
        onnoes: function () {
            throw "snap";
        }
    };

    twill.aspect(target, function (weave) {
        weave.exeception.onnoes(function (e) {
            console.log(e);
    
            //just rethrow if you don't want to swallow
            throw e;
        });
    });
    
### The Add Pointcut

Allows you to add methods to the target. The bonus is that you will 
able to remove them when calling unweave.

    var target = {};

    twill.aspect(target, function (weave) {
        weave.add.woot = function () {
            console.log("woot");
        };
    });

### The Remove Pointcut

Allows you to remove methods on the target. The same bonus as add
where you can have this undone when unweaving the target.

    var target = {
        getPassword: function () {
            return "password";
        }
    };

### The All property

This property on the weave object allows you to aspect all
of the methods on the target (at the time of calling) with
a single advice.  This is availbe for the following pointcuts:
 * before
 * after
 * around

The advice is called with: `function (methodName, arguments, method) {}`

Example:

    twill.aspect(target, function (weave) {
        weave.all.after(function (method, args) {
            window.stats.track(method);
            console.log("stats +1 for " + method);
        });

        weave.all.around(function (method, args, orig) {
            console.log(method);
            return orig.apply(orig, args);
        });
    });

# how to develop

all code should have tests written in node-unit. Run the tests with:

    jake test

