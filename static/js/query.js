(function() {
  var Query;

  Query = (function() {

    function Query() {
      this.url = window.location.origin;
    }

    Query.prototype.filter = function(resource, name, op, val) {
      var query;
      query = {
        filters: [
          {
            name: name,
            op: op,
            val: val
          }
        ],
        order_by: [
          {
            field: 'id',
            direction: 'asc'
          }
        ]
      };
      return "" + this.url + "/api/" + resource + "?q=" + (JSON.stringify(query));
    };

    return Query;

  })();

  window.Q = new Query();

}).call(this);
