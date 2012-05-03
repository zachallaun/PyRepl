$ ->
  class Tutor
    constructor: (@lesson) ->
      $("h2.title").text(@lesson.title)

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
        $ex.html markdown.toHTML "**Congratulations!** You've finished this lesson."
      $ex.fadeIn(1000)

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
    constructor: (id) ->
      @setExercises id
      @setTitle id

    setExercises: (id) ->
      query = $.ajax
        url: 'api/exercise' + @buildEqQuery 'lesson_id', id
        dataType: 'json'
        error: ->
          console.log "Couldn't load Lesson id#{id}"
        async: false
      @exercises = JSON.parse(query.responseText)['objects']

    setTitle: (id) ->
      query = $.ajax
        url: 'api/lesson' + @buildEqQuery 'id', id
        dataType: 'json'
        async: false
      @title = JSON.parse(query.responseText).objects[0].title

    buildEqQuery: (name, val) ->
      query = filters: [
        name: name
        op: 'eq'
        val: val
      ]
      "?q=#{JSON.stringify query}"

  requestId = ->
    unless window.location.hash
      window.location.hash = "#1"
    parseInt((window.location.hash.split "#")[1])

  lesson = new Lesson requestId()
  if lesson.exercises?
    tutor = new Tutor lesson
    PyREPL.init tutor.watch
  else
    PyREPL.init ->
