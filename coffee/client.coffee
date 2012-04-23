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

    watch: (c, r, o) =>
      caja.load undefined, undefined, (frame) =>
        frame.code(window.location.origin + @current.url, 'application/javascript', @current.fn)
              .api(code: c, result: r, output: o)
              .run (fn) =>
                @doTest fn

    doTest: (testfn) ->
      if testfn()
        console.log testfn()
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
  window.tutor = new Tutor exercises

  tutor.watch 'hello', 'there', 'friend'
  PyREPL.init()
