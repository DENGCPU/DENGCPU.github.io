(function (root) {
  var tokenKey = 'dorothyjay-github-token';
  var authorKey = 'dorothyjay-author';
  var memoryKey = 'dorothyjay-private-posts';
  var repo = 'DENGCPU/DENGCPU.github.io';
  var channelOrder = ['frontend', 'ai', 'books', 'life', 'other'];
  var channelNames = {
    frontend: '前端学习',
    ai: 'AI',
    books: '书籍',
    life: '生活',
    other: '其他',
  };

  function isAuthor() {
    if ((localStorage.getItem(tokenKey) || '').trim()) return true;
    return localStorage.getItem(authorKey) === '1';
  }

  function markAuthor() {
    localStorage.setItem(authorKey, '1');
  }

  function remember(entry) {
    if (!entry || !entry.id) return;
    var title = entry.title && entry.title !== 'private' ? entry.title : '加密文章';
    var next = [{
      id: entry.id,
      title: title,
      date: String(entry.date || '').slice(0, 10),
      channel: entry.channel && channelNames[entry.channel] ? entry.channel : 'other',
      series: entry.series || '',
    }].concat(memory().filter(function (item) { return item.id !== entry.id; })).slice(0, 40);
    localStorage.setItem(memoryKey, JSON.stringify(next));
  }

  function memory() {
    try {
      var parsed = JSON.parse(localStorage.getItem(memoryKey) || '[]');
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      return [];
    }
  }

  function visibleTitle(item, saved) {
    if (item && item.title && item.title !== 'private') return item.title;
    if (saved && saved.title && saved.title !== 'private') return saved.title;
    return '加密文章';
  }

  function parseFront(text) {
    var data = {};
    if (!text || text.slice(0, 4) !== '---\n') return data;
    var end = text.indexOf('\n---', 4);
    var block = text.slice(4, end === -1 ? text.length : end);
    block.split('\n').forEach(function (line) {
      var index = line.indexOf(':');
      if (index === -1) return;
      var key = line.slice(0, index).trim();
      var value = line.slice(index + 1).trim();
      if (value.charAt(0) === '"' && value.charAt(value.length - 1) === '"') {
        value = value.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, '\\');
      }
      data[key] = value;
    });
    return data;
  }

  function plainEntry(item) {
    return {
      id: item.id,
      title: visibleTitle(item),
      date: String(item.date || '').slice(0, 10),
      channel: item.channel || 'other',
      series: item.series || '',
    };
  }

  async function list() {
    var token = (localStorage.getItem(tokenKey) || '').trim();
    var headers = {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    };
    if (token) headers.Authorization = 'Bearer ' + token;
    var response = await fetch(
      'https://api.github.com/repos/' + repo + '/contents/src/content/posts/private?ref=master',
      { headers: headers },
    );
    if (response.status === 404) {
      localStorage.setItem(memoryKey, '[]');
      return [];
    }
    if (!response.ok) throw new Error('没有读到加密文章。');
    var data = await response.json();
    if (!Array.isArray(data)) throw new Error('没有读到加密文章。');
    var posts = [];
    for (var index = 0; index < data.length; index += 1) {
      var file = data[index];
      if (!file || !file.name || !/\.md$/.test(file.name) || !file.download_url) continue;
      var head = await fetch(file.download_url, { headers: { Range: 'bytes=0-1500' } });
      if (!head.ok && head.status !== 206) continue;
      var parsed = parseFront(await head.text());
      var id = 'private/' + file.name.replace(/\.md$/, '');
      var local = memory().find(function (item) { return item.id === id; });
      var legacy = !parsed.title || parsed.title === 'private';
      var channel = parsed.channel && channelNames[parsed.channel] ? parsed.channel : 'other';
      if (legacy && local && local.channel && channelNames[local.channel]) channel = local.channel;
      posts.push({
        id: id,
        title: visibleTitle(parsed, local),
        date: String(parsed.date || (local && local.date) || '').slice(0, 10),
        channel: channel,
        series: (legacy && local && local.series) || parsed.series || '',
      });
    }
    posts.sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
    localStorage.setItem(memoryKey, JSON.stringify(posts.slice(0, 40)));
    return posts;
  }

  function rowDate(row) {
    var meta = row.querySelector('.post-meta');
    var match = meta && meta.textContent.match(/\d{4}-\d{2}-\d{2}/);
    return match ? match[0] : '';
  }

  function insertByDate(list, row, date, order) {
    var rows = Array.prototype.slice.call(list.querySelectorAll(':scope > .post-row'));
    var before = rows.find(function (item) {
      var current = rowDate(item);
      if (!current || !date) return false;
      return order === 'asc' ? current > date : current < date;
    });
    if (before) list.insertBefore(row, before);
    else list.append(row);
  }

  function makeRow(post, showChannel) {
    var link = document.createElement('a');
    link.className = 'post-row';
    link.href = '/' + post.id + '/';
    var title = document.createElement('span');
    title.className = 'post-title';
    title.append(document.createTextNode(post.title || '加密文章'));
    var mark = document.createElement('span');
    mark.className = 'lock-mark';
    mark.textContent = '加密';
    title.append(mark);
    var meta = document.createElement('span');
    meta.className = 'post-meta';
    meta.textContent = post.date || '';
    link.append(title, meta);
    if (showChannel) {
      var desc = document.createElement('span');
      desc.className = 'channel-desc';
      var name = channelNames[post.channel] || '';
      desc.textContent = post.series ? name + ' · ' + post.series : name;
      if (desc.textContent) link.append(desc);
    }
    return link;
  }

  function insertSection(writing, section, channel) {
    var siblings = Array.prototype.slice.call(writing.querySelectorAll(':scope > [data-channel]'));
    var index = channelOrder.indexOf(channel);
    var before = siblings.find(function (item) {
      return channelOrder.indexOf(item.dataset.channel) > index;
    });
    if (before) writing.insertBefore(section, before);
    else writing.append(section);
  }

  function listed(id) {
    return !!document.querySelector('a.post-row[href="/' + id + '/"]');
  }

  function applyRememberedTitles() {
    var byId = {};
    memory().forEach(function (item) {
      if (item && item.id && item.title && item.title !== 'private' && item.title !== '加密文章') byId[item.id] = item.title;
    });
    document.querySelectorAll('a.post-row').forEach(function (row) {
      var href = row.getAttribute('href') || '';
      var id = href.replace(/^\/+|\/+$/g, '');
      if (!byId[id]) return;
      var title = row.querySelector('.post-title');
      if (!title) return;
      var replaced = false;
      Array.prototype.forEach.call(title.childNodes, function (node) {
        if (replaced || node.nodeType !== 3 || !node.textContent.trim()) return;
        node.textContent = byId[id];
        replaced = true;
      });
    });
  }

  function placeHome(posts) {
    var list = document.querySelector('#recent-posts .post-list');
    if (!list || list.dataset.authorPosts === 'ready') return;
    posts.forEach(function (post) {
      if (listed(post.id)) return;
      insertByDate(list, makeRow(post, true), post.date, 'desc');
      var count = document.querySelector('.channel-row[data-channel="' + post.channel + '"] .channel-count');
      if (count) count.textContent = String(Number(count.textContent || '0') + 1);
    });
    list.dataset.authorPosts = 'ready';
  }

  function placeWriting(posts) {
    var writing = document.querySelector('#writing-index');
    if (!writing || writing.dataset.authorPosts === 'ready') return;
    var active = writing.dataset.active || '';
    var visible = posts.filter(function (post) { return !active || post.channel === active; });
    if (!visible.length) return;
    var empty = writing.querySelector('.empty');
    if (empty) empty.remove();
    visible.forEach(function (post) {
      if (listed(post.id)) return;
      var section = writing.querySelector(':scope > [data-channel="' + post.channel + '"]');
      if (!section) {
        section = document.createElement('div');
        section.dataset.channel = post.channel;
        if (!active) {
          var heading = document.createElement('h2');
          heading.className = 'series-heading';
          heading.textContent = channelNames[post.channel] || post.channel;
          section.append(heading);
        }
        insertSection(writing, section, post.channel);
      }
      if (post.channel === 'frontend') {
        var seriesName = post.series || '未归系列';
        var groups = Array.prototype.slice.call(section.querySelectorAll(':scope > .series'));
        var group = groups.find(function (item) { return item.dataset.series === seriesName; });
        if (!group) {
          group = document.createElement('section');
          group.className = 'series';
          group.dataset.series = seriesName;
          group.id = seriesName.replace(/\s+/g, '-');
          var seriesHeading = document.createElement('h2');
          var count = document.createElement('span');
          count.className = 'post-meta';
          count.textContent = '0';
          seriesHeading.append(document.createTextNode(seriesName), count);
          var seriesList = document.createElement('div');
          seriesList.className = 'post-list';
          group.append(seriesHeading, seriesList);
          section.append(group);
        }
        var seriesPosts = group.querySelector('.post-list');
        insertByDate(seriesPosts, makeRow(post, false), post.date, 'asc');
        var seriesCount = group.querySelector('h2 .post-meta');
        if (seriesCount) seriesCount.textContent = String(seriesPosts.querySelectorAll(':scope > .post-row').length);
        return;
      }
      var plainList = section.querySelector(':scope > .post-list');
      if (!plainList) {
        plainList = document.createElement('div');
        plainList.className = 'post-list';
        section.append(plainList);
      }
      insertByDate(plainList, makeRow(post, false), post.date, 'desc');
    });
    writing.dataset.authorPosts = 'ready';
  }

  function place(posts) {
    var path = location.pathname;
    if (path === '/') placeHome(posts);
    if (path === '/writing/' || path.indexOf('/writing/') === 0) placeWriting(posts);
  }

  async function start() {
    var path = location.pathname;
    var home = path === '/';
    var writing = path === '/writing/' || path.indexOf('/writing/') === 0;
    if (!home && !writing) return;
    var saved = memory().map(plainEntry);
    if (!isAuthor() && !saved.length) return;
    try {
      place(await list());
    } catch (error) {
      if (saved.length) place(saved);
    }
  }

  root.dorothyAuthor = {
    list: list,
    remember: remember,
    markAuthor: markAuthor,
    isAuthor: isAuthor,
    visibleTitle: visibleTitle,
    parseFront: parseFront,
  };
  root.dispatchEvent(new Event('dorothy-author-ready'));
  applyRememberedTitles();
  start();
})(typeof window !== 'undefined' ? window : globalThis);
