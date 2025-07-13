// Supabase 설정
const SUPABASE_CONFIG = {
    url: 'https://qcubdynkiawpcmsflxfu.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdWJkeW5raWF3cGNtc2ZseGZ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MDgxNzUsImV4cCI6MjA2Nzk4NDE3NX0.c2dFWAcMq62druoosEYY2JaT5FOL--7V9qjCTtPUzi0'
};

// Supabase 클라이언트 생성
const supabase = supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

// 설정을 외부에서 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SUPABASE_CONFIG, supabase };
} 