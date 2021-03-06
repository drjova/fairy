// Generated by CoffeeScript 1.3.3
var Connect, express, plural_commands, router, singular_commands, staticCache, static_;

express = require('express');

router = new express.Router();

staticCache = express.staticCache();

static_ = express["static"](__dirname + '/web');

plural_commands = {
  get: ['statistics']
};

singular_commands = {
  get: ['statistics', 'recently_finished_tasks', 'failed_tasks', 'slowest_tasks', 'processing_tasks', 'workers'],
  post: ['reschedule', 'clear']
};

exports.connect = function(options) {
  if (options == null) {
    options = {};
  }
  return new Connect(options);
};

Connect = (function() {

  function Connect(options) {
    var _this = this;
    this.options = options;
    this.fairy = require('../.').connect(options);
    this.no_cache = function(req, res, next) {
      res.setHeader("Cache-Control", "no-cache");
      return next();
    };
    this.__defineGetter__('middleware', function() {
      var command, commands, method, _i, _j, _len, _len1;
      for (method in plural_commands) {
        commands = plural_commands[method];
        for (_i = 0, _len = commands.length; _i < _len; _i++) {
          command = commands[_i];
          router.route(method, "/api/queues/" + command, _this.no_cache, (function(command) {
            return function(req, res) {
              return _this.fairy[command](function(err, results) {
                if (err) {
                  return res.send(500, err.stack);
                }
                return res.send(results);
              });
            };
          })(command));
        }
      }
      for (method in singular_commands) {
        commands = singular_commands[method];
        for (_j = 0, _len1 = commands.length; _j < _len1; _j++) {
          command = commands[_j];
          router.route(method, "/api/queues/:name/" + command, _this.no_cache, (function(command) {
            return function(req, res) {
              var queue;
              queue = _this.fairy.queue(req.params.name);
              return queue[command](function(err, results) {
                if (err) {
                  return res.send(500, err.stack);
                }
                return res.send(results);
              });
            };
          })(command));
        }
      }
      return function(req, res, next) {
        return router.middleware(req, res, function() {
          if (req.url === '/fairy') {
            req.url = '/fairy.html';
          }
          return staticCache(req, res, function() {
            return static_(req, res, next);
          });
        });
      };
    });
  }

  return Connect;

})();
