// 사용자별 개인화 테마 관리
class UserTheme {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    // 초기화
    init() {
        this.loadCurrentUser();
        this.applyUserTheme();
    }

    // 현재 사용자 정보 로드
    loadCurrentUser() {
        const userStr = sessionStorage.getItem('currentUser');
        this.currentUser = userStr ? JSON.parse(userStr) : null;
    }

    // 사용자별 테마 적용
    applyUserTheme() {
        if (!this.currentUser) {
            this.applyDefaultTheme();
            return;
        }

        const userColor = this.currentUser.color || '#667eea';
        const adjustedColor = this.adjustBrightness(userColor, -20);
        
        // CSS 변수 설정
        document.documentElement.style.setProperty('--user-primary-color', userColor);
        document.documentElement.style.setProperty('--user-secondary-color', adjustedColor);
        document.documentElement.style.setProperty('--user-gradient', `linear-gradient(135deg, ${userColor} 0%, ${adjustedColor} 100%)`);
        
        // 배경색 적용
        this.applyBackgroundTheme();
        
        // 헤더 테마 적용
        this.applyHeaderTheme();
    }

    // 기본 테마 적용
    applyDefaultTheme() {
        document.documentElement.style.setProperty('--user-primary-color', '#667eea');
        document.documentElement.style.setProperty('--user-secondary-color', '#764ba2');
        document.documentElement.style.setProperty('--user-gradient', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
        
        this.applyBackgroundTheme();
        this.applyHeaderTheme();
    }

    // 배경 테마 적용
    applyBackgroundTheme() {
        const body = document.body;
        if (body) {
            body.style.background = 'var(--user-gradient)';
        }
    }

    // 헤더 테마 적용
    applyHeaderTheme() {
        const headers = document.querySelectorAll('.header, .modal-header');
        headers.forEach(header => {
            header.style.background = 'var(--user-gradient)';
        });
    }

    // 버튼 테마 적용
    applyButtonTheme() {
        const primaryButtons = document.querySelectorAll('.btn-primary, .add-btn, .menu-btn');
        primaryButtons.forEach(btn => {
            btn.style.background = 'var(--user-gradient)';
        });
    }

    // 색상 밝기 조정
    adjustBrightness(hex, percent) {
        const num = parseInt(hex.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }

    // 사용자 정보 업데이트
    updateUserInfo() {
        if (!this.currentUser) return;

        const userInfoElements = document.querySelectorAll('#userInfo, .user-info');
        userInfoElements.forEach(element => {
            element.innerHTML = `${this.currentUser.emoji} ${this.currentUser.name}님`;
            element.style.background = 'var(--user-gradient)';
        });
    }

    // 테마 새로고침
    refresh() {
        this.loadCurrentUser();
        this.applyUserTheme();
        this.applyButtonTheme();
        this.updateUserInfo();
    }

    // 사용자별 색상 가져오기
    getUserColor() {
        return this.currentUser ? this.currentUser.color : '#667eea';
    }

    // 사용자별 그라데이션 가져오기
    getUserGradient() {
        return getComputedStyle(document.documentElement).getPropertyValue('--user-gradient');
    }
}

// 전역 인스턴스 생성
const userTheme = new UserTheme();

// 페이지 로드 시 테마 적용
document.addEventListener('DOMContentLoaded', () => {
    userTheme.refresh();
});

// 전역 함수로 등록
window.userTheme = userTheme; 