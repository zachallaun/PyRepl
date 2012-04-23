$ ->
  class Tutor
    constructor: (@exercises) ->
      @current = @next()
      @completed = []
      caja.initialize cajaServer: 'https://caja.appspot.com', debug: true

    next: ->
      fn = @exercises[0]
      @exercises = @exercises[1..]
      fn

    watch: (command, result) =>
      @validate command, result, PyREPL.lastOutput

    validate: (c, r, o) =>
      if @current.fn
        caja.load undefined, undefined, (frame) =>
          frame.code(window.location.origin + @current.url, 'application/javascript', @current.fn)
                .api(code: c, result: r, output: o)
                .run (fn) =>
                  @doTest fn

    doTest: (fn) ->
      if fn()
        console.log fn()
      else
        console.log "GREAT FAILURE"

  testFiles = ["/static/js/tests/test.js"]

  fnOrTrue = (fn) ->
    if fn is not "" then fn else "function(){return true;}"

  parseFn = (url) ->
    fn = null
    $.ajax
      url: url
      dataType: 'text'
      success: (data) ->
        fn = data
      error: (data) ->
        console.log 'ajax error'
      async: false
    fn

  exObj =
    task: "This is the first task."
    url: testFiles[0]

  exObj.fn = parseFn exObj.url

  exercises = [exObj]
  tutor = new Tutor exercises

  PyREPL.init tutor.watch
