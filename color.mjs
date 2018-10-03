var color;

color = Backbone.Model.extend({
  defaults: {},
  randomColor: function() {
    return [_.random(0, 360), 100, 50, 1];
  },
  updateRgb: function(rgba) {
    rgba || (rgba = this.hslToRgb(this.hsla()));
    this.set({
      rgb: [rgba[0], rgba[1], rgba[2]]
    });
    return rgba;
  },
  updateHsl: function(hsla) {
    return this.set({
      h: hsla[0],
      s: hsla[1],
      l: hsla[2]
    });
  },
  updateHex: function(rgba) {
    return this.set({
      hex: this.rgbToHex(rgba || this.rgba())
    });
  },
  h: function(h) {
    if (this.inRange('h', h)) {
      if (this.get('h') !== h) {
        this.set({
          h: h
        });
        this.updateHex(this.updateRgb());
      }
      return h;
    } else {
      return false;
    }
  },
  s: function(s) {
    if (this.inRange('s', s)) {
      if (this.get('s') !== s) {
        this.set({
          s: s
        });
        this.updateHex(this.updateRgb());
      }
      return s;
    } else {
      return false;
    }
  },
  l: function(l) {
    if (this.inRange('l', l)) {
      if (this.get('l') !== l) {
        this.set({
          l: l
        });
        this.updateHex(this.updateRgb());
      }
      return l;
    } else {
      return false;
    }
  },
  a: function(a) {
    if (this.inRange('a', a)) {
      if (this.get('a') !== a) {
        this.set({
          a: a
        });
        this.updateHex(this.updateRgb());
      }
      return a;
    } else {
      return false;
    }
  },
  // Set hsla or get its current value as an array or string
  hsla: function(hsla) {
    if (hsla != null) {
      hsla = this.isHsl(hsla);
      if (hsla) {
        if (this.hsla().join(',') !== hsla.join(',')) {
          this.updateHex(this.updateRgb(this.hslToRgb(hsla)));
          this.updateHsl(hsla);
          this.set({
            a: hsla[3] != null ? hsla[3] : 1
          });
        }
        return hsla;
      } else {
        return false;
      }
    } else {
      return [this.get('h'), this.get('s'), this.get('l'), this.get('a')];
    }
  },
  hslaStr: function(hsla) {
    hsla || (hsla = this.hsla());
    return `hsla(${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%, ${hsla[3]})`;
  },
  rgba: function(rgba) {
    if (rgba != null) {
      rgba = this.isRgb(rgba);
      if (rgba) {
        if (rgba.join(',') !== this.rgba().join(',')) {
          this.set({
            rgb: [rgba[0], rgba[1], rgba[2]],
            a: rgba[3] != null ? rgba[3] : 1
          });
          this.updateHex(rgba);
          this.updateHsl(this.rgbToHsl(rgba));
        }
        return rgba;
      } else {
        return false;
      }
    } else {
      return this.get('rgb').concat(this.get('a'));
    }
  },
  rgbaStr: function() {
    var rgb;
    rgb = this.get('rgb');
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${this.get('a')})`;
  },
  hex: function(hex) {
    var rgba;
    if (hex != null) {
      hex = this.isHex(hex);
      if (hex) {
        if (this.hex() !== hex) {
          this.set({
            hex: hex
          });
          rgba = this.hexToRgb(hex);
          this.updateRgb(rgba);
          this.set({
            a: rgba[3] || 1
          });
          this.updateHsl(this.rgbToHsl(rgba));
        }
        return hex;
      } else {
        return false;
      }
    } else {
      return this.get('hex');
    }
  },
  isHex: function(hex, marker = true) {
    var match, ref;
    match = (ref = hex.match(/^#?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/)) != null ? ref.slice(1) : void 0;
    if (match == null) {
      return false;
    }
    color = _.compact(match).join('');
    if (marker) {
      return '#' + color;
    } else {
      return color;
    }
  },
  isRgb: function(rgb) {
    var c, match, ref, valid;
    if (typeof rgb === 'string') {
      match = (ref = rgb.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(0?\.?\d+)?\s*\)$/)) != null ? ref.slice(1) : void 0;
      if (match == null) {
        return false;
      }
      rgb = (function() {
        var j, len, ref1, results;
        ref1 = _.compact(match);
        results = [];
        for (j = 0, len = ref1.length; j < len; j++) {
          c = ref1[j];
          results.push(parseFloat(c));
        }
        return results;
      })();
    }
    if (rgb[3] == null) {
      rgb[3] = 1;
    }
    valid = rgb[0] <= 255 && rgb[1] <= 255 && rgb[2] <= 255 && rgb[3] <= 1;
    if (valid) {
      return rgb;
    } else {
      return false;
    }
  },
  isHsl: function(hsl) {
    var c, match, ref, valid;
    if (typeof hsl === 'string') {
      match = (ref = hsl.match(/hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\%\s*,\s*(\d{1,3})\%\s*,?\s*(0?\.?\d+)?\s*\)$/)) != null ? ref.slice(1) : void 0;
      if (match == null) {
        return false;
      }
      hsl = (function() {
        var j, len, ref1, results;
        ref1 = _.compact(match);
        results = [];
        for (j = 0, len = ref1.length; j < len; j++) {
          c = ref1[j];
          results.push(parseFloat(c));
        }
        return results;
      })();
    }
    if (hsl[3] == null) {
      hsl[3] = 1;
    }
    valid = hsl[0] <= 360 && hsl[1] <= 100 && hsl[2] <= 100 && hsl[3] <= 1;
    if (valid) {
      return hsl;
    } else {
      return false;
    }
  },
  valid: function(color) {
    var type;
    type = this.type(color);
    if (type === 'hex') {
      return this.isHex(color);
    } else if (type === 'rgb') {
      return this.isRgb(color);
    } else if (type === 'hsl') {
      return this.isHsl(color);
    } else {
      return false;
    }
  },
  inRange: function(part, val) {
    var valid;
    switch (part) {
      case 'h':
        valid = val >= 0 && val <= 360;
        break;
      case 's':
      case 'l':
        valid = val >= 0 && val <= 100;
        break;
      case 'a':
        valid = val >= 0 && val <= 1;
    }
    return valid;
  },
  type: function(color) {
    var str, type;
    str = color.toString();
    return type = str.indexOf('#') >= 0 || str.length === 3 || str.length === 6 ? 'hex' : str.indexOf('%') ? 'hsl' : 'rgb';
  },
  hexToRgb: function(hex) {
    var c;
    hex = this.isHex(hex, false);
    if (!hex) {
      return false;
    }
    if (hex.length !== 6) { // expand the short hex by doubling each character, fc0 -> ffcc00
      hex = ((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = hex.length; j < len; j++) {
          c = hex[j];
          results.push(`${c}${c}`);
        }
        return results;
      })()).join('');
    }
    color = hex.match(/#?(.{2})(.{2})(.{2})/).slice(1);
    return color = ((function() {
      var j, len, results;
      results = [];
      for (j = 0, len = color.length; j < len; j++) {
        c = color[j];
        results.push(parseInt(c, 16));
      }
      return results;
    })()).concat([1]);
  },
  hexToHsl: function(hex) {
    if (hex.indexOf('#') >= 0 || hex.length < 6) {
      hex = this.isHex(hex);
    }
    if (!hex) {
      return false;
    }
    return this.rgbToHsl(this.hexToRgb(hex));
  },
  rgbToHex: function(rgb) {
    var c, hex, i;
    if (typeof rgb === 'string') {
      rgb = this.isRgb(rgb);
    }
    if (rgb) {
      hex = (function() {
        var j, len, ref, results;
        ref = rgb.slice(0, 3);
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          c = ref[j];
          results.push(parseFloat(c).toString(16));
        }
        return results;
      })();
      hex = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = hex.length; j < len; j++) {
          c = hex[j];
          if (c.length === 1) {
            results.push(`0${c}`);
          } else {
            results.push(c);
          }
        }
        return results;
      })();
      hex = hex.join('');
      if (_.compact((function() {
        var j, len, ref, results;
        ref = hex.match(/.{1,2}/g);
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          results.push(i[0] === i[1]);
        }
        return results;
      })()).length === 3) {
        return `#${hex[0]}${hex[2]}${hex[4]}`;
      } else {
        return `#${hex}`;
      }
    }
  },
  rgbToHsl: function(rgb) {
    var a, add, b, diff, g, h, hue, l, lum, max, min, r, s, sat;
    if (typeof rgb === 'string') {
      rgb = this.isRgb(rgb);
    }
    if (!rgb) {
      return false;
    }
    r = parseFloat(rgb[0]) / 255;
    g = parseFloat(rgb[1]) / 255;
    b = parseFloat(rgb[2]) / 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    diff = max - min;
    add = max + min;
    hue = min === max ? 0 : r === max ? ((60 * (g - b) / diff) + 360) % 360 : g === max ? (60 * (b - r) / diff) + 120 : (60 * (r - g) / diff) + 240;
    lum = 0.5 * add;
    sat = lum === 0 ? 0 : lum === 1 ? 1 : lum <= 0.5 ? diff / add : diff / (2 - add);
    h = Math.round(hue);
    s = Math.round(sat * 100);
    l = Math.round(lum * 100);
    a = parseFloat(rgb[3]) || 1;
    return [h, s, l, a];
  },
  hslToRgb: function(hsl) {
    var a, b, bt, g, gt, hue, lum, p, q, r, rt, sat;
    if (typeof hsl === 'string') {
      hsl = this.isHsl(hsl);
    }
    if (!hsl) {
      return false;
    }
    hue = parseInt(hsl[0]) / 360;
    sat = parseInt(hsl[1]) / 100;
    lum = parseInt(hsl[2]) / 100;
    q = lum <= .5 ? lum * (1 + sat) : lum + sat - (lum * sat);
    p = 2 * lum - q;
    rt = hue + (1 / 3);
    gt = hue;
    bt = hue - (1 / 3);
    r = Math.round(this.hueToRgb(p, q, rt) * 255);
    g = Math.round(this.hueToRgb(p, q, gt) * 255);
    b = Math.round(this.hueToRgb(p, q, bt) * 255);
    a = parseFloat(hsl[3]) || 1;
    return [r, g, b, a];
  },
  hslToHex: function(hsl) {
    if (typeof hsl === 'string') {
      hsl = this.isHsl(hsl);
    }
    if (!hsl) {
      return false;
    }
    return this.rgbToHex(this.hslToRgb(hsl));
  },
  hueToRgb: function(p, q, h) {
    if (h < 0) {
      h += 1;
    }
    if (h > 1) {
      h -= 1;
    }
    if ((h * 6) < 1) {
      return p + (q - p) * h * 6;
    } else if ((h * 2) < 1) {
      return q;
    } else if ((h * 3) < 2) {
      return p + (q - p) * ((2 / 3) - h) * 6;
    } else {
      return p;
    }
  }
});

