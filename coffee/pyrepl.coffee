window.PyREPL =
  init: ->
    # Create the console.
    header = 'Python 2.7.2 (default, Jul 31 2011, 19:30:53)\n' +
             '[GCC 4.2.1 (LLVM, Emscripten 1.5, Empythoned)]\n'
    window.jqconsole = $('#console').jqconsole header, '>>> ';

    # Abort prompt on Ctrl+Z
    jqconsole.RegisterShortcut 'Z', ->
      jqconsole.AbortPrompt()
      handler()

    # Move to line start Ctrl+A
    jqconsole.RegisterShortcut 'A', ->
      jqconsole.MoveToStart()
      handler()

    # Move to line end Ctrl+E
    jqconsole.RegisterShortcut 'E', ->
      jqconsole.MoveToEnd()
      handler()

    jqconsole.RegisterMatching '{', '}', 'brace'
    jqconsole.RegisterMatching '(', ')', 'paren'
    jqconsole.RegisterMatching '[', ']', 'bracket'

    # Insert newlines into a string every n characters
    insertNls = (str, n) ->
      if str? and str.length > n
        i = n
        while i < str.length
          str = str.substr(0, i) + '\n' + str.substr(i)
          i += n
      str

    # Initialize Python runtime
    outBuffer = []
    onOut = (chr) ->
      if chr?
        outBuffer.push String.fromCharCode chr

    from = (where) ->
      (toLog) ->
        console.log where, toLog

    write = (o) ->
      if o
        o = o + '\n' if o[-1] isnt '\n'
        jqconsole.Write o
      Prompt()

    Output = (o) ->
      jqconsole.Write o
      Prompt()

    Result = (r) ->
      r = r + '\n' if r[-1] isnt '\n'
      jqconsole.Write r

    jsrepl = new JSREPL
      input: ->
      output: Output
      result: Result
      error: Output
      timeout:
        time: 30000
        callback: (i) ->
          console.log i

    jsrepl.loadLanguage 'python', ->
      Prompt()

    Evaluate = (command) =>
      if command
        jsrepl.eval command
      else
        Prompt()

    Prompt = ->
      jqconsole.Prompt true, Evaluate, nextLineIndent

    #Python.initialize null, onOut, onOut

    nextLineIndent = (command) ->
      lines = command.split '\n'
      if lines.length == 0
        return 0
      else
        last_line = lines[lines.length - 1]
        indent = last_line.match(/^\s*/)[0]
        last_line = lines[lines.length - 1].replace /\s+$/, ''
        if last_line[last_line.length - 1] == ':'
          return 1
        else if indent.length and not /^\s*$/.test last_line
          return 0
        else if last_line[last_line.length - 1] == '\\'
          return 0
        else
          return false


    # Handle a command
    # handler = (command) ->
    #   outBuffer = []
    #   try
    #     if command
    #       result = Python.eval command
    #       out = outBuffer.join('')
    #       # Pass the command, result, and out to callback
    #       cb(command, result, out)
    #       if result?
    #         jqconsole.Write insertNls('=> ' + result + '\n', 90)
    #       else if out?
    #         jqconsole.Write out
    #   catch e
    #     jqconsole.Write 'Internal Error: ' + e + '\n'

    #   jqconsole.Prompt true, handler, nextLineIndent

    # handler()