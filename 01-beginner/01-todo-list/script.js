// ============================================================
// 项目 01: 交互式待办清单
// 核心知识点: DOM 操作、事件监听、数组增删
// ============================================================

// --- 1. 获取 DOM 元素 ---
// document.getElementById() 用于获取 HTML 中的元素
const todoInput = document.getElementById('todoInput');  // 输入框
const addBtn = document.getElementById('addBtn');        // 添加按钮
const todoList = document.getElementById('todoList');    // 列表容器
const totalCount = document.getElementById('totalCount'); // 统计文本
const clearBtn = document.getElementById('clearBtn');    // 清空按钮

// --- 2. 数据存储 ---
// 使用数组来存储所有待办事项
// 每个待办事项是一个对象: { text: string, completed: boolean }
let todos = [];

// --- 3. 核心函数 ---

/**
 * 添加新的待办事项
 * @param {string} text - 待办事项的文本内容
 */
function addTodo(text) {
    // 创建新的待办对象
    const newTodo = {
        text: text,           // 待办文本
        completed: false      // 初始状态为未完成
    };
    
    // 将新待办添加到数组中
    todos.push(newTodo);  // push() 是数组方法，在末尾添加元素
    
    // 更新界面
    renderTodos();
}

/**
 * 删除指定索引的待办事项
 * @param {number} index - 要删除的待办在数组中的索引
 */
function deleteTodo(index) {
    // splice(索引, 删除数量) 从数组中删除元素
    todos.splice(index, 1);
    
    // 更新界面
    renderTodos();
}

/**
 * 切换待办事项的完成状态
 * @param {number} index - 要切换状态的待办索引
 */
function toggleTodo(index) {
    // 切换布尔值: true → false, false → true
    todos[index].completed = !todos[index].completed;
    
    // 更新界面
    renderTodos();
}

/**
 * 渲染待办列表到页面
 * 这个函数会把 todos 数组的内容显示到 HTML 中
 */
function renderTodos() {
    // 清空现有列表内容
    todoList.innerHTML = '';
    
    // 遍历 todos 数组，为每个待办创建 HTML 元素
    // forEach 是数组的遍历方法，对每个元素执行回调函数
    todos.forEach((todo, index) => {
        // 创建 li 元素
        const li = document.createElement('li');
        
        // 如果待办已完成，添加 completed 类（用于 CSS 样式）
        if (todo.completed) {
            li.classList.add('completed');
        }
        
        // 创建显示文本的 span
        const span = document.createElement('span');
        span.className = 'todo-text';
        span.textContent = todo.text;
        
        // 点击文本可以切换完成状态
        span.addEventListener('click', () => {
            toggleTodo(index);
        });
        
        // 创建删除按钮
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = '删除';
        
        // 点击删除按钮执行删除
        deleteBtn.addEventListener('click', () => {
            deleteTodo(index);
        });
        
        // 把 span 和 button 添加到 li 中
        li.appendChild(span);
        li.appendChild(deleteBtn);
        
        // 把 li 添加到列表中
        todoList.appendChild(li);
    });
    
    // 更新统计信息
    totalCount.textContent = `总计: ${todos.length}`;
}

/**
 * 清空所有待办
 */
function clearAll() {
    // 确认对话框
    if (todos.length === 0) {
        alert('清单已经是空的了！');
        return;
    }
    
    // confirm() 会弹出确认对话框，返回 true 或 false
    if (confirm('确定要清空所有待办吗？')) {
        todos = [];  // 重置为空数组
        renderTodos();
    }
}

// --- 4. 事件监听 ---

// 点击「添加」按钮时
addBtn.addEventListener('click', () => {
    // 获取输入框的值，并去除首尾空格
    const text = todoInput.value.trim();
    
    // 如果输入为空，提示用户
    if (text === '') {
        alert('请输入待办内容！');
        return;  // 提前结束函数，不执行后续代码
    }
    
    // 添加待办
    addTodo(text);
    
    // 清空输入框并聚焦
    todoInput.value = '';
    todoInput.focus();
});

// 点击「清空全部」按钮
clearBtn.addEventListener('click', clearAll);

// 按下回车键也可以添加（提升用户体验）
todoInput.addEventListener('keypress', (event) => {
    // event.key 是按下的键
    if (event.key === 'Enter') {
        addBtn.click();  // 模拟点击添加按钮
    }
});

// --- 5. 初始化 ---
// 页面加载时渲染一次（此时数组为空，显示空列表）
renderTodos();

// 在 Console 中可以测试:
// addTodo('测试任务')
// deleteTodo(0)
// console.log(todos)
