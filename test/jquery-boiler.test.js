require([ 'qunit', 'jquery', 'jquery.boiler' ], function( QUnit, $ ) {
  /*
  * Added for Saucelabs
  * https://github.com/axemclion/grunt-saucelabs#test-result-details-with-qunit
  */
  var log = [];
  var testName;

  QUnit.done( function( test_results ) {
    var tests = [];
    for ( var i = 0, len = log.length; i < len; i++ ) {
      var details = log[i];
      tests.push({
        name: details.name,
        result: details.result,
        expected: details.expected,
        actual: details.actual,
        source: details.source
      });
    }
    test_results.tests = tests;

    window.global_test_results = test_results;
  });

  QUnit.testStart( function( testDetails ) {
    QUnit.log( function( details ) {
      if ( !details.result ) {
        details.name = testDetails.name;
        log.push( details );
      }
    });
  });

  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/

    Test methods:
      QUnit.module(name, {[beforeEach], [afterEach]})
      QUnit.test(name, callbaassertck)
      QUnit.expect(numberOfAssertions)
      QUnit.stop(increment)
      QUnit.start(decrement)
    Test assertions:
      assert.ok(value, [message])
      assert.equal(actual, expected, [message])
      assert.notEqual(actual, expected, [message])
      assert.deepEqual(actual, expected, [message])
      assert.notDeepEqual(actual, expected, [message])
      assert.strictEqual(actual, expected, [message])
      assert.notStrictEqual(actual, expected, [message])
      assert.throws(block, [expected], [message])
  */

  QUnit.start();

  QUnit.module( 'Basic Plugin Functionality', {
    // This will run before each test in this module.
    beforeEach: function() {
      this.$el1 = $( '#js-test-1' );
      this.$el2 = $( '#js-test-2' );
      this.$els = $( '.js-test' );

      $.boiler( 'test', {});
    },
    afterEach: function() {
      this.$els.removeData( 'test' );
    }
  });

  QUnit.test( 'Added to fn namespace', function( assert ) {
    assert.expect( 1 );

    assert.ok( !!$.fn.test );
  });

  QUnit.test( 'Chainable', function( assert ) {
    assert.expect( 1 );

    assert.strictEqual( this.$els.test(), this.$els );
  });

  QUnit.test( 'Plugin cached in elements data attribute', function( assert ) {
    assert.expect( 1 );

    this.$el1.test();
    assert.ok( !!this.$el1.data( 'test' ));
  });

  QUnit.test( 'Plugin applied to each element in a group', function( assert ) {
    assert.expect( 1 );

    var isOk = true;

    this.$els.test();

    this.$els.each( function() {
      if ( !$( this ).data( 'test' )) {
        isOk = false;
      }
    });

    assert.ok( isOk );
  });

  QUnit.test( 'Each instance of plugin is seperate', function( assert ) {
    assert.expect( 1 );

    this.$els.test();

    assert.notStrictEqual( this.$el1.data( 'test' ), this.$el2.data( 'test' ));
  });

  /*
   *
   */

  QUnit.module( 'Caching Dom Objects', {
    // This will run before each test in this module.
    beforeEach: function() {
      this.$el = $( '#js-test-1' );

      $.boiler( 'test', {});
    },
    afterEach: function() {
      this.$el.removeData( 'test' );
    }
  });

  QUnit.test( 'Dom element is cached', function( assert ) {
    assert.expect( 2 );

    this.$el.test();

    assert.strictEqual( this.$el[0], this.$el.data( 'test' ).$el[0]);
    assert.strictEqual( this.$el[0], this.$el.data( 'test' ).el );
  });

  /*
   *
   */

  QUnit.module( 'Plugin Methods and Variables', {
    // This will run before each test in this module.
    beforeEach: function() {
      this.$el = $( '<div>' );

      $.boiler( 'test', {
        pub: 'public',
        _private: true,
        exclaim: function( input ) {
          return input + '!';
        },
        getThis: function() {
          return this;
        },
        setText: function( val ) {
          this.$el.text( val );
        }
      });

      this.$el.test();
    },
    afterEach: function() {
      this.$el.removeData( 'test' );
    }
  });

  QUnit.test( 'Plugin object gives access to passed objects', function( assert ) {
    assert.expect( 2 );

    assert.strictEqual( this.$el.data( 'test' ).pub, 'public' );
    assert.strictEqual( this.$el.data( 'test' ).exclaim( 'itemTwo' ), 'itemTwo!' );
  });

  QUnit.test( 'Easily set public variables', function( assert ) {
    assert.expect( 1 );

    this.$el.test( 'pub', 'foo' );

    assert.strictEqual( this.$el.data( 'test' ).pub, 'foo' );
  });

  QUnit.test( "'this' gives context to plugin within method", function( assert ) {
    assert.expect( 1 );

    assert.strictEqual( this.$el.data( 'test' ).getThis(), this.$el.data( 'test' ));
  });

  QUnit.test( 'Easily call methods', function( assert ) {
    assert.expect( 1 );

    this.$el.test( 'setText', 'Hello World!' );

    assert.strictEqual( this.$el.text(), 'Hello World!' );
  });

  /*
   *
   */

  QUnit.module( 'Settings', {
    // This will run before each test in this module.
    beforeEach: function() {
      this.$el = $( '#js-test-1' );

      $.boiler( 'test', {
        defaults: {
          one: '1',
          two: '2',
          three: '3'
        },
        data: [ 'one' ]
      });
    },
    afterEach: function() {
      this.$el.removeData( 'test' );
    }
  });

  QUnit.test( 'Defaults are cached', function( assert ) {
    assert.expect( 1 );

    this.$el.test();

    assert.deepEqual( this.$el.data( 'test' ).defaults, {
      one: '1',
      two: '2',
      three: '3'
    });
  });

  QUnit.test( 'Data attributes are cached', function( assert ) {
    assert.expect( 1 );

    this.$el.test();

    assert.deepEqual( this.$el.data( 'test' ).data, {
      one: 'ONE'
    });
  });

  QUnit.test( 'User options are cached', function( assert ) {
    assert.expect( 1 );

    this.$el.test({
      foo: 'bar'
    });

    assert.deepEqual( this.$el.data( 'test' ).options, {
      foo: 'bar'
    });
  });

  QUnit.test( 'Settings properly give priority to data > options > defaults', function( assert ) {
    assert.expect( 1 );

    this.$el.test({
      one: 'one',
      two: 'two'
    });

    assert.deepEqual( this.$el.data( 'test' ).settings, {
      one: 'ONE',
      two: 'two',
      three: '3'
    });
  });

  /*
   *
   */

  QUnit.module( 'Events', {
    // This will run before each test in this module.
    beforeEach: function() {
      this.$el = $( '<div>' );
    },
    afterEach: function() {
      this.$el.removeData( 'test' );
    }
  });

  QUnit.test( 'Events run properly', function( assert ) {
    assert.expect( 2 );

    $.boiler( 'test', {
      events: {
        'click': 'onClick',
        'mouseenter': 'onHover'
      },
      foo: 'bar',
      onClick: function() {
        this.foo = 'click';
      },
      onHover: function() {
        this.foo = 'hover';
      }
    });

    this.$el.test();

    this.$el.trigger( 'click' );
    assert.strictEqual( this.$el.data( 'test' ).foo, 'click' );

    this.$el.trigger( 'mouseenter' );
    assert.strictEqual( this.$el.data( 'test' ).foo, 'hover' );
  });

  QUnit.test( 'Propogated events run properly', function( assert ) {
    assert.expect( 3 );

    $.boiler( 'test', {
      events: {
        'click li span': 'onClick'
      },
      onClick: function( e, el ) {
        $( el ).addClass( 'is-clicked' );
      }
    });

    $( '#js-test-3' ).test();
    $( '#js-target-1' ).click();
    $( '#js-target-2' ).click();
    $( '#js-target-3' ).click();

    assert.ok( $( '#js-target-1' ).hasClass( 'is-clicked' ));
    assert.ok( !$( '#js-target-2' ).hasClass( 'is-clicked' ));
    assert.ok( $( '#js-target-3' ).hasClass( 'is-clicked' ));
  });
});
