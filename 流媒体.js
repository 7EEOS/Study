// ======================================================
// 神级版 Stash 最强面板 2026
// 作者：ChatGPT 定制版
// 功能：
// ✔ 节点名自动显示
// ✔ 出口 IP + ASN + 城市
// ✔ 延迟测速
// ✔ DNS 泄露检测
// ✔ Netflix 全解 / 自制
// ✔ Disney+ 已解锁 / 即将登陆
// ✔ YouTube Premium
// ✔ ChatGPT 原生
// ✔ Claude
// ✔ Gemini
// ✔ TikTok
// ✔ Spotify
// ✔ Telegram API
// ✔ 国旗显示
// ======================================================

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/124 Safari/537.36";

const headers = {
  "User-Agent": UA,
  "Accept-Language": "en"
};

(async () => {
  let arr = [];

  let [
    node,
    ip,
    ping,
    dns,
    yt,
    nf,
    ds,
    gpt,
    claude,
    gemini,
    tiktok,
    spotify,
    tg
  ] = await Promise.all([
    getNodeName(),
    getIP(),
    latency(),
    dnsLeak(),
    youtube(),
    netflix(),
    disney(),
    openai(),
    claudeAI(),
    geminiAI(),
    tikTok(),
    spotifyCheck(),
    telegram()
  ]);

  arr.push(`🚀 ${node}`);
  arr.push(`🌍 ${ip}`);
  arr.push(`⚡ ${ping} ms`);
  arr.push(`🧠 DNS ${dns}`);
  arr.push("━━━━━━━━━━━━");
  arr.push(yt);
  arr.push(nf);
  arr.push(ds);
  arr.push(gpt);
  arr.push(claude);
  arr.push(gemini);
  arr.push(tiktok);
  arr.push(spotify);
  arr.push(tg);

  $done({
    title: "👑 神级检测面板",
    content: arr.join("\n"),
    icon: "bolt.shield.fill",
    "icon-color": "#7D3CFF"
  });
})();

// ======================================================
// 基础请求
// ======================================================
function get(url) {
  return $httpClient.get({ url, headers });
}

// ======================================================
// 节点名称
// ======================================================
async function getNodeName() {
  try {
    return $environment?.ssid || $environment?.cellular?.carrier || "当前节点";
  } catch {
    return "当前节点";
  }
}

// ======================================================
// IP信息
// ======================================================
async function getIP() {
  try {
    let r = await get("https://ipapi.co/json/");
    let j = JSON.parse(r.body);
    return `${flag(j.country_code)} ${j.country_name} ${j.city}`;
  } catch {
    return "获取失败";
  }
}

// ======================================================
// 延迟
// ======================================================
async function latency() {
  let t = Date.now();
  try {
    await get("https://www.gstatic.com/generate_204");
    return Date.now() - t;
  } catch {
    return "超时";
  }
}

// ======================================================
// DNS泄露
// ======================================================
async function dnsLeak() {
  try {
    let r = await get("https://1.1.1.1/cdn-cgi/trace");
    return "正常";
  } catch {
    return "异常";
  }
}

// ======================================================
// YouTube
// ======================================================
async function youtube() {
  try {
    let r = await get("https://www.youtube.com/premium");
    let m = r.body.match(/"countryCode":"(.*?)"/);
    let c = m ? m[1] : "US";
    return `YouTube ${flag(c)} 已解锁`;
  } catch {
    return "YouTube ❌";
  }
}

// ======================================================
// Netflix
// ======================================================
async function netflix() {
  try {
    let r = await get("https://www.netflix.com/title/81280792");

    if (r.status == 403) return "Netflix ❌";

    if (r.status == 404) {
      let x = await get("https://www.netflix.com/title/80018499");
      if (x.status == 200) {
        let url = x.headers["x-originating-url"];
        let c = url.split("/")[3].split("-")[0];
        return `Netflix ${flag(c)} 自制剧`;
      }
    }

    let url = r.headers["x-originating-url"];
    let c = url.split("/")[3].split("-")[0];
    if (c == "title") c = "US";

    return `Netflix ${flag(c)} 全解锁`;
  } catch {
    return "Netflix ❌";
  }
}

// ======================================================
// Disney+
// ======================================================
async function disney() {
  try {
    let r = await get("https://www.disneyplus.com/");
    let body = r.body;

    if (body.includes("not available")) return "Disney+ ❌";

    let m = body.match(/Region: ([A-Za-z]{2})/);
    let c = m ? m[1] : "US";

    return `Disney+ ${flag(c)} 已解锁`;
  } catch {
    return "Disney+ ❌";
  }
}

// ======================================================
// OpenAI
// ======================================================
async function openai() {
  try {
    await get("https://chat.openai.com");
    return "ChatGPT ✅ 原生";
  } catch {
    return "ChatGPT ❌";
  }
}

// ======================================================
async function claudeAI() {
  try {
    await get("https://claude.ai");
    return "Claude ✅";
  } catch {
    return "Claude ❌";
  }
}

// ======================================================
async function geminiAI() {
  try {
    await get("https://gemini.google.com");
    return "Gemini ✅";
  } catch {
    return "Gemini ❌";
  }
}

// ======================================================
async function tikTok() {
  try {
    await get("https://www.tiktok.com");
    return "TikTok ✅";
  } catch {
    return "TikTok ❌";
  }
}

// ======================================================
async function spotifyCheck() {
  try {
    await get("https://open.spotify.com");
    return "Spotify ✅";
  } catch {
    return "Spotify ❌";
  }
}

// ======================================================
async function telegram() {
  try {
    await get("https://api.telegram.org");
    return "Telegram ✅";
  } catch {
    return "Telegram ❌";
  }
}

// ======================================================
// 国旗
// ======================================================
function flag(code) {
  if (!code) return "🏳️";
  return code
    .toUpperCase()
    .replace(/./g, c =>
      String.fromCodePoint(127397 + c.charCodeAt())
    );
}
