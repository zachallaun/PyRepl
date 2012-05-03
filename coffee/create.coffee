defaultEx =
  task: 
    """
    **Write your exercise in Markdown.** You'll see changes made as you edit.

    **Test your validations** in the Python REPL above. Any changes you make to your exercise's validation function will be immediately testable.
    """
  test: 
    """
    // Javascript validation function.
    //
    // You have access to the following
    // variables:
    //
    // code   => What the user submits
    // result => What the code would return
    // output => Any output that would go to
    //           stdin or stderr

    function () {
      // Must return a boolean.
      return true;
    }
    """


class Tester
  constructor: () ->
    caja.initialize cajaServer: 'https://caja.appspot.com', debug: true
    PyREPL.init @watch

  watch: (command, result) =>
    test = $('#ex-code').val()
    if test
      @test = test
      @validate command, result, PyREPL.lastOutput

  validate: (c, r, o) =>
    caja.load undefined, undefined, (frame) =>
      frame.code(window.location.origin, 'application/javascript', @test)
            .api(code: c, result: r, output: o)
            .run (fn) =>
              @doTest fn, c, r, o

  doTest: (fn, code, result, output) ->
    if fn()
      PyREPL.console.Write 'Validation passed.\n'
      # console.log "code: #{code}", "result: #{result}", "output: #{output}"
    else
      PyREPL.console.Write 'Validation failed.\n'


class CodeManager
  constructor: ->
    @jsEditor = CodeMirror.fromTextArea document.getElementById("ex-code"),
      mode: "javascript"
      theme: "ambiance"
      lineNumbers: true
      matchBrackets: true
      tabSize: 2
      lineWrapping: true
      onChange: (editor) ->
        editor.save()

    @mdEditor = CodeMirror.fromTextArea document.getElementById("ex-description"),
      mode: "markdown"
      theme: "ambiance"
      lineWrapping: true
      onChange: (editor) ->
        editor.save()
        $("#exercise").html markdown.toHTML editor.getValue()

    $(".CodeMirror:first").addClass "first-CodeMirror"
    $("#exercise").show()#.html markdown.toHTML @mdEditor.getValue()


class ExerciseManager
  constructor: (@mirror) ->
    @$exList = $("#ex-list")
    @$newEx = $("#new-ex")

    @setLessonId()
    @getLesson(@lessonId)
    @getExercises(@lessonId)

  setLessonId: ->
    unless window.location.hash
      @exitToNew()
    @lessonId = parseInt((window.location.hash.split "#")[1])

  getLesson: ->
    $.ajax
      method: 'GET'
      url: Q.filter 'lesson', 'id', 'eq', @lessonId
      dataType: 'json'
      success: (data) =>
        data = data.objects
        if data.length
          lesson = data[0]
          $("h2.title").text lesson.title
          $(".wrapper").show()
        else
          @exitToNew()
      error: (xhr, text, err) ->
        console.log xhr, text, err

  getExercises: ->
    $.ajax
      method: 'GET'
      url: Q.filter 'exercise', 'lesson_id', 'eq', @lessonId
      dataType: 'json'
      success: (data) =>
        @populateExercises(data)
      error: (xhr, text, err) ->
        console.log text, err

  populateExercises: (data) ->
    @exercises = data.objects
    @buildLinks()

  buildDefault: ->
    @exercises.push defaultEx
    @buildLinks()
    @activate @exercises.length

  buildLinks: ->
    if @exercises.length
      @$exList.empty()
      $exs = ("<li><strong>#{i}</strong></li>" for i in [1..@exercises.length])
      $exs.push "<li class='new-ex'><strong>+</strong></li>"
      @$exList.html $exs.join ''
    else
      @buildDefault()

  activate: (index) ->
    @select index
    @activeIndex = index - 1
    ex = @exercises[@activeIndex]
    @mirror.mdEditor.setValue ex.task
    @mirror.jsEditor.setValue ex.test

  select: (index) ->
    @$exList.children().removeClass 'selected'
    @$exList.children("li:nth-child(#{index})").addClass 'selected'

  exitToNew: ->
    window.location = window.location.origin + "/new"

$ ->
  new ExerciseManager new CodeManager()
  new Tester()
