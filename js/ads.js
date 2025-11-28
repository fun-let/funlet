// [Funlet 광고 시스템 V5]
// data/ads.json 파일을 읽어서 광고를 표시합니다.

const USER = 'fun-let'; // 사장님 아이디
const REPO = 'funlet';  // 저장소 이름

// 데이터 파일 주소 (캐시 방지 적용)
const DATA_URL = `https://${USER}.github.io/${REPO}/data/ads.json?v=${new Date().getTime()}`;

async function loadAds() {
    try {
        // 1. 장부(JSON) 가져오기
        const response = await fetch(DATA_URL);
        const adData = await response.json();

        // 2. 각 위치에 광고 넣기
        
        // (0) 히어로 배경
        const heroSection = document.getElementById('hero-section');
        if (heroSection && adData.hero && adData.hero.image) {
            heroSection.style.backgroundImage = `url('${adData.hero.image}')`;
            // 히어로는 배경이라 링크 기능은 보통 버튼에 넣지만, 필요시 구현 가능
        }

        // (1) 메인 상단
        injectAd('ad-main-top', adData.mainTop, 'cover');

        // (2) 게임 하단
        injectAd('ad-game-bottom', adData.gameBottom, 'contain');

        // (3) 사이드바
        injectAd('ad-sidebar', adData.sidebar, 'cover');

    } catch (error) {
        console.error("광고 로딩 실패:", error);
    }
}

// 광고 HTML 생성기
function injectAd(elementId, data, fitStyle) {
    const container = document.getElementById(elementId);
    if (!container) return;

    // 데이터가 없거나 이미지가 없으면 대체 문구 표시
    if (!data || !data.image) {
        container.innerHTML = getPlaceholderHTML();
        return;
    }

    // 링크가 없으면 # 처리
    const linkUrl = data.link || "#";

    const img = new Image();
    img.src = data.image;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = fitStyle;
    img.style.borderRadius = 'inherit';

    img.onload = function() {
        container.innerHTML = `<a href="${linkUrl}" target="_blank" style="display:block; width:100%; height:100%; cursor:pointer;">${img.outerHTML}</a>`;
    };

    img.onerror = function() {
        container.innerHTML = getPlaceholderHTML();
    };
}

function getPlaceholderHTML() {
    return `
        <div style="width:100%; height:100%; background: linear-gradient(45deg, #1a1a2e, #16213e); display:flex; flex-direction:column; align-items:center; justify-content:center; color:#666; font-family:'Noto Sans KR'; text-align:center; border: 1px dashed #333;">
            <div style="font-weight:bold; color:#ddd; font-size:0.8rem;">광고주님을 모십니다</div>
            <div style="font-size:0.7rem;">YOUR AD HERE</div>
        </div>
    `;
}

window.addEventListener('DOMContentLoaded', loadAds);
