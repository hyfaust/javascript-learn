// ============================================================
// 项目 07: 表单验证器
// 核心知识点: 正则表达式、事件处理、实时验证
// ============================================================

// --- 1. 获取 DOM 元素 ---
const form = document.getElementById('registerForm');
const usernameInput = document.getElementById('username');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');
const confirmInput = document.getElementById('confirmPassword');
const phoneInput = document.getElementById('phone');
const submitBtn = document.getElementById('submitBtn');
const formStatus = document.getElementById('formStatus');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

// --- 2. 验证规则（正则表达式）---
// 正则表达式: 用模式匹配来验证字符串格式
const rules = {
    // 用户名: 3-16位字母、数字或下划线
    // ^ 表示开始, $ 表示结束, {3,16} 表示重复3到16次
    username: /^[a-zA-Z0-9_]{3,16}$/,

    // 邮箱: 简单的邮箱格式验证
    // \S 表示非空白字符, + 表示一个或多个
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    // 密码: 至少8位，必须包含字母和数字
    // (?=.*[A-Za-z]) 正向先行断言：确保有字母
    // (?=.*\d) 正向先行断言：确保有数字
    password: /^(?=.*[A-Za-z])(?=.*\d).{8,}$/,

    // 中国大陆手机号: 1开头，第二位3-9，共11位
    phone: /^1[3-9]\d{9}$/
};

// --- 3. 验证状态 ---
// 记录每个字段是否验证通过
const validationState = {
    username: false,
    email: false,
    password: false,
    confirmPassword: false,
    phone: false
};

// --- 4. 验证函数 ---

/**
 * 验证单个字段
 * @param {string} field - 字段名
 * @param {string} value - 用户输入的值
 * @returns {boolean} - 是否通过验证
 */
function validateField(field, value) {
    let isValid = false;
    let errorMsg = '';

    // 根据不同字段选择验证规则
    switch (field) {
        case 'username':
            if (value === '') {
                errorMsg = '用户名不能为空';
            } else if (!rules.username.test(value)) {
                errorMsg = '用户名必须是3-16位字母、数字或下划线';
            } else {
                isValid = true;
            }
            break;

        case 'email':
            if (value === '') {
                errorMsg = '邮箱不能为空';
            } else if (!rules.email.test(value)) {
                errorMsg = '邮箱格式不正确';
            } else {
                isValid = true;
            }
            break;

        case 'password':
            if (value === '') {
                errorMsg = '密码不能为空';
            } else if (!rules.password.test(value)) {
                errorMsg = '密码至少8位，且包含字母和数字';
            } else {
                isValid = true;
            }
            // 更新密码强度显示
            updatePasswordStrength(value);
            break;

        case 'confirmPassword':
            if (value === '') {
                errorMsg = '请再次输入密码';
            } else if (value !== passwordInput.value) {
                errorMsg = '两次密码输入不一致';
            } else {
                isValid = true;
            }
            break;

        case 'phone':
            if (value === '') {
                errorMsg = '手机号不能为空';
            } else if (!rules.phone.test(value)) {
                errorMsg = '手机号格式不正确';
            } else {
                isValid = true;
            }
            break;
    }

    // 更新字段状态
    validationState[field] = isValid;

    // 更新 UI 显示
    updateFieldUI(field, isValid, errorMsg);

    // 检查是否所有字段都通过
    checkFormValidity();

    return isValid;
}

/**
 * 更新字段的 UI 状态
 */
function updateFieldUI(field, isValid, errorMsg) {
    // 获取对应的 input 和 error 元素
    const input = document.getElementById(field === 'confirmPassword' ? 'confirmPassword' : field);
    const errorEl = document.getElementById(`${field}Error`);

    // 添加/移除验证样式类
    input.classList.remove('valid', 'invalid');
    if (input.value !== '') {
        input.classList.add(isValid ? 'valid' : 'invalid');
    }

    // 显示错误信息
    errorEl.textContent = isValid ? '' : errorMsg;
}

/**
 * 更新密码强度显示
 */
function updatePasswordStrength(password) {
    // 清除旧状态
    strengthFill.className = 'strength-fill';
    strengthText.textContent = '';

    if (password === '') return;

    // 计算强度分数
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;  // 有大写字母
    if (/[0-9]/.test(password)) score++;  // 有数字
    if (/[^A-Za-z0-9]/.test(password)) score++;  // 有特殊字符

    // 根据分数更新显示
    if (score <= 2) {
        strengthFill.classList.add('weak');
        strengthText.textContent = '弱';
        strengthText.style.color = '#dc3545';
    } else if (score <= 3) {
        strengthFill.classList.add('medium');
        strengthText.textContent = '中';
        strengthText.style.color = '#ffc107';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = '强';
        strengthText.style.color = '#28a745';
    }
}

/**
 * 检查整个表单是否通过验证
 */
function checkFormValidity() {
    // 所有字段都通过验证才启用提交按钮
    const allValid = Object.values(validationState).every(v => v);
    submitBtn.disabled = !allValid;
}

// --- 5. 事件监听 ---

// 为每个输入框添加实时验证（input 事件：每次输入都触发）
usernameInput.addEventListener('input', (e) => {
    validateField('username', e.target.value);
});

emailInput.addEventListener('input', (e) => {
    validateField('email', e.target.value);
});

passwordInput.addEventListener('input', (e) => {
    validateField('password', e.target.value);
    // 如果确认密码已填写，也需要重新验证
    if (confirmInput.value) {
        validateField('confirmPassword', confirmInput.value);
    }
});

confirmInput.addEventListener('input', (e) => {
    validateField('confirmPassword', e.target.value);
});

phoneInput.addEventListener('input', (e) => {
    validateField('phone', e.target.value);
});

// 表单提交
form.addEventListener('submit', (e) => {
    e.preventDefault();  // 阻止表单默认提交行为

    // 再次检查所有字段
    const allValid = Object.values(validationState).every(v => v);

    if (allValid) {
        formStatus.className = 'form-status success';
        formStatus.textContent = '✅ 注册成功！（这是演示，实际需发送到服务器）';

        // 在 Console 中打印表单数据
        console.log('表单数据:', {
            username: usernameInput.value,
            email: emailInput.value,
            password: passwordInput.value,
            phone: phoneInput.value
        });
    } else {
        formStatus.className = 'form-status error';
        formStatus.textContent = '❌ 请检查并修正错误后再提交';
    }
});

// --- 6. 扩展知识 ---
//
// 正则表达式常用符号:
// ^        匹配字符串开始
// $        匹配字符串结束
// \d       匹配数字 [0-9]
// \w       匹配字母数字下划线 [a-zA-Z0-9_]
// \s       匹配空白字符
// .        匹配任意字符
// +        匹配一次或多次
// *        匹配零次或多次
// {n,m}    匹配 n 到 m 次
// [abc]    匹配 a、b 或 c
// (?!...)  负向先行断言
// (?=...)  正向先行断言
//
// 常用测试工具:
// - regex101.com (在线正则测试)
// - 浏览器 Console 中直接测试:
//   /^[a-z]+$/i.test('Hello')  // true (i 表示忽略大小写)
