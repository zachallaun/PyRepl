(function() {
  var CodeManager, ExerciseManager, Tester, defaultEx,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  defaultEx = {
    task: "**Write your exercise in Markdown.** You'll see changes made as you edit.\n\n**Test your validations** in the Python REPL above. Any changes you make to your exercise's validation function will be immediately testable.",
    test: "function () {\n  // Returns a boolean.\n  var validCode = true;\n  var validResult = true;\n  var validOutput = true;\n\n  return validCode && validResult && validOutput;\n}"
  };

  Tester = (function() {

    function Tester() {
      this.validate = __bind(this.validate, this);
      this.watch = __bind(this.watch, this);      caja.initialize({
        cajaServer: 'https://caja.appspot.com',
        debug: true
      });
      PyREPL.init(this.watch);
    }

    Tester.prototype.watch = function(command, result) {
      var test;
      test = $('#ex-code').val();
      if (test) {
        this.test = test;
        return this.validate(command, result, PyREPL.lastOutput);
      }
    };

    Tester.prototype.validate = function(c, r, o) {
      var _this = this;
      return caja.load(void 0, void 0, function(frame) {
        return frame.code(window.location.origin, 'application/javascript', _this.test).api({
          code: c,
          result: r,
          output: o
        }).run(function(fn) {
          return _this.doTest(fn, c, r, o);
        });
      });
    };

    Tester.prototype.doTest = function(fn, code, result, output) {
      if (fn()) {
        return PyREPL.console.Write('Validation passed.\n');
      } else {
        return PyREPL.console.Write('Validation failed.\n');
      }
    };

    return Tester;

  })();

  CodeManager = (function() {

    function CodeManager() {
      this.jsEditor = CodeMirror.fromTextArea(document.getElementById("ex-code"), {
        mode: "javascript",
        theme: "ambiance",
        lineNumbers: true,
        matchBrackets: true,
        tabSize: 2,
        lineWrapping: true,
        onChange: function(editor) {
          return editor.save();
        }
      });
      this.mdEditor = CodeMirror.fromTextArea(document.getElementById("ex-description"), {
        mode: "markdown",
        theme: "ambiance",
        lineWrapping: true,
        onChange: function(editor) {
          editor.save();
          return $("#exercise").html(markdown.toHTML(editor.getValue()));
        }
      });
      window.mdEditor = this.mdEditor;
      $(".CodeMirror:first").addClass("first-CodeMirror");
      $("#exercise").show();
    }

    return CodeManager;

  })();

  ExerciseManager = (function() {

    function ExerciseManager(mirror) {
      var _this = this;
      this.mirror = mirror;
      this.saveExercise = __bind(this.saveExercise, this);
      this.$exList = $("#ex-list");
      this.setLessonId();
      this.getLesson(this.lessonId);
      this.getExercises(this.lessonId);
      this.setOnBlurSaves();
      this.$exList.on('click', 'li', function(ev) {
        var target;
        target = $(ev.currentTarget);
        if (target.hasClass('new-ex')) {
          return _this.buildDefault();
        } else {
          return _this.activate(parseInt(target.text()));
        }
      });
      window.saveExercise = this.saveExercise;
    }

    ExerciseManager.prototype.setLessonId = function() {
      if (!window.location.hash) this.exitToNew();
      return this.lessonId = parseInt((window.location.hash.split("#"))[1]);
    };

    ExerciseManager.prototype.getLesson = function() {
      var _this = this;
      return $.ajax({
        type: 'GET',
        url: Q.filter('lesson', 'id', 'eq', this.lessonId),
        dataType: 'json',
        success: function(data) {
          var lesson;
          data = data.objects;
          if (data.length) {
            lesson = data[0];
            $("h2.title").text(lesson.title);
            return $(".wrapper").removeClass('hidden');
          } else {
            return _this.exitToNew();
          }
        },
        error: function(xhr, text, err) {
          return console.log(xhr, text, err);
        }
      });
    };

    ExerciseManager.prototype.getExercises = function() {
      var _this = this;
      return $.ajax({
        type: 'GET',
        url: Q.filter('exercise', 'lesson_id', 'eq', this.lessonId),
        dataType: 'json',
        success: function(data) {
          _this.exercises = data.objects;
          return _this.buildLinks();
        },
        error: function(xhr, text, err) {
          return console.log(text, err);
        }
      });
    };

    ExerciseManager.prototype.saveExercise = function(ex) {
      if (ex.id != null) {
        return this.updateExercise(ex);
      } else {
        return this.postExercise(ex);
      }
    };

    ExerciseManager.prototype.updateExercise = function(ex) {
      return $.ajax({
        type: 'PUT',
        url: "/api/exercise/" + ex.id,
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(ex)
      });
    };

    ExerciseManager.prototype.postExercise = function(ex) {
      return $.ajax({
        type: 'POST',
        url: '/api/exercise',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(ex),
        success: function(data) {
          return ex.id = data.id;
        }
      });
    };

    ExerciseManager.prototype.buildDefault = function() {
      var ex;
      ex = {
        task: defaultEx.task,
        test: defaultEx.test,
        lesson_id: this.lessonId
      };
      this.exercises.push(ex);
      this.buildLinks();
      return this.activate(this.exercises.length);
    };

    ExerciseManager.prototype.buildLinks = function() {
      var $exs, i;
      if (this.exercises.length) {
        this.$exList.empty();
        $exs = (function() {
          var _ref, _results;
          _results = [];
          for (i = 1, _ref = this.exercises.length; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
            _results.push("<li><strong>" + i + "</strong></li>");
          }
          return _results;
        }).call(this);
        $exs.push("<li class='new-ex'><strong>+</strong></li>");
        this.$exList.html($exs.join(''));
        return this.activate(1);
      } else {
        return this.buildDefault();
      }
    };

    ExerciseManager.prototype.activate = function(index) {
      var ex;
      this.select(index);
      this.save();
      this.activeIndex = index - 1;
      ex = this.exercises[this.activeIndex];
      this.mirror.mdEditor.setValue(ex.task);
      return this.mirror.jsEditor.setValue(ex.test);
    };

    ExerciseManager.prototype.save = function() {
      var ex;
      if (this.activeIndex != null) {
        ex = this.exercises[this.activeIndex];
        ex.task = this.mirror.mdEditor.getValue();
        return ex.test = this.mirror.jsEditor.getValue();
      }
    };

    ExerciseManager.prototype.setOnBlurSaves = function() {
      var saveEx,
        _this = this;
      saveEx = function() {
        _this.save();
        return _this.saveExercise(_this.exercises[_this.activeIndex]);
      };
      this.mirror.mdEditor.setOption('onBlur', saveEx);
      return this.mirror.jsEditor.setOption('onBlur', saveEx);
    };

    ExerciseManager.prototype.select = function(index) {
      this.$exList.children().removeClass('selected');
      return this.$exList.children("li:nth-child(" + index + ")").addClass('selected');
    };

    ExerciseManager.prototype.exitToNew = function() {
      return window.location = window.location.origin + "/new";
    };

    return ExerciseManager;

  })();

  $(function() {
    new ExerciseManager(new CodeManager());
    return new Tester();
  });

}).call(this);
