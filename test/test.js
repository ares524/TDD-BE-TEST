var request = require('request'),
  expect = require('chai').expect,
  Q = require('q'),
  _ = require('underscore');

TIMEOUT = 200;

var fetcher = (function (request, q) {
  return {
    post: function (action, data) {
      return fetch('post', { url: action, form: data });
    },
  };

  ////

  function fetch(method, options) {
    var deferred = Q.defer();

    setTimeout(function () {
      deferred.reject(new Error('No Response From Server'));
    }, TIMEOUT);

    request[method](options, function (error, response) {
      if (error) {
        return deferred.reject(new Error(error));
      }

      try {
        response.json = JSON.parse(response.body);
      } catch (err) {
        if (response.body.match('Error')) {
          var errMsg = response.body;
          var cleanMsg = errMsg.split('<br> &nbsp; &nbsp;').join('\n\r');
          deferred.reject(new Error(cleanMsg));
        }
      }

      deferred.resolve(response);
    });

    return deferred.promise;
  }
})(request, Q);

function ensureJSON(response, done) {
  if (typeof response.json !== 'object') {
    done(
      new Error(
        'Response body is the ' +
          typeof response.body +
          ' "' +
          response.body.toString() +
          '" and not valid JSON'
      )
    );
  } else {
    expect(response.json).to.be.an('object');
    done();
  }
}

var base_url = 'http://localhost:3001';

describe('CALCULATE API', function () {
  describe('POST /api/calculate', function () {
    var actual_response = {};
    var param = {
      argument: '1,3,5',
    };

    before(function (done) {
      fetcher
        .post(base_url + '/api/calculate', param)
        .then(function (response) {
          actual_response.statusCode = response.statusCode;
          actual_response.json = response.json;
          done();
        })
        .fail(done);
    });

    it('should respond with status 200 - Success', function (done) {
      expect(actual_response.statusCode).to.equal(200);
      done();
    });

    it('should respond with JSON', function (done) {
      ensureJSON(actual_response, done);
    });

    it('should respond with the sum, average, deviation', function (done) {
      expect(actual_response.json).to.have.property('sum');

      expect(actual_response.json).to.have.property('average');

      expect(actual_response.json).to.have.property('average');

      done();
    });
  });
});
