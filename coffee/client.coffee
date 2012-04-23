$ ->
  class Tutor
    constructor: (@lesson) ->
      $("h1.standout").append @lesson.title

      @exercises = @lesson.exercises
      @current = @next()
      @completed = []
      caja.initialize cajaServer: 'https://caja.appspot.com', debug: true

    next: ->
      ex = @exercises[0]
      if ex
        @exercises = @exercises[1..]
        $("#exercise").html markdown.toHTML ex.task
        console.log ex.test
        return ex
      else
        $("#exercise").html markdown.toHTML "**AT'LL DO, PIG**"

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
        @next()
      else
        console.log "GREAT FAILURE"

  class Lesson
    constructor: (@id) ->
      @getExercises @id

    getExercises: (id) ->
      query = $.ajax
        url: @exQuery id
        method: 'GET'
        dataType: 'json'
        error: ->
          console.log "Couldn't load Lesson id#{id}"
        async: false
      @exercises = JSON.parse(query.responseText)['objects']

    exQuery: (id) ->
      query = filters: [
        name: 'lesson_id'
        op: 'eq'
        val: id
      ]
      "api/exercise?=#{JSON.stringify query}"

  tutor = new Tutor new Lesson 1

  PyREPL.init tutor.watch
