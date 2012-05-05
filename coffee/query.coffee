class Query
  # Container for query api helper functions
  constructor: ->
    @url = window.location.origin

  filter: (resource, name, op, val) ->
    query = 
      filters: [
        name: name
        op: op
        val: val
      ]
      order_by: [
        field: 'id'
        direction: 'asc'
      ]
    "#{@url}/api/#{resource}?q=#{JSON.stringify query}"
  
window.Q = new Query()