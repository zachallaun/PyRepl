(function() {
  var PyREPL;

  PyREPL = {
    init: function(validate) {
      var _this = this;
      this.validate = validate;
      this.header = 'Python 2.7.2 (default, Jul 31 2011, 19:30:53)\n' + '[GCC 4.2.1 (LLVM, Emscripten 1.5, Empythoned)]\n';
      this.console = $("#console").jqconsole(this.header, ">>> ");
      this.registerShortcuts();
      this.jsrepl = new JSREPL({
        input: $.proxy(this.InputCB, this),
        output: $.proxy(this.OutputCB, this),
        result: $.proxy(this.ResultCB, this),
        error: $.proxy(this.ErrorCB, this),
        timeout: {
          time: 3000,
          callback: function() {
            _this.Prompt();
            return true;
          }
        }
      });
      window.jsrepl = this.jsrepl;
      return this.jsrepl.loadLanguage('python', $.proxy(this.Prompt, this), true);
    },
    registerShortcuts: function() {
      var _this = this;
      this.console.RegisterShortcut('Z', function() {
        _this.console.AbortPrompt();
        return _this.Prompt();
      });
      this.console.RegisterShortcut('A', function() {
        return _this.console.MoveToStart();
      });
      this.console.RegisterShortcut('E', function() {
        return _this.console.MoveToEnd();
      });
      this.console.RegisterShortcut('K', function() {
        return _this.console.ClearPromptText();
      });
      this.console.RegisterShortcut('N', function() {
        return _this.console._HistoryNext();
      });
      this.console.RegisterShortcut('P', function() {
        return _this.console._HistoryPrevious();
      });
      this.console.RegisterMatching('{', '}', 'brace');
      this.console.RegisterMatching('(', ')', 'paren');
      return this.console.RegisterMatching('[', ']', 'bracket');
    },
    insertNls: function(str, n) {
      var i;
      if ((str != null) && str.length > n) {
        i = n;
        while (i < str.length) {
          str = str.substr(0, i) + '\n' + str.substr(i);
          i += n;
        }
      }
      return str;
    },
    InputCB: function(callback) {
      var _this = this;
      this.console.Input(function(result) {
        try {
          return callback(result);
        } catch (e) {
          return _this.ErrorCB(e);
        }
      });
    },
    OutputCB: function(output) {
      this.lastOutput = output;
      if (output) return this.console.Write(output, 'output');
    },
    ErrorCB: function(error) {
      this.lastOutput = error;
      if (error[-1] !== '\n') error = error + '\n';
      this.console.Write(String(error), 'error');
      return this.Prompt();
    },
    ResultCB: function(result) {
      if (result) {
        if (result[-1] !== '\n') result = result + '\n';
        this.console.Write("=> " + result, 'result');
      }
      return this.Prompt();
    },
    InitCallbacks: function() {
      this.jsrepl.off('error');
      this.jsrepl.on('error', $.proxy(this.ErrorCB, this));
      this.jsrepl.off('result');
      return this.jsrepl.on('result', $.proxy(this.ResultCB, this));
    },
    Evaluate: function(command) {
      var _this = this;
      if (command) {
        this.InitCallbacks();
        this.jsrepl.once('error', function() {
          return _this.validate(command);
        });
        this.jsrepl.once('result', function(result) {
          return _this.validate(command, result);
        });
        return this.jsrepl.eval(command);
      } else {
        return this.Prompt();
      }
    },
    nextLineIndent: function(command) {
      var indent, last_line, lines;
      lines = command.split('\n');
      if (lines.length === 0) {
        return 0;
      } else {
        last_line = lines[lines.length - 1];
        indent = last_line.match(/^\s*/)[0];
        last_line = lines[lines.length - 1].replace(/\s+$/, '');
        if (last_line[last_line.length - 1] === ':') {
          return 1;
        } else if (indent.length && !/^\s*$/.test(last_line)) {
          return 0;
        } else if (last_line[last_line.length - 1] === '\\') {
          return 0;
        } else {
          return false;
        }
      }
    },
    Prompt: function() {
      return this.console.Prompt(true, $.proxy(this.Evaluate, this), this.nextLineIndent);
    }
  };

  window.PyREPL = PyREPL;

}).call(this);
