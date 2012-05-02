(function() {
  var Query;

  Query = (function() {

    function Query() {
      this.url = window.location.origin;
    }

    Query.prototype.queryFor = function(resource, name, op, val) {
      var query;
      query = {
        filters: [
          {
            name: name,
            op: op,
            val: val
          }
        ]
      };
      return "" + this.url + "/api/" + resource + "?q=" + (JSON.stringify(query));
    };

    return Query;

  })();

  window.Q = new Query();

}).call(this);
