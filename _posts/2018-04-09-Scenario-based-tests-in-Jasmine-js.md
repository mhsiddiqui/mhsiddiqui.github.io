---
layout: post
title:  "Scenario based tests in Jasmine.js"
date:   2018-04-09
image:  
tags:   [Jasmine.js, JavaScript, JavaScript-Testing, JavaScript-Unittest, Scenario-Based-Tests]
---

Jasmine is a behavior-driven development framework for testing JavaScript code. It does not depend on any other JavaScript frameworks. It does not require a DOM. And it has a clean, obvious syntax so that you can easily write tests. This guide is running against Jasmine version 2.4.1.

That was brief introduction of jasmine which you can also get on their website. Writing test in jasmine is not very difficult. Every test suite start with a function called ‘describe’ which takes two input.

<!--more-->

1. A string which is description of test case.
2. A function is method or block of code which implements suite.

Second block of test is `it` block. `it` take same inputs as `describe`, a string and a function. A simple jasmine test is shown below.

```javascripti
describe('Check Addition Result', function () {
    it('adds two numbers together', function () {
        expect(1 + 5).toEqual(6);
    });
});
```

Here arguments of `expect` will be output of function to be tested, and `toEqual` will have expected result as argument.

## Getting Started


Download latest standalone release from [standalone download page](https://github.com/jasmine/jasmine/releases) of Jasmine. This will look like this

![Jasmine.js](/images/2018/3/capture2.png)

Open `SpecRunner` in browser and you will look something like this.

![SpecRunner](/images/2018/3/capture3.png)

Now add following function in `src/Player.js` file.

```javascript
function evenOrOdd(input){
    if(isNaN(input)){
	return -1;
    }
    else{
	return parseInt(input)%2==0;
    }
}
```
Now we will add tests for this function. Add following code in `spec/PlayerSpec.js`.

```javascript
describe('Function: evenOrOdd()', function(){
	it('Input is an even number', function(){
		var result = evenOrOdd(4);
		expect(result).toBe(true);
	});
	it('Input is a string', function(){
		var result = evenOrOdd('string');
		expect(result).toBe(-1);
	});
	it('Input is a number in string', function(){
		var result = evenOrOdd('4');
		expect(result).toBe(true);
	});
	it('Input is an odd number', function(){
		var result = evenOrOdd(5);
		expect(result).toBe(false);
	});

});
```

You will see result of your new tests like this when you will open `SpecRunner.html` in browser.

![Output](/images/2018/3/capture3.png)

You can see that we have to repeat same `it` block again and again. The only thing which is changing is description of test, input of function and expected output of function. Here we can use scenarios to avoid repetition of code.

## Scenarios In Jasmine tests

Write your scenarios like this

```javascript
var scenarios = [{
        description: 'Input is an even number',
        input: 4,
        expected_output: true
    },
    {
        description: 'Input is a string',
        input: 'string',
        expected_output: -1
    },
    {
        description: 'Input is a number in string',
        input: '4',
        expected_output: true
    },
    {
        description: 'Input is an odd number',
        input: 5,
        expected_output: false
    },
];
```
You can see that we just make a separate object for every test case and write all required data for a test in it. Now change your test like this

```javascript
scenarios.map(function(value){
	it(value.description, function(){
	    var result = evenOrOdd(value.input);
	    expect(result).toBe(value.expected_output);
        });
});
```

Now when you will run your tests, you will see same output as before. This is how we can use scenarios to avoid repetition of code in our tests.

## Conclusion

You can do a lot more with Jasmine like function related-matchers, spies and many more things.You can check detailed documentation from here. Jasmine can be used to test JavaScript code in you Django, Flask or Ruby project.
