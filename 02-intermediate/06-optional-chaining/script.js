// ============================================================
// 项目: 可选链 (Optional Chaining) 与空值合并 (Nullish Coalescing)
// 核心知识点: ?. 操作符, ?? 操作符, 安全访问嵌套对象
// ============================================================

// --- 1. 示例数据 ---

// 嵌套用户数据（模拟 API 响应）
const apiResponse = {
    status: 'success',
    data: {
        user: {
            id: 1,
            name: '小明',
            profile: {
                avatar: 'https://example.com/avatar.jpg',
                bio: 'JavaScript 开发者',
                social: {
                    github: 'xiaoming',
                    twitter: null
                }
            },
            settings: {
                theme: 'dark',
                notifications: true
            }
        }
    }
};

// 不完整的数据（模拟不同用户）
const partialData = {
    status: 'success',
    data: {
        user: {
            id: 2,
            name: '小红'
            // 没有 profile 和 settings
        }
    }
};

// 空数据
const emptyData = { status: 'success' };

// --- 2. 可选链演示 ---

/**
 * 演示 1: 安全访问属性
 * ?. 在属性不存在时返回 undefined 而不报错
 */
function runOptionalProperty() {
    const resultDiv = document.getElementById('optional-property-result');
    const logs = [];

    // 【旧方法】层层判断
    function getOldStyle(response) {
        if (response && response.data && response.data.user && response.data.user.profile) {
            return response.data.user.profile.bio;
        }
        return undefined;
    }

    // 【新方法】可选链
    function getNewStyle(response) {
        return response?.data?.user?.profile?.bio;
    }

    const testCases = [
        { data: apiResponse, desc: '完整数据' },
        { data: partialData, desc: '部分数据' },
        { data: emptyData, desc: '空数据' }
    ];

    testCases.forEach(function(tc) {
        const oldResult = getOldStyle(tc.data);
        const newResult = getNewStyle(tc.data);

        logs.push('【' + tc.desc + '】');
        logs.push('  旧方法: ' + (oldResult || 'undefined'));
        logs.push('  新方法: ' + (newResult || 'undefined'));
        logs.push('');
    });

    logs.push('✨ 可选链让代码更简洁、更安全！');
    resultDiv.textContent = logs.join('\n');
    resultDiv.classList.add('has-content');
}

/**
 * 演示 2: 安全调用方法
 * ?.() 在方法不存在时不调用
 */
function runOptionalMethod() {
    const resultDiv = document.getElementById('optional-method-result');
    const logs = [];

    const obj1 = {
        greet: function() { return '你好！欢迎！'; }
    };

    const obj2 = {
        // 没有 greet 方法
    };

    // 安全调用
    logs.push('obj1.greet?.() = "' + obj1.greet?.() + '"');
    logs.push('obj2.greet?.() = ' + obj2.greet?.() + ' (undefined)');
    logs.push('');
    logs.push('如果不使用可选链:');
    logs.push('  obj2.greet() => TypeError: obj2.greet is not a function');
    logs.push('');
    logs.push('💡 ?.() 避免了 TypeError 错误！');

    resultDiv.textContent = logs.join('\n');
    resultDiv.classList.add('has-content');
}

/**
 * 演示 3: 安全访问数组
 * ?.[] 在数组不存在时返回 undefined
 */
function runOptionalIndex() {
    const resultDiv = document.getElementById('optional-index-result');
    const logs = [];

    const data1 = { users: ['小明', '小红', '小刚'] };
    const data2 = { users: null };
    const data3 = {};

    logs.push('data1.users?.[0] = "' + data1.users?.[0] + '"');
    logs.push('data2.users?.[0] = ' + data2.users?.[0]);
    logs.push('data3.users?.[0] = ' + data3.users?.[0]);
    logs.push('');
    logs.push('💡 ?.[] 可以安全访问可能不存在的数组！');

    resultDiv.textContent = logs.join('\n');
    resultDiv.classList.add('has-content');
}

// --- 3. 空值合并演示 ---

/**
 * 演示 4: ?? vs || 的区别
 */
function runNullishVsOr() {
    const resultDiv = document.getElementById('nullish-vs-or-result');
    const logs = [];

    // 测试各种假值
    const testValues = [
        { value: 0, desc: '数字 0' },
        { value: '', desc: '空字符串' },
        { value: false, desc: '布尔 false' },
        { value: null, desc: 'null' },
        { value: undefined, desc: 'undefined' },
        { value: 42, desc: '有效数字 42' }
    ];

    logs.push('【?? 与 || 的区别】');
    logs.push('');
    logs.push('|| 在所有假值时都使用默认值');
    logs.push('?? 仅在 null/undefined 时使用默认值');
    logs.push('');

    testValues.forEach(function(tv) {
        const orResult = tv.value || '默认值';
        const nullishResult = tv.value ?? '默认值';

        logs.push(tv.desc + ':');
        logs.push('  value || "默认值" = ' + (typeof orResult === 'string' ? '"' + orResult + '"' : orResult));
        logs.push('  value ?? "默认值" = ' + (typeof nullishResult === 'string' ? '"' + nullishResult + '"' : nullishResult));
        logs.push('');
    });

    logs.push('💡 当 0、空字符串、false 是有效值时，用 ?? ！');
    resultDiv.textContent = logs.join('\n');
    resultDiv.classList.add('has-content');
}

