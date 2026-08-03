declare global {
  interface Window {
    Kakao?: {
      init: (jsKey: string) => void;
      isInitialized: () => boolean;
      Auth: {
        login: (options: {
          success: (authObj: { access_token: string }) => void;
          fail: (error: unknown) => void;
        }) => void;
      };
    };
  }
}

const KAKAO_SDK_SRC = 'https://developers.kakao.com/sdk/js/kakao.js';

let loadPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
  loadPromise ??= new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${KAKAO_SDK_SRC}"]`,
    );
    if (existing) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = KAKAO_SDK_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('카카오 SDK를 불러오지 못했어요'));
    document.head.appendChild(script);
  });

  return loadPromise;
}

/** 로그인 화면 진입 시 미리 호출해 SDK 준비를 끝내둔다. */
export async function ensureKakaoSdk(): Promise<void> {
  await loadScript();

  if (!window.Kakao) {
    throw new Error('카카오 SDK를 찾을 수 없어요');
  }
  if (!window.Kakao.isInitialized()) {
    const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
    if (!jsKey) {
      throw new Error('NEXT_PUBLIC_KAKAO_JS_KEY가 설정되지 않았어요');
    }
    window.Kakao.init(jsKey);
  }
}

export function isKakaoReady(): boolean {
  return !!window.Kakao?.isInitialized();
}

/**
 * 브라우저는 클릭과 같은 실행 흐름에서 연 팝업만 허용한다.
 * 따라서 이 함수는 async가 아니며 내부에 await도 두지 않는다.
 * (await을 거치면 팝업이 차단되고, SDK가 10분간 폴링하며 앱이 멈춘 것처럼 보인다.)
 */
export function kakaoLogin(): Promise<string> {
  if (!isKakaoReady()) {
    return Promise.reject(
      new Error('카카오 로그인 준비가 아직 끝나지 않았어요'),
    );
  }

  return new Promise<string>((resolve, reject) => {
    window.Kakao!.Auth.login({
      success: (authObj) => resolve(authObj.access_token),
      fail: (error) => reject(error),
    });
  });
}
