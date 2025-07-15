// Supabase 설정
const SUPABASE_CONFIG = {
    url: 'https://qcubdynkiawpcmsflxfu.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdWJkeW5raWF3cGNtc2ZseGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgxNzUsImV4cCI6MjA2Nzk4NDE3NX0.c2dFWAcMq62druoosEYY2JaT5FOL--7V9qjCTtPUzi0'
};

// Supabase 클라이언트 생성
const supabaseClient = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// 현재 사용자 정보를 가져오는 함수
function getCurrentUser() {
    const userStr = sessionStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
}

// 전역 함수로 등록 (다른 페이지에서 사용 가능)
window.getCurrentUser = getCurrentUser;

// 설정을 외부에서 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, supabaseClient, getCurrentUser };
} 