// static/js/iframe_helper.js

// دالة للوصول إلى عنصر من iframe
function getElementFromIframe(iframeId, elementId) {
    const iframe = document.getElementById(iframeId);
    if (iframe && iframe.contentWindow && iframe.contentWindow.document) {
      const iframeElement = iframe.contentWindow.document.getElementById(elementId);
      return iframeElement ? iframeElement : null;
    }
    return null;
  }
  
  // دالة لاستدعاء دالة من iframe
  function callIframeFunction(iframeId, functionName, ...args) {
    const iframe = document.getElementById(iframeId);
    if (iframe && iframe.contentWindow && typeof iframe.contentWindow[functionName] === 'function') {
      iframe.contentWindow[functionName](...args);
    } else {
      console.error(`Function ${functionName} not found in iframe.`);
    }
  }
  
  // دالة للوصول إلى عنصر من نافذة الوالد
  function getElementFromParent(elementId) {
    const parentElement = window.parent.document.getElementById(elementId);
    return parentElement ? parentElement : null;
  }
  
  // دالة لاستدعاء دالة من نافذة الوالد
  function callParentFunction(functionName, ...args) {
    if (typeof window.parent[functionName] === 'function') {
      window.parent[functionName](...args);
    } else {
      console.error(`Function ${functionName} not found in parent window.`);
    }
  }
  