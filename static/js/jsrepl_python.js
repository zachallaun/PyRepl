(function() {

  self.JSREPLEngine = (function() {

    function JSREPLEngine(unused_input, output, result, error, sandbox, ready) {
      var bufferError, printOutput,
        _this = this;
      this.output = output;
      this.result = result;
      this.error = error;
      this.Python = sandbox.Python;
      sandbox.print = (function() {});
      this.error_buffer = [];
      printOutput = makeUtf8Print(output);
      bufferError = function(chr) {
        if (chr != null) {
          if (_this.Python.isHandlingError) {
            return _this.error_buffer.push(String.fromCharCode(chr));
          } else {
            return printOutput(chr);
          }
        }
      };
      this.Python.initialize(null, printOutput, bufferError);
      ready();
    }

    JSREPLEngine.prototype.Eval = function(command) {
      var result;
      this.error_buffer = [];
      try {
        result = this.Python.eval(encodeUtf8(command));
        if (result === void 0) {
          return this.error(this.error_buffer.join('') || 'Unknown error.');
        } else {
          this.output(this.error_buffer.join(''));
          return this.result(result);
        }
      } catch (e) {
        return this.error('Internal error: ' + e);
      }
    };

    JSREPLEngine.prototype.RawEval = function(command) {
      return this.Eval(command);
    };

    JSREPLEngine.prototype.GetNextLineIndent = function(command) {
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
        } else if (indent.length && last_line[last_line.length - 1].length !== 0) {
          return 0;
        } else {
          return false;
        }
      }
    };

    return JSREPLEngine;

  })();

}).call(this);
