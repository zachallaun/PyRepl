$ ->
  document.getElementById("lesson-name").focus()

  newLesson = (data) ->
    $.ajax
      url: '/api/lesson'
      type: 'POST'
      contentType: 'application/json'
      data: JSON.stringify data
      dataType: 'json'
      success: (data) ->
        window.location = window.location.origin + "/create##{data.id}"
      error: (xhr, status, e) ->
        showError()

  showError = ->
    $(".ajax-error").show().effect "pulsate", {times: 2}, 300

  $("#submit").on "click", (e) ->
    e.preventDefault()
    name = $("#lesson-name").val()
    desc = $("#lesson-description").val()

    if name != '' and desc != ''
      newLesson title: name, description: desc
    else
      showError()