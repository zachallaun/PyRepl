(function() {

  window.PyREPL = function(cb) {
    var handler, header, insertNls, nextLineIndent, onOut, outBuffer;
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
    Python.initialize(null, onOut, onOut);
    nextLineIndent = function(command) {
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
        } else {
          return false;
        }
      }
    };
    handler = function(command) {
      var out, result;
      outBuffer = [];
      try {
        if (command) {
          result = Python.eval(command);
          out = outBuffer.join('');
          cb(command, result, out);
          if (result != null) {
            jqconsole.Write(insertNls('=> ' + result + '\n', 90));
          } else if (out != null) {
            jqconsole.Write(out);
          }
        }
      } catch (e) {
        jqconsole.Write('Internal Error: ' + e + '\n');
      }
      return jqconsole.Prompt(true, handler, nextLineIndent);
    };
    return handler();
  };

}).call(this);
