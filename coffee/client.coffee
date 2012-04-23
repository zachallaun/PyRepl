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
      @nextExercise if ex then ex.task else null
      if ex
        @exercises = @exercises[1..]
        console.log ex.test
        return ex

    nextExercise: (task) ->
      $ex = $("#exercise")
      if task
        $ex.html markdown.toHTML task
      else
        $ex.html markdown.toHTML "**AT'LL DO, PIG**"

    watch: (command, result) =>
      if @current.test
        @validate command, result, PyREPL.lastOutput

    validate: (c, r, o) =>
      caja.load undefined, undefined, (frame) =>
        frame.code(window.location.origin, 'application/javascript', @current.test)
              .api(code: c, result: r, output: o)
              .run (fn) =>
                @doTest fn

    doTest: (fn) ->
      if fn()
        @current = @next()
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
      "api/exercise?q=#{JSON.stringify query}"

  window.Lesson = Lesson

  lesson = new Lesson 2
  if lesson.exercises.length > 0
    tutor = new Tutor lesson
    PyREPL.init tutor.watch
  else
    PyREPL.init ->
