# GitHub Pages 배포 가이드

## 🚀 배포 단계

### 1. GitHub 저장소 생성
1. GitHub.com에 로그인
2. "New repository" 클릭
3. 저장소 이름 입력 (예: `english-study-game`)
4. Public으로 설정
5. "Create repository" 클릭

### 2. 파일 업로드
1. 생성된 저장소 페이지에서 "uploading an existing file" 클릭
2. 다음 파일들을 드래그 앤 드롭:
   - `index.html`
   - `phonics.html`
   - `manifest.json`
   - `README.md`
   - `DEPLOY.md`
3. "Commit changes" 클릭

### 3. GitHub Pages 활성화
1. 저장소 페이지에서 "Settings" 탭 클릭
2. 왼쪽 메뉴에서 "Pages" 클릭
3. "Source" 섹션에서 "Deploy from a branch" 선택
4. "Branch" 드롭다운에서 "main" 선택
5. "Save" 클릭

### 4. 배포 확인
1. 몇 분 후 "Your site is live at" 메시지 확인
2. 제공된 URL로 접속 테스트
3. 비밀번호 `새봄이123` 입력하여 로그인

## 📱 PWA 설치 방법

### Android (Chrome)
1. 웹사이트 접속
2. 주소창 옆 "설치" 버튼 클릭
3. "홈 화면에 추가" 선택
4. 앱 아이콘 확인

### iOS (Safari)
1. 웹사이트 접속
2. 공유 버튼 클릭
3. "홈 화면에 추가" 선택
4. 앱 아이콘 확인

## 🔧 커스터마이징

### 비밀번호 변경
`index.html` 파일에서:
```javascript
const CORRECT_PASSWORD = '새봄이123'; // 원하는 비밀번호로 변경
```

### 게임 데이터 수정
`phonics.html` 파일의 `gameData` 객체 수정

### 테마 색상 변경
CSS 변수 수정:
```css
--primary-color: #667eea;
--secondary-color: #764ba2;
```

## 🌐 접속 URL

배포 후 접속 가능한 URL:
- **메인**: `https://[사용자명].github.io/[저장소명]/`
- **파닉스 게임**: `https://[사용자명].github.io/[저장소명]/phonics.html`

## 🔐 보안 고려사항

### 현재 상태
- 클라이언트 사이드 인증
- 누구나 URL을 알면 접근 가능

### 보안 강화 방안
1. **복잡한 비밀번호 사용**
2. **Firebase Auth 연동**
3. **서버 기반 인증 구현**

## 📊 성능 최적화

### 이미지 최적화
- SVG 아이콘 사용으로 파일 크기 최소화
- Base64 인코딩으로 외부 파일 의존성 제거

### 캐싱 전략
- 브라우저 캐시 활용
- 로컬스토리지로 게임 진행 상태 저장

## 🐛 문제 해결

### 배포 후 접속 안됨
1. GitHub Pages 설정 확인
2. 파일명과 경로 확인
3. 몇 분 더 기다린 후 재시도

### 음성 합성 안됨
1. HTTPS 환경에서만 작동
2. 브라우저 권한 확인
3. 다른 브라우저로 테스트

### PWA 설치 안됨
1. HTTPS 환경 확인
2. manifest.json 파일 경로 확인
3. 브라우저 지원 여부 확인

## 📞 지원

문제가 발생하면:
1. GitHub Issues에 등록
2. 브라우저 콘솔 오류 확인
3. 네트워크 탭에서 파일 로드 상태 확인

---

**성공적인 배포를 위한 팁:**
- 모든 파일이 올바른 경로에 있는지 확인
- 파일명에 한글이나 특수문자 사용 금지
- HTTPS 환경에서 테스트
- 다양한 브라우저에서 호환성 확인 