$ ->
  class Tutor
    constructor: (@exercises) ->
      @current = @next()
      @completed = []
      caja.initialize cajaServer: 'https://caja.appspot.com', debug: true

    next: ->
      ex = @exercises[0]
      @exercises = @exercises[1..]
      return ex

    watch: (command, result) =>
      @validate command, result, PyREPL.lastOutput

    validate: (c, r, o) =>
      if @current.test
        caja.load undefined, undefined, (frame) =>
          frame.code(window.location.origin, 'application/javascript', @current.test)
                .api(code: c, result: r, output: o)
                .run (fn) =>
                  @doTest fn

    doTest: (fn) ->
      if fn()
        console.log fn()
      else
        console.log "GREAT FAILURE"

  # testFiles = ["/static/js/tests/test.js"]

  # fnOrTrue = (fn) ->
  #   if fn is not "" then fn else "function(){return true;}"

  # parseFn = (url) ->
  #   fn = null
  #   $.ajax
  #     url: url
  #     dataType: 'text'
  #     success: (data) ->
  #       fn = data
  #     error: (data) ->
  #       console.log 'ajax error'
  #     async: false
  #   fn

  getExercises = (url) ->
    x = $.ajax
      method: 'GET'
      url: url
      dataType: 'json'
      error: ->
        console.log 'ajax error'
      async: false
    return JSON.parse(x.responseText).objects

  # exObj =
  #   task: "This is the first task."
  #   url: testFiles[0]

  # exObj.fn = parseFn exObj.url

  # exercises = [exObj]

  exercises = getExercises('api/lesson')
  tutor = new Tutor exercises

  PyREPL.init tutor.watch
