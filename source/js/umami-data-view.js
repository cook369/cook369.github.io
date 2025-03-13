// 从配置文件中获取 umami 的配置
const website_id = CONFIG.web_analytics.umami.website_id;
// 拼接请求地址
const request_url = `${CONFIG.web_analytics.umami.api_server}/api/websites/${website_id}/stats`;
const request_active_url = `${CONFIG.web_analytics.umami.api_server}/api/websites/${website_id}/active`;

const start_time = new Date(CONFIG.web_analytics.umami.start_time).getTime();
const end_time = new Date().getTime();
const token = CONFIG.web_analytics.umami.token;

// 检查配置是否为空
if (!website_id) {
  throw new Error("Umami website_id is empty");
}
if (!request_url) {
  throw new Error("Umami request_url is empty");
}
if (!start_time) {
  throw new Error("Umami start_time is empty");
}
if (!token) {
  throw new Error("Umami token is empty");
}

// 构造请求参数
const params = new URLSearchParams({
  startAt: start_time,
  endAt: end_time,
});
// 构造请求头
const request_header = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + token,
  },
};

// 获取站点统计数据
async function siteStats() {
  try {
    const statResponse = await fetch(`${request_url}?${params}`, request_header);
    const statData = await statResponse.json();
    const uniqueVisitors = statData.visitors.value; // 获取独立访客数
    const pageViews = statData.pageviews.value; // 获取页面浏览量
    
    // 获取5分钟内在线人数
    const activeResponse = await fetch(`${request_active_url}`, request_header);
    const activeData = await activeResponse.json();
    const visitors = activeData.visitors; // 获取5分钟内独立访客
  
    let contnet = `总访问量${pageViews}次 总访客数${uniqueVisitors}人 当前在线${visitors} 人`;
    let siteDataCtn = document.querySelector("#umami-site-data");
    if (contnet && siteDataCtn) {
        siteDataCtn.textContent = contnet;
    }
  } catch (error) {
    console.error(error);
    return "-1";
  }
}

// 获取页面浏览量
async function pageStats(path) {
  try {
    const response = await fetch(`${request_url}?${params}&url=${path}`, request_header);
    const data = await response.json();
    const pageViews = data.pageviews.value;

    let viewCtn = document.querySelector("#umami-page-views-container");
    if (viewCtn) {
      let ele = document.querySelector("#umami-page-views");
      if (ele) {
        ele.textContent = pageViews;
        viewCtn.style.display = "inline";
      }
    }
  } catch (error) {
    console.error(error);
    return "-1";
  }
}

siteStats();

// 获取页面容器
let viewCtn = document.querySelector("#umami-page-views-container");
// 如果页面容器存在，则获取页面浏览量
if (viewCtn) {
  let path = window.location.pathname;
  let target = decodeURI(path.replace(/\/*(index.html)?$/, "/"));
  pageStats(target);
}