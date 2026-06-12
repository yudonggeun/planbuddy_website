/**
 * Cliff 앱 ↔ 로딩 콘텐츠(웹) 브리지.
 *
 * Cliff iOS 앱은 영상 처리 로딩 화면에서 이 사이트의 콘텐츠(게임/설문)를
 * WKWebView 로 로드한다. 이 파일은 양방향 통신 프로토콜을 정의한다.
 *
 * ## 프로토콜
 *
 * 웹 → 앱 (커스텀 스킴 딥링크, WKWebView decidePolicyFor 가 가로채 cancel):
 *   - `cliff://content/active` : 콘텐츠 세션 시작 (게임 시작 / 설문 시작)
 *                                → 앱은 영상 처리가 끝나도 결과 화면 전환을 보류한다.
 *   - `cliff://content/idle`   : 콘텐츠 세션 종료 (결과 보러 가기 탭)
 *                                → 앱은 보류 중이던 결과 화면으로 전환한다.
 *
 * 웹 → 앱 (script message handler):
 *   - `window.webkit.messageHandlers.cliffShare.postMessage(dataURL)`
 *     : PNG dataURL 을 전달하면 앱이 네이티브 공유 시트를 띄운다.
 *
 * 앱 → 웹 (evaluateJavaScript):
 *   - `window.__cliffProcessingDone()` : 영상 처리 완료 통지.
 *     콘텐츠는 이 시점부터 "분석 결과 보기" CTA 를 노출하고,
 *     사용자가 탭하면 `contentEnd()` 를 호출한다.
 *
 * ## 앱 감지
 * 앱 WKWebView 는 User-Agent 에 `CliffApp` 마커를 추가한다
 * (applicationNameForUserAgent). 브라우저 단독 접속 시 딥링크/핸들러는
 * 전부 no-op 이 되어 콘텐츠는 일반 웹페이지로 동작한다.
 */
window.CliffBridge = (function () {
  'use strict';

  var inApp = /CliffApp/i.test(navigator.userAgent);
  var processingDone = false;
  var listeners = [];

  /**
   * 커스텀 스킴 딥링크 전송. 페이지 전환을 일으키지 않도록
   * location.href 대신 숨김 iframe 으로 보낸다 (연속 호출에도 안전).
   */
  function send(path) {
    if (!inApp) return;
    var frame = document.createElement('iframe');
    frame.style.display = 'none';
    frame.src = 'cliff://' + path;
    document.body.appendChild(frame);
    setTimeout(function () { frame.remove(); }, 100);
  }

  /** 앱이 영상 처리 완료 시 evaluateJavaScript 로 호출한다. */
  window.__cliffProcessingDone = function () {
    if (processingDone) return;
    processingDone = true;
    listeners.forEach(function (fn) {
      try { fn(); } catch (e) { /* listener 오류가 다른 listener 를 막지 않게 */ }
    });
  };

  return {
    /** 앱 WKWebView 안에서 실행 중인지 여부. */
    inApp: inApp,

    /** 콘텐츠 세션 시작 — 앱이 결과 화면 전환을 보류하게 한다. */
    contentStart: function () { send('content/active'); },

    /** 콘텐츠 세션 종료 — 보류 중이던 결과 화면으로 전환한다. */
    contentEnd: function () { send('content/idle'); },

    /** 영상 처리가 이미 완료됐는지. */
    isProcessingDone: function () { return processingDone; },

    /**
     * 처리 완료 listener 등록. 이미 완료 상태면 즉시 호출된다.
     * 콘텐츠는 이 콜백에서 "분석 결과 보기" CTA 를 노출한다.
     */
    onProcessingDone: function (fn) {
      listeners.push(fn);
      if (processingDone) {
        try { fn(); } catch (e) { /* no-op */ }
      }
    },

    /**
     * PNG dataURL 을 앱 네이티브 공유 시트로 전달.
     * @returns {boolean} 앱에 전달했으면 true, 웹 폴백이 필요하면 false.
     */
    shareImage: function (dataURL) {
      if (inApp && window.webkit && window.webkit.messageHandlers &&
          window.webkit.messageHandlers.cliffShare) {
        window.webkit.messageHandlers.cliffShare.postMessage(dataURL);
        return true;
      }
      return false;
    },
  };
})();
