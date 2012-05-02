$ ->
  class Tester
    constructor: () ->
      caja.initialize cajaServer: 'https://caja.appspot.com', debug: true

    watch: (command, result) =>
      test = $('#ex-test').val()
      if test
        @test = test
        @validate command, result, PyREPL.lastOutput

    validate: (c, r, o) =>
      caja.load undefined, undefined, (frame) =>
        frame.code(window.location.origin, 'application/javascript', @test)
              .api(code: c, result: r, output: o)
              .run (fn) =>
                @doTest fn

    doTest: (fn) ->
      if fn()
        PyREPL.console.Write 'Passed\n'
      else
        PyREPL.console.Write 'Failed\n'

  tester = new Tester()

  PyREPL.init tester.watch