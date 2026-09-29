/**
 * Catalog page: language switching only. The page is complete without this script
 * (English, plain links), so a script failure never hides a game.
 */
(function () {
  'use strict';

  var STRINGS = {
    en: {
      'doc.title': 'HZ Arcade',
      'hero.title': 'Pick a game',
      'hero.sub': 'Free to play in your browser, on phone or desktop. No install, no ads.',
      play: 'Play',
      'suika.title': 'Suika Jelly',
      'suika.desc': 'Drop jelly fruits into a mason jar and merge matching pairs until you grow a watermelon.',
      'gold.title': 'Gold Miner',
      'gold.desc': 'Swing the hook, grab the gold and beat the clock. Play alone or with a friend.',
      'pelican.title': 'Pelican Pedal',
      'pelican.desc': 'A pelican, a bicycle and a whole coast to the sunset. A calm 3D ride.',
      'tag.puzzle': 'Puzzle',
      'tag.leaderboard': 'Global leaderboard',
      'tag.arcade': 'Arcade',
      'tag.coop': 'Two-player co-op',
      'tag.3d': '3D',
      'tag.relax': 'Relaxing',
      'foot.note': 'Games work offline once opened, and can be added to your home screen.',
      'foot.source': 'Source on GitHub',
    },
    'zh-CN': {
      'doc.title': 'HZ 小游戏厅',
      'hero.title': '选一个游戏',
      'hero.sub': '打开浏览器就能玩，手机和电脑都支持。免安装，无广告。',
      play: '开始游戏',
      'suika.title': '果冻合成大西瓜',
      'suika.desc': '把果冻水果丢进玻璃罐，两个相同的会合成更大的，一路合成大西瓜。',
      'gold.title': '黄金矿工',
      'gold.desc': '甩出钩子，抓住黄金，和时间赛跑。可以单人玩，也可以和朋友一起玩。',
      'pelican.title': '鹈鹕踏浪',
      'pelican.desc': '一只鹈鹕，一辆自行车，沿着海岸骑向日落。轻松的 3D 骑行游戏。',
      'tag.puzzle': '益智',
      'tag.leaderboard': '全球排行榜',
      'tag.arcade': '街机',
      'tag.coop': '双人合作',
      'tag.3d': '3D',
      'tag.relax': '休闲',
      'foot.note': '游戏打开一次后可离线游玩，也可以添加到主屏幕。',
      'foot.source': 'GitHub 源代码',
    },
    'zh-TW': {
      'doc.title': 'HZ 小遊戲廳',
      'hero.title': '選一個遊戲',
      'hero.sub': '打開瀏覽器就能玩，手機和電腦都支援。免安裝，無廣告。',
      play: '開始遊戲',
      'suika.title': '果凍合成大西瓜',
      'suika.desc': '把果凍水果丟進玻璃罐，兩個相同的會合成更大的，一路合成大西瓜。',
      'gold.title': '黃金礦工',
      'gold.desc': '甩出鉤子，抓住黃金，和時間賽跑。可以單人玩，也可以和朋友一起玩。',
      'pelican.title': '鵜鶘踏浪',
      'pelican.desc': '一隻鵜鶘，一輛腳踏車，沿著海岸騎向日落。輕鬆的 3D 騎行遊戲。',
      'tag.puzzle': '益智',
      'tag.leaderboard': '全球排行榜',
      'tag.arcade': '街機',
      'tag.coop': '雙人合作',
      'tag.3d': '3D',
      'tag.relax': '休閒',
      'foot.note': '遊戲打開一次後可離線遊玩，也可以加入主畫面。',
      'foot.source': 'GitHub 原始碼',
    },
  };

  var STORAGE_KEY = 'arcade.lang';

  /** Map any BCP-47 tag to a supported language, or null if unrelated. */
  function match(tag) {
    if (!tag) return null;
    var t = String(tag).toLowerCase();
    if (t === 'en' || t.indexOf('en-') === 0) return 'en';
    if (t === 'zh' || t.indexOf('zh-') === 0) {
      return /hant|-tw|-hk|-mo/.test(t) ? 'zh-TW' : 'zh-CN';
    }
    return null;
  }

  function stored() {
    try {
      return match(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      return null;
    }
  }

  /** A language the visitor asked for (link or earlier choice), as opposed to one guessed from the browser. */
  function chosen() {
    return match(new URLSearchParams(location.search).get('lang')) || stored();
  }

  function detect() {
    var c = chosen();
    if (c) return c;
    var langs = navigator.languages || [navigator.language];
    for (var i = 0; i < langs.length; i++) {
      var m = match(langs[i]);
      if (m) return m;
    }
    return 'en';
  }

  function apply(lang, explicit) {
    var table = STRINGS[lang] || STRINGS.en;
    document.documentElement.lang = lang;
    document.title = table['doc.title'];
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var s = table[el.getAttribute('data-i18n')];
      if (s) el.textContent = s;
    });
    document.querySelectorAll('.langs button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang') === lang));
    });
    // The games read ?lang= too. Only pass it on when the visitor picked it; otherwise each
    // game keeps its own remembered language.
    document.querySelectorAll('a.card').forEach(function (a) {
      var base = '/' + a.getAttribute('data-game') + '/';
      a.setAttribute('href', explicit ? base + '?lang=' + encodeURIComponent(lang) : base);
    });
  }

  document.querySelectorAll('.langs button').forEach(function (b) {
    b.addEventListener('click', function () {
      var lang = b.getAttribute('data-lang');
      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (e) {
        /* private mode: the choice lasts for this page only */
      }
      apply(lang, true);
    });
  });

  apply(detect(), chosen() !== null);
})();
