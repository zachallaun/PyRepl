PyREPL =
  init: (validate) ->
    @validate = validate

    # Console prefs
    @header = 'Python 2.7.2 (default, Jul 31 2011, 19:30:53)\n' +
             '[GCC 4.2.1 (LLVM, Emscripten 1.5, Empythoned)]\n'

    @console = $("#console").jqconsole @header, ">>> "

    @registerShortcuts()

    @jsrepl = new JSREPL
      input: $.proxy @InputCB, @
      output: $.proxy @OutputCB, @
      result: $.proxy @ResultCB, @
      error: $.proxy @ErrorCB, @
      timeout:
        time: 10000
        callback: =>
          @console.Write 'Error: This is taking too long. Check for infinite loopage.\n', 'error'
          jsrepl.loadLanguage 'python'
          @Prompt()
          return true

    # A hack. TODO: Understand coffeescript :|
    window.jsrepl = @jsrepl

    @jsrepl.loadLanguage 'python', $.proxy(@Prompt, @), true

  registerShortcuts: ->
    # Abort prompt on Ctrl+Z
    @console.RegisterShortcut 'Z', =>
      @console.AbortPrompt()
      @Prompt()
    # Move to line start Ctrl+A
    @console.RegisterShortcut 'A', =>
      @console.MoveToStart()
    # Move to line end Ctrl+E
    @console.RegisterShortcut 'E', =>
      @console.MoveToEnd()
    # Kill prompt text
    @console.RegisterShortcut 'K', =>
      @console.ClearPromptText()
    # CTRL+N and CTRL+P for next and previous history items
    @console.RegisterShortcut 'N', =>
      @console._HistoryNext()
    @console.RegisterShortcut 'P', =>
      @console._HistoryPrevious()

    @console.RegisterMatching '{', '}', 'brace'
    @console.RegisterMatching '(', ')', 'paren'
    @console.RegisterMatching '[', ']', 'bracket'

  # Insert newlines into a string every n characters
  insertNls: (str, n) ->
    if str? and str.length > n
      i = n
      while i < str.length
        str = str.substr(0, i) + '\n' + str.substr(i)
        i += n
    str

  InputCB: (callback) ->
    @console.Input (result) =>
      try
        callback result
      catch e
        @ErrorCB e
    return undefined

  OutputCB: (output) ->
    @lastOutput = output
    if output
      @console.Write output, 'output'

  ErrorCB: (error) ->
    @lastOutput = error
    error = error + '\n' if error[-1] isnt '\n'
    @console.Write String(error), 'error'
    @Prompt()

  ResultCB: (result) ->
    if result
      result = result + '\n' if result[-1] isnt '\n'
      @console.Write "=> " + result, 'result'
    @Prompt()

  InitCallbacks: ->
    @jsrepl.off 'error'
    @jsrepl.on 'error', $.proxy(@ErrorCB, @)
    @jsrepl.off 'result'
    @jsrepl.on 'result', $.proxy(@ResultCB, @)

  Evaluate: (command) ->
    if command
      # Remove old error callbacks
      @InitCallbacks()
      @jsrepl.once 'error', =>
        @validate command
      @jsrepl.once 'result', (result) =>
        @validate command, result
      @jsrepl.eval command
    else
      @Prompt()

  nextLineIndent: (command) ->
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

  Prompt: ->
    @console.Prompt true, $.proxy(@Evaluate, @), @nextLineIndent

window.PyREPL = PyREPL