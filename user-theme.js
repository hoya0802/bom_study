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
        
        // 타이머 게이지바 색상 설정
        this.applyTimerBarTheme(userColor);
        
        // 게임 버튼 색상 설정
        this.applyGameButtonTheme(userColor);
        
        // 배경색 적용
        this.applyBackgroundTheme();
        
        // 헤더 테마 적용
        this.applyHeaderTheme();
        
        // 버튼 테마 적용
        this.applyButtonTheme();
        
        // 사용자 정보 업데이트
        this.updateUserInfo();
    }

    // 기본 테마 적용
    applyDefaultTheme() {
        document.documentElement.style.setProperty('--user-primary-color', '#667eea');
        document.documentElement.style.setProperty('--user-secondary-color', '#764ba2');
        document.documentElement.style.setProperty('--user-gradient', 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)');
        
        // 기본 타이머 게이지바 색상
        this.applyTimerBarTheme('#667eea');
        
        // 기본 게임 버튼 색상
        this.applyGameButtonTheme('#667eea');
        
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
        // 기본 버튼들만 테마 색상 적용
        const primaryButtons = document.querySelectorAll('.btn-primary, .add-btn');
        primaryButtons.forEach(btn => {
            btn.style.background = 'var(--user-gradient)';
        });
        
        // 게임 버튼들도 직접 스타일 적용
        const playButtons = document.querySelectorAll('.play-btn');
        playButtons.forEach(btn => {
            btn.style.background = 'var(--play-btn-gradient)';
        });
        
        const successButtons = document.querySelectorAll('.btn-success');
        successButtons.forEach(btn => {
            btn.style.background = 'var(--play-btn-gradient)';
        });
        
        // 로그아웃 버튼 스타일 적용
        const logoutButtons = document.querySelectorAll('.logout-btn');
        logoutButtons.forEach(btn => {
            btn.style.background = 'var(--logout-btn-gradient)';
        });
        
        // 메뉴 버튼들은 테마에 따라 조화롭게 조정
        this.applyMenuButtonTheme();
        
        // 호버 효과도 사용자 색상으로 적용
        const style = document.createElement('style');
        style.id = 'user-theme-styles';
        style.textContent = `
            .btn:hover, .add-btn:hover {
                box-shadow: 0 10px 20px var(--user-primary-color, rgba(102, 126, 234, 0.3)) !important;
            }
            .play-btn:hover {
                box-shadow: 0 10px 20px var(--play-btn-shadow, rgba(40, 167, 69, 0.3)) !important;
            }
            .btn-success:hover {
                background: var(--play-btn-hover, #1e7e34) !important;
            }
            .logout-btn:hover {
                box-shadow: 0 15px 30px var(--logout-btn-shadow, rgba(220, 53, 69, 0.3)) !important;
            }
            .tab.active {
                color: var(--user-primary-color, #667eea) !important;
                border-bottom-color: var(--user-primary-color, #667eea) !important;
            }
        `;
        
        // 기존 스타일 제거 후 새로 추가
        const existingStyle = document.getElementById('user-theme-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        document.head.appendChild(style);
    }

    // 메뉴 버튼 테마 적용
    applyMenuButtonTheme() {
        const userColor = this.getUserColor();
        const hue = this.getHueFromColor(userColor);
        
        // 테마 색상에 따른 조화로운 색상 계산
        const complementaryHue = (hue + 180) % 360;
        const triadicHue1 = (hue + 120) % 360;
        const triadicHue2 = (hue + 240) % 360;
        
        // 메뉴 버튼별 색상 정의 - 더 자연스러운 조합
        const menuColors = {
            games: userColor, // 게임은 사용자 테마 색상 사용
            text: this.hslToHex(triadicHue1, 65, 55), // 삼각형 보색 1
            stamp: this.hslToHex(triadicHue2, 75, 60), // 삼각형 보색 2
            account_book: this.hslToHex(complementaryHue, 60, 50) // 보완색
        };
        
        // 각 메뉴 버튼에 색상 적용
        Object.keys(menuColors).forEach(menuType => {
            const buttons = document.querySelectorAll(`.menu-btn.${menuType}`);
            buttons.forEach(btn => {
                const color = menuColors[menuType];
                const darkerColor = this.adjustBrightness(color, -25);
                btn.style.background = `linear-gradient(135deg, ${color} 0%, ${darkerColor} 100%)`;
                
                // 호버 효과도 개별 색상에 맞게 조정
                btn.addEventListener('mouseenter', () => {
                    btn.style.boxShadow = `0 15px 30px ${color}40`;
                });
                btn.addEventListener('mouseleave', () => {
                    btn.style.boxShadow = 'none';
                });
            });
        });
    }

    // 색상에서 HSL Hue 값 추출
    getHueFromColor(hex) {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        const delta = max - min;
        
        if (delta === 0) return 0;
        
        let hue = 0;
        if (max === r) {
            hue = ((g - b) / delta) % 6;
        } else if (max === g) {
            hue = (b - r) / delta + 2;
        } else {
            hue = (r - g) / delta + 4;
        }
        
        hue = hue * 60;
        if (hue < 0) hue += 360;
        
        return hue;
    }

    // HSL을 Hex로 변환
    hslToHex(h, s, l) {
        h = h / 360;
        s = s / 100;
        l = l / 100;
        
        const c = (1 - Math.abs(2 * l - 1)) * s;
        const x = c * (1 - Math.abs((h * 6) % 2 - 1));
        const m = l - c / 2;
        
        let r, g, b;
        
        if (h < 1/6) {
            r = c; g = x; b = 0;
        } else if (h < 2/6) {
            r = x; g = c; b = 0;
        } else if (h < 3/6) {
            r = 0; g = c; b = x;
        } else if (h < 4/6) {
            r = 0; g = x; b = c;
        } else if (h < 5/6) {
            r = x; g = 0; b = c;
        } else {
            r = c; g = 0; b = x;
        }
        
        const rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
        const gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
        const bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
        
        return `#${rHex}${gHex}${bHex}`;
    }

    // 타이머 게이지바 테마 적용
    applyTimerBarTheme(userColor) {
        const hue = this.getHueFromColor(userColor);
        
        // 테마 색상과 조화로운 타이머 게이지바 색상 계산
        // 보완색을 사용하여 대비 효과 생성
        const complementaryHue = (hue + 180) % 360;
        const timerColor1 = this.hslToHex(complementaryHue, 75, 60); // 밝은 보완색
        const timerColor2 = this.hslToHex(complementaryHue, 85, 50); // 어두운 보완색
        
        // CSS 변수로 타이머 게이지바 그라데이션 설정
        document.documentElement.style.setProperty('--timer-bar-gradient', 
            `linear-gradient(90deg, ${timerColor1} 0%, ${timerColor2} 100%)`);
    }

    // 게임 버튼 테마 적용
    applyGameButtonTheme(userColor) {
        const hue = this.getHueFromColor(userColor);
        
        // 테마 색상에 따른 조화로운 게임 버튼 색상 계산
        // 삼각형 보색을 사용하여 조화로운 조합 생성
        const triadicHue1 = (hue + 120) % 360;
        const triadicHue2 = (hue + 240) % 360;
        
        // 플레이 버튼 색상 (삼각형 보색 1)
        const playColor1 = this.hslToHex(triadicHue1, 70, 55);
        const playColor2 = this.hslToHex(triadicHue1, 80, 45);
        
        // 카테고리 버튼 색상 (삼각형 보색 2)
        const categoryColor1 = this.hslToHex(triadicHue2, 65, 55);
        const categoryColor2 = this.hslToHex(triadicHue2, 75, 45);
        
        // CSS 변수로 게임 버튼 그라데이션 설정
        document.documentElement.style.setProperty('--play-btn-gradient', 
            `linear-gradient(135deg, ${playColor1} 0%, ${playColor2} 100%)`);
        document.documentElement.style.setProperty('--play-btn-shadow', 
            `${playColor1}40`);
        document.documentElement.style.setProperty('--play-btn-hover', 
            playColor2);
        
        // CSS 변수로 카테고리 버튼 그라데이션 설정
        document.documentElement.style.setProperty('--category-btn-gradient', 
            `linear-gradient(135deg, ${categoryColor1} 0%, ${categoryColor2} 100%)`);
        
        // 로그아웃 버튼 색상 (보완색의 어두운 버전)
        const logoutColor1 = this.hslToHex(complementaryHue, 70, 45);
        const logoutColor2 = this.hslToHex(complementaryHue, 80, 35);
        
        // CSS 변수로 로그아웃 버튼 그라데이션 설정
        document.documentElement.style.setProperty('--logout-btn-gradient', 
            `linear-gradient(135deg, ${logoutColor1} 0%, ${logoutColor2} 100%)`);
        document.documentElement.style.setProperty('--logout-btn-shadow', 
            `${logoutColor1}40`);
        
        // 디버깅: 콘솔에 색상 정보 출력
        console.log('Game Button Theme Applied:', {
            userColor,
            hue,
            triadicHue1,
            triadicHue2,
            playColor1,
            playColor2,
            categoryColor1,
            categoryColor2,
            logoutColor1,
            logoutColor2,
            playGradient: `linear-gradient(135deg, ${playColor1} 0%, ${playColor2} 100%)`
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
        this.applyMenuButtonTheme();
        this.updateUserInfo();
        
        // 타이머 게이지바 테마도 새로고침
        if (this.currentUser) {
            this.applyTimerBarTheme(this.currentUser.color);
            this.applyGameButtonTheme(this.currentUser.color);
        }
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