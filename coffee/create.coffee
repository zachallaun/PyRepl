$ ->
  class Tester
    constructor: () ->
      caja.initialize cajaServer: 'https://caja.appspot.com', debug: true

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

  tester = new Tester()
  PyREPL.init tester.watch

  jsEditor = CodeMirror.fromTextArea document.getElementById("ex-code"),
    mode: "javascript"
    theme: "blackboard"
    lineNumbers: true
    matchBrackets: true
    tabSize: 2
    lineWrapping: true
    onChange: (editor) ->
      editor.save()

  mdEditor = CodeMirror.fromTextArea document.getElementById("ex-description"),
    mode: "text/x-markdown"
    theme: "blackboard"
    lineWrapping: true
    onChange: (editor) ->
      editor.save()
      $("#exercise").html markdown.toHTML editor.getValue()

  $(".CodeMirror:first").addClass "first-CodeMirror"
  $("#exercise").show().html markdown.toHTML mdEditor.getValue()

  window.jsEditor = jsEditor
  window.mdEditor = mdEditor