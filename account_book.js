// 가계부 시스템 JavaScript 유틸리티 함수들

// 금액 포맷팅 함수
function formatCurrency(amount) {
    return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
    }).format(amount);
}

// 숫자 입력 시 천단위 콤마 추가
function formatNumberInput(input) {
    const value = input.value.replace(/[^\d]/g, '');
    const formatted = new Intl.NumberFormat('ko-KR').format(value);
    input.value = formatted;
    return parseInt(value) || 0;
}

// 날짜 포맷팅 함수
function formatDate(date) {
    return new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).format(new Date(date));
}

// 날짜를 YYYY-MM-DD 형식으로 변환
function formatDateForInput(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// 현재 월의 첫날과 마지막날 구하기
function getCurrentMonthRange() {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    return {
        start: formatDateForInput(firstDay),
        end: formatDateForInput(lastDay)
    };
}

// 거래 유형별 색상
const TRANSACTION_COLORS = {
    '지출': '#ff6b6b',
    '수입': '#48dbfb',
    '이체': '#5f27cd'
};

// 거래 유형별 아이콘
const TRANSACTION_ICONS = {
    '지출': '💸',
    '수입': '💰',
    '이체': '💸'
};

// 카테고리 API 함수들
const CategoryAPI = {
    // 카테고리 목록 조회
    async getCategories(type = null) {
        const currentUser = getCurrentUser();
        if (!currentUser) return [];

        let query = supabaseClient
            .from('categories')
            .select('*')
            .eq('user_password_hash', currentUser.password_hash);

        if (type) {
            query = query.eq('type', type);
        }

        const { data, error } = await query.order('name');
        
        if (error) {
            console.error('카테고리 조회 오류:', error);
            return [];
        }
        
        return data;
    },

    // 카테고리 생성
    async createCategory(categoryData) {
        const currentUser = getCurrentUser();
        if (!currentUser) throw new Error('사용자 정보가 없습니다.');

        const { data, error } = await supabaseClient
            .from('categories')
            .insert([{
                ...categoryData,
                user_password_hash: currentUser.password_hash
            }])
            .select()
            .single();

        if (error) {
            console.error('카테고리 생성 오류:', error);
            throw error;
        }

        return data;
    },

    // 카테고리 수정
    async updateCategory(id, categoryData) {
        const { data, error } = await supabaseClient
            .from('categories')
            .update(categoryData)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('카테고리 수정 오류:', error);
            throw error;
        }

        return data;
    },

    // 카테고리 삭제
    async deleteCategory(id) {
        const { error } = await supabaseClient
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('카테고리 삭제 오류:', error);
            throw error;
        }
    }
};

// 거래 API 함수들
const TransactionAPI = {
    // 거래 목록 조회
    async getTransactions(filters = {}) {
        const currentUser = getCurrentUser();
        if (!currentUser) return [];

        let query = supabaseClient
            .from('transactions')
            .select(`
                *,
                categories (
                    id,
                    name,
                    color,
                    icon
                )
            `)
            .eq('user_password_hash', currentUser.password_hash);

        // 날짜 필터
        if (filters.startDate && filters.endDate) {
            query = query.gte('transaction_date', filters.startDate)
                        .lte('transaction_date', filters.endDate);
        }

        // 유형 필터
        if (filters.type) {
            query = query.eq('type', filters.type);
        }

        // 카테고리 필터
        if (filters.categoryId) {
            query = query.eq('category_id', filters.categoryId);
        }

        const { data, error } = await query
            .order('transaction_date', { ascending: false })
            .order('created_at', { ascending: false });

        if (error) {
            console.error('거래 조회 오류:', error);
            return [];
        }

        return data;
    },

    // 거래 생성
    async createTransaction(transactionData) {
        const currentUser = getCurrentUser();
        if (!currentUser) throw new Error('사용자 정보가 없습니다.');

        const { data, error } = await supabaseClient
            .from('transactions')
            .insert([{
                ...transactionData,
                user_password_hash: currentUser.password_hash
            }])
            .select(`
                *,
                categories (
                    id,
                    name,
                    color,
                    icon
                )
            `)
            .single();

        if (error) {
            console.error('거래 생성 오류:', error);
            throw error;
        }

        return data;
    },

    // 거래 수정
    async updateTransaction(id, transactionData) {
        const { data, error } = await supabaseClient
            .from('transactions')
            .update(transactionData)
            .eq('id', id)
            .select(`
                *,
                categories (
                    id,
                    name,
                    color,
                    icon
                )
            `)
            .single();

        if (error) {
            console.error('거래 수정 오류:', error);
            throw error;
        }

        return data;
    },

    // 거래 삭제
    async deleteTransaction(id) {
        const { error } = await supabaseClient
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('거래 삭제 오류:', error);
            throw error;
        }
    },

    // 통계 조회
    async getStatistics(filters = {}) {
        const transactions = await this.getTransactions(filters);
        
        const stats = {
            totalExpense: 0,
            totalIncome: 0,
            totalTransfer: 0,
            categoryStats: {},
            dailyStats: {}
        };

        transactions.forEach(transaction => {
            const amount = parseFloat(transaction.amount);
            
            switch (transaction.type) {
                case '지출':
                    stats.totalExpense += amount;
                    break;
                case '수입':
                    stats.totalIncome += amount;
                    break;
                case '이체':
                    stats.totalTransfer += amount;
                    break;
            }

            // 카테고리별 통계
            if (transaction.categories) {
                const categoryName = transaction.categories.name;
                if (!stats.categoryStats[categoryName]) {
                    stats.categoryStats[categoryName] = {
                        total: 0,
                        count: 0,
                        color: transaction.categories.color
                    };
                }
                stats.categoryStats[categoryName].total += amount;
                stats.categoryStats[categoryName].count += 1;
            }

            // 일별 통계
            const date = transaction.transaction_date;
            if (!stats.dailyStats[date]) {
                stats.dailyStats[date] = {
                    expense: 0,
                    income: 0,
                    transfer: 0
                };
            }
            stats.dailyStats[date][transaction.type === '지출' ? 'expense' : 
                                  transaction.type === '수입' ? 'income' : 'transfer'] += amount;
        });

        return stats;
    }
};

// 모달 관리 함수들
const ModalManager = {
    // 모달 표시
    showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    },

    // 모달 숨기기
    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    },

    // 모달 외부 클릭 시 닫기
    setupModalClose(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modalId);
                }
            });
        }
    }
};

// 전역 함수로 등록
window.formatCurrency = formatCurrency;
window.formatNumberInput = formatNumberInput;
window.formatDate = formatDate;
window.formatDateForInput = formatDateForInput;
window.getCurrentMonthRange = getCurrentMonthRange;
window.TRANSACTION_COLORS = TRANSACTION_COLORS;
window.TRANSACTION_ICONS = TRANSACTION_ICONS;
window.CategoryAPI = CategoryAPI;
window.TransactionAPI = TransactionAPI;
window.ModalManager = ModalManager; 