module.exports = function(options) {
  return new color(options);
};

color = Backbone.Model.extend({
  defaults: {},
  randomColor: function() {
    return [_.random(0, 360), 100, 50, 1];
  },
  updateRgb: function(rgba) {
    rgba || (rgba = this.hslToRgb(this.hsla()));
    this.set({
      rgb: [rgba[0], rgba[1], rgba[2]]
    });
    return rgba;
  },
  updateHsl: function(hsla) {
    return this.set({
      h: hsla[0],
      s: hsla[1],
      l: hsla[2]
    });
  },
  updateHex: function(rgba) {
    return this.set({
      hex: this.rgbToHex(rgba || this.rgba())
    });
  },
  h: function(h) {
    if (this.inRange('h', h)) {
      if (this.get('h') !== h) {
        this.set({
          h: h
        });
        this.updateHex(this.updateRgb());
      }
      return h;
    } else {
      return false;
    }
  },
  s: function(s) {
    if (this.inRange('s', s)) {
      if (this.get('s') !== s) {
        this.set({
          s: s
        });
        this.updateHex(this.updateRgb());
      }
      return s;
    } else {
      return false;
    }
  },
  l: function(l) {
    if (this.inRange('l', l)) {
      if (this.get('l') !== l) {
        this.set({
          l: l
        });
        this.updateHex(this.updateRgb());
      }
      return l;
    } else {
      return false;
    }
  },
  a: function(a) {
    if (this.inRange('a', a)) {
      if (this.get('a') !== a) {
        this.set({
          a: a
        });
        this.updateHex(this.updateRgb());
      }
      return a;
    } else {
      return false;
    }
  },
  // Set hsla or get its current value as an array or string
  hsla: function(hsla) {
    if (hsla != null) {
      hsla = this.isHsl(hsla);
      if (hsla) {
        if (this.hsla().join(',') !== hsla.join(',')) {
          this.updateHex(this.updateRgb(this.hslToRgb(hsla)));
          this.updateHsl(hsla);
          this.set({
            a: hsla[3] != null ? hsla[3] : 1
          });
        }
        return hsla;
      } else {
        return false;
      }
    } else {
      return [this.get('h'), this.get('s'), this.get('l'), this.get('a')];
    }
  },
  hslaStr: function(hsla) {
    hsla || (hsla = this.hsla());
    return `hsla(${hsla[0]}, ${hsla[1]}%, ${hsla[2]}%, ${hsla[3]})`;
  },
  rgba: function(rgba) {
    if (rgba != null) {
      rgba = this.isRgb(rgba);
      if (rgba) {
        if (rgba.join(',') !== this.rgba().join(',')) {
          this.set({
            rgb: [rgba[0], rgba[1], rgba[2]],
            a: rgba[3] != null ? rgba[3] : 1
          });
          this.updateHex(rgba);
          this.updateHsl(this.rgbToHsl(rgba));
        }
        return rgba;
      } else {
        return false;
      }
    } else {
      return this.get('rgb').concat(this.get('a'));
    }
  },
  rgbaStr: function() {
    var rgb;
    rgb = this.get('rgb');
    return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${this.get('a')})`;
  },
  hex: function(hex) {
    var rgba;
    if (hex != null) {
      hex = this.isHex(hex);
      if (hex) {
        if (this.hex() !== hex) {
          this.set({
            hex: hex
          });
          rgba = this.hexToRgb(hex);
          this.updateRgb(rgba);
          this.set({
            a: rgba[3] || 1
          });
          this.updateHsl(this.rgbToHsl(rgba));
        }
        return hex;
      } else {
        return false;
      }
    } else {
      return this.get('hex');
    }
  },
  isHex: function(hex, marker = true) {
    var match, ref;
    match = (ref = hex.match(/^#?([0-9a-fA-F]{3})([0-9a-fA-F]{3})?$/)) != null ? ref.slice(1) : void 0;
    if (match == null) {
      return false;
    }
    color = _.compact(match).join('');
    if (marker) {
      return '#' + color;
    } else {
      return color;
    }
  },
  isRgb: function(rgb) {
    var c, match, ref, valid;
    if (typeof rgb === 'string') {
      match = (ref = rgb.match(/rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,?\s*(0?\.?\d+)?\s*\)$/)) != null ? ref.slice(1) : void 0;
      if (match == null) {
        return false;
      }
      rgb = (function() {
        var j, len, ref1, results;
        ref1 = _.compact(match);
        results = [];
        for (j = 0, len = ref1.length; j < len; j++) {
          c = ref1[j];
          results.push(parseFloat(c));
        }
        return results;
      })();
    }
    if (rgb[3] == null) {
      rgb[3] = 1;
    }
    valid = rgb[0] <= 255 && rgb[1] <= 255 && rgb[2] <= 255 && rgb[3] <= 1;
    if (valid) {
      return rgb;
    } else {
      return false;
    }
  },
  isHsl: function(hsl) {
    var c, match, ref, valid;
    if (typeof hsl === 'string') {
      match = (ref = hsl.match(/hsla?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\%\s*,\s*(\d{1,3})\%\s*,?\s*(0?\.?\d+)?\s*\)$/)) != null ? ref.slice(1) : void 0;
      if (match == null) {
        return false;
      }
      hsl = (function() {
        var j, len, ref1, results;
        ref1 = _.compact(match);
        results = [];
        for (j = 0, len = ref1.length; j < len; j++) {
          c = ref1[j];
          results.push(parseFloat(c));
        }
        return results;
      })();
    }
    if (hsl[3] == null) {
      hsl[3] = 1;
    }
    valid = hsl[0] <= 360 && hsl[1] <= 100 && hsl[2] <= 100 && hsl[3] <= 1;
    if (valid) {
      return hsl;
    } else {
      return false;
    }
  },
  valid: function(color) {
    var type;
    type = this.type(color);
    if (type === 'hex') {
      return this.isHex(color);
    } else if (type === 'rgb') {
      return this.isRgb(color);
    } else if (type === 'hsl') {
      return this.isHsl(color);
    } else {
      return false;
    }
  },
  inRange: function(part, val) {
    var valid;
    switch (part) {
      case 'h':
        valid = val >= 0 && val <= 360;
        break;
      case 's':
      case 'l':
        valid = val >= 0 && val <= 100;
        break;
      case 'a':
        valid = val >= 0 && val <= 1;
    }
    return valid;
  },
  type: function(color) {
    var str, type;
    str = color.toString();
    return type = str.indexOf('#') >= 0 || str.length === 3 || str.length === 6 ? 'hex' : str.indexOf('%') ? 'hsl' : 'rgb';
  },
  hexToRgb: function(hex) {
    var c;
    hex = this.isHex(hex, false);
    if (!hex) {
      return false;
    }
    if (hex.length !== 6) { // expand the short hex by doubling each character, fc0 -> ffcc00
      hex = ((function() {
        var j, len, results;
        results = [];
        for (j = 0, len = hex.length; j < len; j++) {
          c = hex[j];
          results.push(`${c}${c}`);
        }
        return results;
      })()).join('');
    }
    color = hex.match(/#?(.{2})(.{2})(.{2})/).slice(1);
    return color = ((function() {
      var j, len, results;
      results = [];
      for (j = 0, len = color.length; j < len; j++) {
        c = color[j];
        results.push(parseInt(c, 16));
      }
      return results;
    })()).concat([1]);
  },
  hexToHsl: function(hex) {
    if (hex.indexOf('#') >= 0 || hex.length < 6) {
      hex = this.isHex(hex);
    }
    if (!hex) {
      return false;
    }
    return this.rgbToHsl(this.hexToRgb(hex));
  },
  rgbToHex: function(rgb) {
    var c, hex, i;
    if (typeof rgb === 'string') {
      rgb = this.isRgb(rgb);
    }
    if (rgb) {
      hex = (function() {
        var j, len, ref, results;
        ref = rgb.slice(0, 3);
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          c = ref[j];
          results.push(parseFloat(c).toString(16));
        }
        return results;
      })();
      hex = (function() {
        var j, len, results;
        results = [];
        for (j = 0, len = hex.length; j < len; j++) {
          c = hex[j];
          if (c.length === 1) {
            results.push(`0${c}`);
          } else {
            results.push(c);
          }
        }
        return results;
      })();
      hex = hex.join('');
      if (_.compact((function() {
        var j, len, ref, results;
        ref = hex.match(/.{1,2}/g);
        results = [];
        for (j = 0, len = ref.length; j < len; j++) {
          i = ref[j];
          results.push(i[0] === i[1]);
        }
        return results;
      })()).length === 3) {
        return `#${hex[0]}${hex[2]}${hex[4]}`;
      } else {
        return `#${hex}`;
      }
    }
  },
  rgbToHsl: function(rgb) {
    var a, add, b, diff, g, h, hue, l, lum, max, min, r, s, sat;
    if (typeof rgb === 'string') {
      rgb = this.isRgb(rgb);
    }
    if (!rgb) {
      return false;
    }
    r = parseFloat(rgb[0]) / 255;
    g = parseFloat(rgb[1]) / 255;
    b = parseFloat(rgb[2]) / 255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    diff = max - min;
    add = max + min;
    hue = min === max ? 0 : r === max ? ((60 * (g - b) / diff) + 360) % 360 : g === max ? (60 * (b - r) / diff) + 120 : (60 * (r - g) / diff) + 240;
    lum = 0.5 * add;
    sat = lum === 0 ? 0 : lum === 1 ? 1 : lum <= 0.5 ? diff / add : diff / (2 - add);
    h = Math.round(hue);
    s = Math.round(sat * 100);
    l = Math.round(lum * 100);
    a = parseFloat(rgb[3]) || 1;
    return [h, s, l, a];
  },
  hslToRgb: function(hsl) {
    var a, b, bt, g, gt, hue, lum, p, q, r, rt, sat;
    if (typeof hsl === 'string') {
      hsl = this.isHsl(hsl);
    }
    if (!hsl) {
      return false;
    }
    hue = parseInt(hsl[0]) / 360;
    sat = parseInt(hsl[1]) / 100;
    lum = parseInt(hsl[2]) / 100;
    q = lum <= .5 ? lum * (1 + sat) : lum + sat - (lum * sat);
    p = 2 * lum - q;
    rt = hue + (1 / 3);
    gt = hue;
    bt = hue - (1 / 3);
    r = Math.round(this.hueToRgb(p, q, rt) * 255);
    g = Math.round(this.hueToRgb(p, q, gt) * 255);
    b = Math.round(this.hueToRgb(p, q, bt) * 255);
    a = parseFloat(hsl[3]) || 1;
    return [r, g, b, a];
  },
  hslToHex: function(hsl) {
    if (typeof hsl === 'string') {
      hsl = this.isHsl(hsl);
    }
    if (!hsl) {
      return false;
    }
    return this.rgbToHex(this.hslToRgb(hsl));
  },
  hueToRgb: function(p, q, h) {
    if (h < 0) {
      h += 1;
    }
    if (h > 1) {
      h -= 1;
    }
    if ((h * 6) < 1) {
      return p + (q - p) * h * 6;
    } else if ((h * 2) < 1) {
      return q;
    } else if ((h * 3) < 2) {
      return p + (q - p) * ((2 / 3) - h) * 6;
    } else {
      return p;
    }
  }
});

module.exports = function(options) {
  return new color(options);
};
