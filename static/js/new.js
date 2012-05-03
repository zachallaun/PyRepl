(function() {

  $(function() {
    var newLesson, showError;
    document.getElementById("lesson-name").focus();
    newLesson = function(data) {
      return $.ajax({
        url: '/api/lesson',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(data),
        dataType: 'json',
        success: function(data) {
          return console.log(data);
        },
        error: function(xhr, status, e) {
          return showError();
        }
      });
    };
    showError = function() {
      return $(".ajax-error").show().effect("pulsate", {
        times: 2
      }, 300);
    };
    return $("#submit").on("click", function(e) {
      var desc, name;
      e.preventDefault();
      name = $("#lesson-name").val();
      desc = $("#lesson-description").val();
      if (name !== '' && desc !== '') {
        return newLesson({
          title: name,
          description: desc
        });
      } else {
        return showError();
      }
    });
  });

}).call(this);
