var assert = require("assert");
var Cash = require('../Cash.js');

var API = new Cash();

describe('API', function(){
	it('should be a function', function(){
		assert.strictEqual(typeof Cash, 'function');
	});
	it('should have a getChange Method', function(){
		assert.strictEqual(typeof Cash.getChange, 'function');
	});
	it('#getChange(210,300) should equal [50,20,20]', function(){
		assert.deepEqual(Cash.getChange(210,300), [50,20,20]);
	});
	it('#getChange(486,1000) should equal [500, 10, 2, 2]', function(){
		assert.deepEqual(Cash.getChange(486,1000), [500, 10, 2, 2]);
	});
	it('#getChange(1487,10000) should equal [5000, 2000, 1000, 500, 10, 2, 1 ]', function(){
		assert.deepEqual(Cash.getChange(1487,10000), [5000, 2000, 1000, 500, 10, 2, 1 ]);
	});
});
