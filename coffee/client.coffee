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
        frame.code(@current.url, 'application/javascript', @current.fn)
              .api(code: c, result: r, output: o)
              .run (fn) =>
                @doTest fn

    doTest: (testfn) ->
      if testfn()
        console.log testfn()
      else
        console.log "GREAT FAILURE"

  testFiles = ["file://localhost/Users/ggzach/Dropbox/" +
                  "projects/python27/pyrepl/js/test.js"]

  fnOrTrue = (fn) ->
    if fn is not "" then fn else "function(){return true;}"

  parseFn = (url) ->
    fn = null
    $.ajax
      url: url
      success: (data) ->
        fn = data
      async: false
    fn

  exObj =
    task: "This is the first task."
    url: testFiles[0]

  # exObj.fn = parseFn exObj.url

  # exercises = [exObj]
  # tutor = new Tutor(exercises)

  $("#python-runtime").on 'load', (event) ->
    # PyREPL tutor.watch
    PyREPL ->
