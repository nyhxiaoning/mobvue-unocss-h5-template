(function() {
  // 初始化 JeeWeb
  if (!window.JeeWeb) {
    window.JeeWeb = {
      Language: "zh-CN"
    };
  } else {
    // 如果存在但没 Language，就补上
    if (!window.JeeWeb.Language) {
      window.JeeWeb.Language = "zh-CN";
    }
  }

  // 包装 Proxy
  window.JeeWeb = new Proxy(window.JeeWeb, {
    get(target, prop) {
      if (prop in target) {
        return target[prop];
      }
      console.warn('不存在，返回 undefined');
      return undefined; // 或者返回 ()=>{} 防止直接调用崩溃
    }
  });
})();


