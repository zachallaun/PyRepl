(function() {

  window.PyREPL = {
    init: function() {
      var Evaluate, Output, Prompt, Result, from, header, insertNls, jsrepl, nextLineIndent, onOut, outBuffer, write,
        _this = this;
      header = 'Python 2.7.2 (default, Jul 31 2011, 19:30:53)\n' + '[GCC 4.2.1 (LLVM, Emscripten 1.5, Empythoned)]\n';
      window.jqconsole = $('#console').jqconsole(header, '>>> ');
      jqconsole.RegisterShortcut('Z', function() {
        jqconsole.AbortPrompt();
        return handler();
      });
      jqconsole.RegisterShortcut('A', function() {
        jqconsole.MoveToStart();
        return handler();
      });
      jqconsole.RegisterShortcut('E', function() {
        jqconsole.MoveToEnd();
        return handler();
      });
      jqconsole.RegisterMatching('{', '}', 'brace');
      jqconsole.RegisterMatching('(', ')', 'paren');
      jqconsole.RegisterMatching('[', ']', 'bracket');
      insertNls = function(str, n) {
        var i;
        if ((str != null) && str.length > n) {
          i = n;
          while (i < str.length) {
            str = str.substr(0, i) + '\n' + str.substr(i);
            i += n;
          }
        }
        return str;
      };
      outBuffer = [];
      onOut = function(chr) {
        if (chr != null) return outBuffer.push(String.fromCharCode(chr));
      };
      from = function(where) {
        return function(toLog) {
          return console.log(where, toLog);
        };
      };
      write = function(o) {
        if (o) {
          if (o[-1] !== '\n') o = o + '\n';
          jqconsole.Write(o);
        }
        return Prompt();
      };
      Output = function(o) {
        jqconsole.Write(o);
        return Prompt();
      };
      Result = function(r) {
        if (r[-1] !== '\n') r = r + '\n';
        return jqconsole.Write(r);
      };
      jsrepl = new JSREPL({
        input: function() {},
        output: Output,
        result: Result,
        error: Output,
        timeout: {
          time: 30000,
          callback: function(i) {
            return console.log(i);
          }
        }
      });
      jsrepl.loadLanguage('python', function() {
        return Prompt();
      });
      Evaluate = function(command) {
        if (command) {
          return jsrepl.eval(command);
        } else {
          return Prompt();
        }
      };
      Prompt = function() {
        return jqconsole.Prompt(true, Evaluate, nextLineIndent);
      };
      return nextLineIndent = function(command) {
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
      };
    }
  };

}).call(this);
