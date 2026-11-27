(function () {
  function normalizeLooseAtxHeadings(source) {
    if (!source) return source;
    var text = source.replace(/^(\s{0,3})(#{1,6})([^\s#\n])/gm, '$1$2 $3');
    text = text.replace(/([^\n#])(\s+)(#{1,6})([^\s#\n])/g, '$1\n\n$3 $4');
    return text;
  }
  window.dorothyMarkdownHeadings = { normalizeLooseAtxHeadings: normalizeLooseAtxHeadings };
})();