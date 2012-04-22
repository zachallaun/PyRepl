
@JSREPL::Languages::python =
  system_name: 'python'
  name: 'Python'
  extension: 'py'
  matchings: [
    ['(', ')']
    ['[', ']']
    ['{', '}']
  ]
  scripts: [
    'util/utf8.js'
    {
      opera: 'extern/python/unclosured/python.js'
      chrome: 'extern/python/closured/python.js'
      default: 'extern/python/reloop-closured/python.js'
    }
  ]
  includes: [
    'extern/python/unclosured'
    'extern/python/closured'
    'extern/python/reloop-closured'
  ]
  engine: 'jsrepl_python.js'
  worker_friendly: true
  minifier: 'none'
  emscripted: true
