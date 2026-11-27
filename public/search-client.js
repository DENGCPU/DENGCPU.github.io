(function (root) {
  var indexPromise = null;
  var searchIndex = [];
  var indexReady = false;

  function excerpt(text, query, radius) {
    var size = radius || 48;
    var at = text.indexOf(query);
    if (at === -1) return '';
    var start = Math.max(0, at - size);
    var end = Math.min(text.length, at + query.length + size);
    var slice = text.slice(start, end).replace(/\s+/g, ' ');
    if (start > 0) slice = '…' + slice;
    if (end < text.length) slice = slice + '…';
    return slice;
  }

  function matchScore(item, query) {
    var title = item.title || '';
    var summary = item.summary || '';
    var series = item.series || '';
    var body = item.body || '';
    if (title.indexOf(query) !== -1) return 5;
    if (series.indexOf(query) !== -1) return 4;
    if (summary.indexOf(query) !== -1) return 3;
    if (body.indexOf(query) !== -1) return 2;
    return 0;
  }

  function snippet(item, query) {
    if (item.summary && (item.title.indexOf(query) !== -1 || item.summary.indexOf(query) !== -1)) return item.summary;
    if (item.body && item.body.indexOf(query) !== -1) return excerpt(item.body, query);
    if (item.summary) return item.summary;
    return item.series ? item.channel + ' · ' + item.series : item.channel;
  }

  function rank(query) {
    if (!query) return [];
    return searchIndex
      .map(function (item) {
        return { item: item, score: matchScore(item, query) };
      })
      .filter(function (entry) {
        return entry.score > 0;
      })
      .sort(function (a, b) {
        return b.score - a.score || b.item.date.localeCompare(a.item.date);
      })
      .map(function (entry) {
        return entry.item;
      });
  }

  function loadIndex() {
    if (indexPromise) return indexPromise;
    indexPromise = fetch('/search-index.json')
      .then(function (response) {
        if (!response.ok) throw new Error('bad index');
        return response.json();
      })
      .then(function (data) {
        searchIndex = Array.isArray(data) ? data : [];
        indexReady = true;
        return searchIndex;
      })
      .catch(function () {
        indexReady = false;
        searchIndex = [];
        return searchIndex;
      });
    return indexPromise;
  }

  function createHit(item, query, className) {
    var link = document.createElement('a');
    link.className = className || 'search-suggest-item';
    link.href = item.href;
    var title = document.createElement('span');
    title.className = 'search-suggest-title';
    title.textContent = item.title;
    var desc = document.createElement('span');
    desc.className = 'search-suggest-desc';
    desc.textContent = snippet(item, query);
    link.append(title, desc);
    return link;
  }

  function debounce(fn, ms) {
    var timer = 0;
    return function () {
      var self = this;
      var args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function () {
        fn.apply(self, args);
      }, ms);
    };
  }

  function initHeader(options) {
    var toggle = document.querySelector(options.toggleEl);
    var panel = document.querySelector(options.panelEl);
    var input = document.querySelector(options.inputEl);
    var dropdown = document.querySelector(options.dropdownEl);
    var form = document.querySelector(options.formEl);
    var delay = options.debounceMs || 300;
    var limit = options.previewLimit || 6;
    if (!input) return;

    var isSearchPage = location.pathname.replace(/\/$/, '') === '/search';

    function setOpen(open) {
      if (!panel || !toggle) return;
      panel.hidden = !open;
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) input.focus();
    }

    function renderDropdown(query, list) {
      if (!dropdown) return;
      dropdown.replaceChildren();
      if (!query) {
        dropdown.hidden = true;
        return;
      }
      if (!list.length) {
        dropdown.hidden = true;
        return;
      }
      dropdown.hidden = false;
      list.slice(0, limit).forEach(function (item) {
        dropdown.append(createHit(item, query));
      });
      if (list.length > limit) {
        var more = document.createElement('a');
        more.className = 'search-suggest-more';
        more.href = '/search/?q=' + encodeURIComponent(query);
        more.textContent = '查看全部 ' + list.length + ' 篇';
        dropdown.append(more);
      }
    }

    function onQuery() {
      var query = (input.value || '').trim();
      if (!query) {
        renderDropdown('', []);
        return;
      }
      if (!indexReady) {
        loadIndex().then(function () {
          onQuery();
        });
        return;
      }
      renderDropdown(query, rank(query));
      if (isSearchPage) {
        root.dorothySearch?.runPageSearch?.(query);
      }
    }

    var runDebounced = debounce(onQuery, delay);

    input.addEventListener('input', runDebounced);

    form?.addEventListener('submit', function (event) {
      var query = (input.value || '').trim();
      if (!query) {
        event.preventDefault();
        return;
      }
      if (isSearchPage) {
        event.preventDefault();
        history.replaceState(null, '', '/search/?q=' + encodeURIComponent(query));
        onQuery();
        return;
      }
    });

    toggle?.addEventListener('click', function () {
      setOpen(panel.hidden);
    });

    document.addEventListener('click', function (event) {
      if (!panel || panel.hidden) return;
      if (window.matchMedia('(min-width: 641px)').matches) return;
      var wrap = panel.closest('.site-search-wrap');
      if (wrap && !wrap.contains(event.target)) setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && panel && !panel.hidden) setOpen(false);
    });

    var initial = new URLSearchParams(location.search).get('q');
    if (initial) {
      input.value = initial;
      if (isSearchPage) setOpen(true);
      loadIndex().then(function () {
        if (isSearchPage) renderDropdown(initial, rank(initial));
        else onQuery();
      });
    }
  }

  function initPage(options) {
    var hint = document.querySelector(options.hintEl);
    var results = document.querySelector(options.resultsEl);
    var input = document.querySelector(options.inputEl || '#site-search-input');
    var delay = options.debounceMs || 300;

    function render(query, list) {
      if (!results || !hint) return;
      results.replaceChildren();
      if (!indexReady) {
        hint.textContent = '正在准备索引…';
        return;
      }
      if (!query) {
        hint.textContent = '输入几个字开始搜索。';
        return;
      }
      if (!list.length) {
        hint.textContent = '没有匹配的文章。';
        return;
      }
      hint.textContent = '找到 ' + list.length + ' 篇。';
      list.forEach(function (item) {
        var link = document.createElement('a');
        link.className = 'post-row search-hit';
        link.href = item.href;
        var title = document.createElement('span');
        title.className = 'post-title';
        title.textContent = item.title;
        var meta = document.createElement('span');
        meta.className = 'post-meta';
        meta.textContent = item.date;
        var desc = document.createElement('span');
        desc.className = 'channel-desc';
        desc.textContent = snippet(item, query);
        link.append(title, meta, desc);
        results.append(link);
      });
    }

    function run(query) {
      var q = typeof query === 'string' ? query : (input?.value || '').trim();
      render(q, rank(q));
    }

    root.dorothySearch.runPageSearch = run;

    loadIndex().then(function (data) {
      if (hint) {
        hint.textContent = data.length ? '共 ' + data.length + ' 篇可搜索。' : '索引没有加载，请稍后再试。';
      }
      var initial = new URLSearchParams(location.search).get('q');
      if (initial) run(initial);
    });
  }

  root.dorothySearch = {
    loadIndex: loadIndex,
    rank: rank,
    initHeader: initHeader,
    initPage: initPage,
  };
})(window);