/**
 * 演示 5: 链式空值合并
 */
function runChainedNullish() {
    const resultDiv = document.getElementById('chained-nullish-result');
    const logs = [];

    const settings1 = null;
    const settings2 = {};
    const settings3 = { theme: 'dark' };

    logs.push('【链式空值合并】');
    logs.push('');
    logs.push('settings1 ?? { theme: "light" } ?? "default"');
    const r1 = settings1 ?? { theme: 'light' };
    logs.push('  结果: ' + JSON.stringify(r1));
    logs.push('  (null 被跳过，返回默认对象)');
    logs.push('');
    logs.push('settings2 ?? { theme: "light" }');
    const r2 = settings2 ?? { theme: 'light' };
    logs.push('  结果: ' + JSON.stringify(r2));
    logs.push('  (空对象不是 null/undefined，所以返回 {})');
    logs.push('');

    resultDiv.textContent = logs.join('\n');
    resultDiv.classList.add('has-content');
}

// --- 4. 实际应用场景 ---

/**
 * 演示 6: 安全访问 API 响应
 */
function runApiAccess() {
    const resultDiv = document.getElementById('api-access-result');
    const logs = [];

    function safeAccess(response) {
        const name = response?.data?.user?.name ?? '匿名用户';
        const bio = response?.data?.user?.profile?.bio ?? '这个人很懒';
        const github = response?.data?.user?.profile?.social?.github ?? '未绑定';
        const theme = response?.data?.user?.settings?.theme ?? 'light';
        const notifications = response?.data?.user?.settings?.notifications ?? false;

        return { name, bio, github, theme, notifications };
    }

    logs.push('【安全访问 API 响应】');
    logs.push('');

    const result1 = safeAccess(apiResponse);
    logs.push('完整数据:');
    logs.push('  name: ' + result1.name);
    logs.push('  bio: ' + result1.bio);
    logs.push('  github: ' + result1.github);
    logs.push('  theme: ' + result1.theme);
    logs.push('');

    const result2 = safeAccess(partialData);
    logs.push('部分数据:');
    logs.push('  name: ' + result2.name);
    logs.push('  bio: ' + result2.bio);
    logs.push('  github: ' + result2.github);
    logs.push('  theme: ' + result2.theme);
    logs.push('');

    logs.push('✨ 无论 API 返回什么，代码都不会崩溃！');
    resultDiv.textContent = logs.join('\n');
    resultDiv.classList.add('has-content');
}

// --- 5. 交互对象浏览器 ---

// 示例嵌套对象
const sampleObject = {
    user: {
        profile: {
            name: '小明',
            age: 18,
            address: {
                city: '北京',
                district: '朝阳区'
            }
        },
        settings: {
            theme: 'dark',
            notifications: {
                email: true,
                sms: false
            }
        },
        posts: [
            { id: 1, title: '学习 ES6' },
            { id: 2, title: '理解 Promise' }
        ]
    }
};

/**
 * 对象浏览器: 用户输入路径，安全访问
 */
function runObjectExplorer() {
    const resultDiv = document.getElementById('object-explorer-result');
    const pathInput = document.getElementById('object-path').value.trim();

    if (!pathInput) {
        resultDiv.textContent = '请输入访问路径，例如: user.profile.name';
        return;
    }

    const parts = pathInput.split('.');
    let current = sampleObject;
    let path = 'sampleObject';
    let successful = true;

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        path += '.' + part;
        if (current === null || current === undefined) {
            current = undefined;
            successful = false;
            break;
        }
        current = current[part];
    }

    const logs = [];
    logs.push('【访问路径】' + path);
    logs.push('【结果】' + (current !== undefined ? JSON.stringify(current) : 'undefined'));
    logs.push(successful ? '✅ 访问成功' : '⚠️ 路径中断');
    logs.push('');
    logs.push('等价代码: sampleObject' + parts.map(p => '.' + p).join(''));

    resultDiv.textContent = logs.join('\n');
    resultDiv.classList.add('has-content');
}

// --- 6. 事件绑定 ---

document.addEventListener('DOMContentLoaded', function() {
    // 按钮事件
    document.querySelectorAll('.demo-btn').forEach(function(btn) {
        btn.addEventListener('click', function() {
            const action = btn.dataset.action;
            switch (action) {
                case 'optional-property': runOptionalProperty(); break;
                case 'optional-method': runOptionalMethod(); break;
                case 'optional-index': runOptionalIndex(); break;
                case 'nullish-vs-or': runNullishVsOr(); break;
                case 'chained-nullish': runChainedNullish(); break;
                case 'api-access': runApiAccess(); break;
                case 'object-explorer': runObjectExplorer(); break;
            }
        });
    });

    // 初始运行所有演示
    runOptionalProperty();
    runOptionalMethod();
    runOptionalIndex();
    runNullishVsOr();
    runChainedNullish();
    runApiAccess();
});
