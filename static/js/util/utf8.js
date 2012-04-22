(function() {

  this.makeUtf8Print = function(print) {
    var buffer;
    buffer = [];
    return function(chr) {
      var uni;
      if (!(chr != null)) return;
      if (chr < 0) chr += 256;
      switch (buffer.length) {
        case 0:
          if (chr < 128) {
            return print(String.fromCharCode(chr));
          } else {
            return buffer.push(chr);
          }
          break;
        case 1:
          if (buffer[0] > 191 && buffer[0] < 224) {
            uni = ((buffer[0] & 31) << 6) | (chr & 63);
            print(String.fromCharCode(uni));
            return buffer = [];
          } else {
            return buffer.push(chr);
          }
          break;
        case 2:
          uni = ((buffer[0] & 15) << 12) | ((buffer[1] & 63) << 6) | (chr & 63);
          print(String.fromCharCode(uni));
          return buffer = [];
      }
    };
  };

  this.encodeUtf8 = function(str) {
    var c, utftext, _i, _len, _ref;
    utftext = [];
    _ref = str.split('');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      c = _ref[_i];
      c = c.charCodeAt(0);
      if (c < 128) {
        utftext.push(String.fromCharCode(c));
      } else if (c > 127 && c < 2048) {
        utftext.push(String.fromCharCode((c >> 6) | 192));
        utftext.push(String.fromCharCode((c & 63) | 128));
      } else {
        utftext.push(String.fromCharCode((c >> 12) | 224));
        utftext.push(String.fromCharCode(((c >> 6) & 63) | 128));
        utftext.push(String.fromCharCode((c & 63) | 128));
      }
    }
    return utftext.join('');
  };

}).call(this);
