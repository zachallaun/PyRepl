$ ->
  class PyWatcher
    act: (c, r, o) ->
      console.log c, r, o

  watcher = new PyWatcher()

  $("#python-runtime").on 'load', (event) ->
    PyREPL watcher.act
