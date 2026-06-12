/**
 * ============================================================================
 * 排序算法可视化 - 主脚本 (script.js)
 * ============================================================================
 *
 * 技术要点：
 * 1. 使用 async/await + setTimeout 实现动画帧控制
 *    - 每个排序算法都是 async 函数
 *    - 通过 await sleep(delay) 暂停执行，形成动画效果
 *    - 可以在排序过程中动态调整 delay（速度）
 *
 * 2. 柱子状态颜色编码：
 *    - 蓝色 (默认)  : 未排序
 *    - 黄色         : 正在比较两个元素
 *    - 红色         : 正在交换两个元素
 *    - 绿色         : 已排序到位
 *    - 紫色         : 快速排序的基准值 (pivot)
 *
 * 3. 所有排序算法都接收一个 hooks 对象参数：
 *    - onCompare(i, j)  : 比较索引 i 和 j 时调用
 *    - onSwap(i, j)     : 交换索引 i 和 j 时调用
 *    - onSorted(i)      : 索引 i 的元素已排序时调用
 *    - shouldStop()     : 检查是否应停止排序
 *
 * ============================================================================
 */

// ========================================================================
// 全局状态与 DOM 引用
// ========================================================================

/**
 * 存储当前数组值
 * 数组元素为 1~100 之间的整数
 */
let array = [];

/**
 * 排序是否正在进行中
 * 用于防止重复点击"开始排序"按钮
 */
let isSorting = false;

/**
 * 是否请求停止当前排序
 * 用户点击"生成新数组"或"重置"时设置此标志
 */
let stopRequested = false;

/**
 * 统计变量
 */
let comparisonCount = 0;
let swapCount = 0;

/**
 * DOM 元素引用（缓存避免重复查询）
 */
const DOM = {
    container: document.getElementById('visualizer-container'),
    algorithmSelect: document.getElementById('algorithm-select'),
    arraySize: document.getElementById('array-size'),
    arraySizeValue: document.getElementById('array-size-value'),
    speedRange: document.getElementById('speed-range'),
    speedValue: document.getElementById('speed-value'),
    generateBtn: document.getElementById('generate-btn'),
    sortBtn: document.getElementById('sort-btn'),
    resetBtn: document.getElementById('reset-btn'),
    algorithmName: document.getElementById('algorithm-name'),
    comparisonCount: document.getElementById('comparison-count'),
    swapCount: document.getElementById('swap-count'),
    sortingStatus: document.getElementById('sorting-status'),
};

// ========================================================================
// 工具函数
// ========================================================================

/**
 * 延迟函数 (实现动画效果的核心)
 *
 * 【原理说明】
 * JavaScript 是单线程的，使用 setTimeout 可以将回调放入事件队列，
 * 在指定延迟时间后执行。结合 async/await，我们可以"暂停"函数执行，
 * 让浏览器有机会渲染中间状态，从而形成动画效果。
 *
 * 执行流程：
 * 1. await sleep(50) 暂停当前 async 函数 50ms
 * 2. 在这 50ms 内，浏览器可以渲染柱子的新颜色/高度
 * 3. 50ms 后 Promise  resolve，函数继续执行下一步
 *
 * @param {number} ms - 延迟毫秒数
 * @returns {Promise<void>}
 */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * 获取当前排序速度（毫秒）
 * 从滑块控件读取，值越小排序越快（延迟越短）
 * @returns {number}
 */
function getDelay() {
    // 滑块值范围 1~200，直接作为延迟毫秒数
    return parseInt(DOM.speedRange.value, 10);
}

/**
 * 检查是否应停止排序
 * @returns {boolean}
 */
function shouldStop() {
    return stopRequested;
}

/**
 * 更新状态栏显示
 */
function updateStatus() {
    DOM.comparisonCount.textContent = `比较次数：${comparisonCount}`;
    DOM.swapCount.textContent = `交换次数：${swapCount}`;
}

/**
 * 重置统计计数器
 */
function resetCounters() {
    comparisonCount = 0;
    swapCount = 0;
    updateStatus();
}

// ========================================================================
// 可视化柱子的操作函数
// ========================================================================

/**
 * 生成随机整数数组并渲染为柱状图
 *
 * @param {number} size - 数组大小（柱子数量）
 */
function generateArray(size) {
    // 请求停止当前正在进行的排序
    stopRequested = true;
    isSorting = false;

    // 重置状态
    resetCounters();
    DOM.sortingStatus.textContent = '状态：就绪';
    DOM.algorithmName.textContent = '当前算法：-';

    // 生成 size 个 5~100 之间的随机整数
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 96) + 5);
    }

    // 渲染柱子
    renderBars();

    // 重置按钮状态
    DOM.sortBtn.disabled = false;
    DOM.generateBtn.disabled = false;
    DOM.arraySize.disabled = false;
}

/**
 * 将数组渲染为柱状图
 * 每个柱子的高度对应数组元素的值（百分比）
 */
function renderBars() {
    // 清空容器
    DOM.container.innerHTML = '';

    const maxVal = 100; // 最大可能值

    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.classList.add('bar');
        // 高度按比例计算：(value / maxVal) * 100%
        bar.style.height = `${(value / maxVal) * 100}%`;
        // 存储索引和值到 DOM 属性，方便后续访问
        bar.dataset.index = index;
        bar.dataset.value = value;
        DOM.container.appendChild(bar);
    });
}

/**
 * 获取指定索引的柱子 DOM 元素
 * @param {number} index
 * @returns {HTMLElement}
 */
function getBar(index) {
    return DOM.container.children[index];
}

/**
 * 设置柱子的颜色状态
 * @param {number} index - 柱子索引
 * @param {string} state - 状态类名 ('comparing' | 'swapping' | 'sorted' | 'pivot' | '')
 */
function setBarState(index, state) {
    const bar = getBar(index);
    if (!bar) return;
    // 移除所有状态类，再添加新状态
    bar.classList.remove('comparing', 'swapping', 'sorted', 'pivot');
    if (state) {
        bar.classList.add(state);
    }
}

/**
 * 重置所有柱子的状态为默认（未排序-蓝色）
 */
function resetAllBars() {
    for (let i = 0; i < array.length; i++) {
        setBarState(i, '');
    }
}

/**
 * 交换两个柱子的视觉高度和值
 * 这是动画交换效果的核心函数
 *
 * @param {number} i - 第一个柱子索引
 * @param {number} j - 第二个柱子索引
 * @param {number} delay - 动画延迟（毫秒）
 */
async function visualizeSwap(i, j, delay) {
    if (shouldStop()) return;

    // 1. 将两个柱子标记为"交换中"（红色）
    setBarState(i, 'swapping');
    setBarState(j, 'swapping');

    // 2. 等待一段时间，让用户看到红色高亮
    await sleep(delay);

    if (shouldStop()) return;

    // 3. 交换 DOM 中的高度值（视觉交换）
    const barI = getBar(i);
    const barJ = getBar(j);
    const tempHeight = barI.style.height;
    barI.style.height = barJ.style.height;
    barJ.style.height = tempHeight;

    // 同时交换数据数组中的值
    const tempValue = array[i];
    array[i] = array[j];
    array[j] = tempValue;

    // 更新 data 属性
    barI.dataset.value = array[i];
    barJ.dataset.value = array[j];

    // 4. 再等待一下让用户看到交换后的效果
    await sleep(delay);

    if (shouldStop()) return;

    // 5. 恢复为默认状态（蓝色）
    setBarState(i, '');
    setBarState(j, '');
}

/**
 * 可视化比较操作：高亮两个正在比较的柱子
 *
 * @param {number} i - 第一个柱子索引
 * @param {number} j - 第二个柱子索引
 * @param {number} delay - 高亮持续时间
 */
async function visualizeCompare(i, j, delay) {
    if (shouldStop()) return;

    // 标记为"比较中"（黄色）
    setBarState(i, 'comparing');
    setBarState(j, 'comparing');

    // 等待一段时间让用户看到高亮
    await sleep(delay);

    // 恢复默认状态
    if (!shouldStop()) {
        setBarState(i, '');
        setBarState(j, '');
    }
}

/**
 * 标记柱子为"已排序"状态（绿色）
 * @param {number} index
 */
function markSorted(index) {
    setBarState(index, 'sorted');
}

/**
 * 标记柱子为基准值状态（紫色，用于快速排序）
 * @param {number} index
 */
function markPivot(index) {
    setBarState(index, 'pivot');
}

// ========================================================================
// 排序算法实现
// 所有算法都是 async 函数，接收 hooks 对象参数
// ========================================================================

/**
 * 冒泡排序 (Bubble Sort)
 *
 * 【算法思想】
 * 重复遍历数组，每次比较相邻两个元素，如果顺序错误就交换它们。
 * 每一轮遍历会将当前未排序部分的最大元素"冒泡"到末尾。
 *
 * 【时间复杂度】
 * - 最好情况: O(n)   - 数组已经有序，只需一轮遍历（可优化实现）
 * - 平均情况: O(n²)  - 随机排列的数组
 * - 最坏情况: O(n²)  - 数组完全逆序
 *
 * 【空间复杂度】
 * O(1) - 原地排序，只需常数个额外变量
 *
 * 【稳定性】
 * 稳定 - 相等元素的相对顺序不会改变
 *
 * @param {number[]} arr - 待排序数组
 * @param {Object} hooks - 可视化钩子
 */
async function bubbleSort(arr, hooks) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        // 优化标志：如果一轮遍历中没有发生交换，说明数组已经有序
        let swapped = false;

        for (let j = 0; j < n - 1 - i; j++) {
            if (shouldStop()) return;

            // 可视化：比较相邻元素
            await visualizeCompare(j, j + 1, getDelay());
            hooks.onCompare(j, j + 1);

            // 如果前一个元素大于后一个，交换它们
            if (arr[j] > arr[j + 1]) {
                await visualizeSwap(j, j + 1, getDelay());
                hooks.onSwap(j, j + 1);
                swapped = true;
            }
        }

        // 标记第 n-1-i 个位置已排序（最大元素已冒泡到位）
        markSorted(n - 1 - i);

        // 如果没有发生交换，提前结束
        if (!swapped) {
            // 将剩余所有元素标记为已排序
            for (let k = 0; k < n - 1 - i; k++) {
                markSorted(k);
            }
            break;
        }
    }

    // 第一个元素也需要标记
    markSorted(0);
}

/**
 * 选择排序 (Selection Sort)
 *
 * 【算法思想】
 * 将数组分为"已排序"和"未排序"两部分。每次从未排序部分中找到最小元素，
 * 将其放到已排序部分的末尾。
 *
 * 【时间复杂度】
 * - 最好情况: O(n²) - 即使数组已有序，仍需遍历查找最小值
 * - 平均情况: O(n²)
 * - 最坏情况: O(n²)
 *
 * 【空间复杂度】
 * O(1) - 原地排序
 *
 * 【稳定性】
 * 不稳定 - 交换操作可能改变相等元素的相对顺序
 *
 * @param {number[]} arr - 待排序数组
 * @param {Object} hooks - 可视化钩子
 */
async function selectionSort(arr, hooks) {
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
        if (shouldStop()) return;

        // 假设当前位置为最小值
        let minIndex = i;
        // 可视化：标记当前假设的最小值位置
        setBarState(minIndex, 'comparing');

        // 在未排序部分中查找真正的最小值
        for (let j = i + 1; j < n; j++) {
            if (shouldStop()) return;

            // 可视化：比较当前元素与已知最小值
            await visualizeCompare(j, minIndex, getDelay());
            hooks.onCompare(j, minIndex);

            if (arr[j] < arr[minIndex]) {
                // 取消旧的最小值标记
                setBarState(minIndex, '');
                // 更新最小值索引
                minIndex = j;
                // 标记新的最小值
                setBarState(minIndex, 'comparing');
            }
        }

        // 如果最小值不是当前位置，交换
        if (minIndex !== i) {
            await visualizeSwap(i, minIndex, getDelay());
            hooks.onSwap(i, minIndex);
        }

        // 清除最后一个比较标记
        setBarState(minIndex, '');

        // 标记当前位置已排序
        markSorted(i);
    }

    // 最后一个元素自动有序
    markSorted(n - 1);
}

/**
 * 插入排序 (Insertion Sort)
 *
 * 【算法思想】
 * 将数组分为"已排序"和"未排序"两部分。每次从未排序部分取出第一个元素，
 * 在已排序部分中从后向前扫描，找到合适位置插入。
 * 类似于打牌时整理手牌的过程。
 *
 * 【时间复杂度】
 * - 最好情况: O(n)   - 数组已经有序，每次只需比较一次
 * - 平均情况: O(n²)
 * - 最坏情况: O(n²)  - 数组完全逆序
 *
 * 【空间复杂度】
 * O(1) - 原地排序
 *
 * 【稳定性】
 * 稳定 - 相等元素不会交换位置
 *
 * @param {number[]} arr - 待排序数组
 * @param {Object} hooks - 可视化钩子
 */
async function insertionSort(arr, hooks) {
    const n = arr.length;

    // 第一个元素默认已排序
    markSorted(0);

    for (let i = 1; i < n; i++) {
        if (shouldStop()) return;

        // 当前要插入的元素
        let currentVal = arr[i];
        let j = i - 1;

        // 可视化：标记当前待插入元素
        setBarState(i, 'comparing');
        await sleep(getDelay());

        // 在已排序部分中从后向前扫描
        while (j >= 0 && arr[j] > currentVal) {
            if (shouldStop()) return;

            // 可视化：比较
            await visualizeCompare(j, i, getDelay());
            hooks.onCompare(j, i);

            // 将大于当前值的元素向后移动一位
            arr[j + 1] = arr[j];
            // 可视化：更新移动后柱子的高度
            getBar(j + 1).style.height = getBar(j).style.height;
            getBar(j + 1).dataset.value = arr[j];
            swapCount++;
            updateStatus();

            await sleep(getDelay());
            j--;
        }

        // 插入当前元素到正确位置
        arr[j + 1] = currentVal;
        getBar(j + 1).style.height = `${(currentVal / 100) * 100}%`;
        getBar(j + 1).dataset.value = currentVal;

        // 清除标记
        setBarState(i, '');
        setBarState(j + 1, '');

        // 标记 0~i 位置已排序
        for (let k = 0; k <= i; k++) {
            markSorted(k);
        }
    }
}

/**
 * 快速排序 (Quick Sort)
 *
 * 【算法思想】
 * 使用分治法 (Divide and Conquer)：
 * 1. 选择一个基准值 (pivot)
 * 2. 将数组分为两部分：小于 pivot 的放左边，大于 pivot 的放右边
 * 3. 递归地对左右两部分重复上述过程
 *
 * 【时间复杂度】
 * - 最好情况: O(n log n) - 每次 pivot 都将数组均匀分为两半
 * - 平均情况: O(n log n)
 * - 最坏情况: O(n²)     - 每次 pivot 都是最大或最小元素（已排序数组选首/尾元素时）
 *
 * 【空间复杂度】
 * O(log n) - 递归调用栈的深度
 *
 * 【稳定性】
 * 不稳定 - 分区过程可能改变相等元素的相对顺序
 *
 * @param {number[]} arr - 待排序数组
 * @param {Object} hooks - 可视化钩子
 */
async function quickSort(arr, hooks) {
    /**
     * 分区函数 (Partition)
     * 选择最后一个元素作为 pivot，将小于 pivot 的元素移到左边，
     * 大于 pivot 的元素移到右边，最后返回 pivot 的正确位置。
     *
     * @param {number} low  - 分区起始索引
     * @param {number} high - 分区结束索引
     * @returns {number} pivot 的最终索引
     */
    async function partition(low, high) {
        // 选择最后一个元素作为基准值
        let pivot = arr[high];
        markPivot(high); // 可视化：标记 pivot

        // i 指向小于 pivot 的元素区域的末尾
        let i = low - 1;

        for (let j = low; j < high; j++) {
            if (shouldStop()) return -1;

            // 可视化：比较当前元素与 pivot
            await visualizeCompare(j, high, getDelay());
            hooks.onCompare(j, high);

            if (arr[j] < pivot) {
                i++;
                if (i !== j) {
                    // 交换 arr[i] 和 arr[j]
                    await visualizeSwap(i, j, getDelay());
                    hooks.onSwap(i, j);
                }
            }
        }

        // 将 pivot 放到正确位置（小于它的元素之后）
        await visualizeSwap(i + 1, high, getDelay());
        hooks.onSwap(i + 1, high);

        // 清除 pivot 标记
        setBarState(high, '');

        // 返回 pivot 的最终索引
        return i + 1;
    }

    /**
     * 递归排序函数
     * @param {number} low  - 当前子数组起始索引
     * @param {number} high - 当前子数组结束索引
     */
    async function sort(low, high) {
        if (low < high) {
            if (shouldStop()) return;

            // 获取分区点
            const pi = await partition(low, high);
            if (pi === -1) return; // 停止请求

            // 标记 pivot 位置已排序
            markSorted(pi);

            // 递归排序左半部分
            await sort(low, pi - 1);
            if (shouldStop()) return;

            // 递归排序右半部分
            await sort(pi + 1, high);
        } else if (low >= 0 && low < array.length) {
            // 单个元素也视为已排序
            markSorted(low);
        }
    }

    // 启动快速排序
    await sort(0, arr.length - 1);

    // 排序完成后将所有元素标记为绿色
    if (!shouldStop()) {
        for (let i = 0; i < arr.length; i++) {
            markSorted(i);
        }
    }
}

// ========================================================================
// 事件处理函数
// ========================================================================

/**
 * 开始排序
 * 读取用户选择的算法和当前数组，启动排序动画
 */
async function startSorting() {
    if (isSorting) return; // 防止重复点击

    isSorting = true;
    stopRequested = false;
    resetCounters();
    resetAllBars();

    // 禁用控件
    DOM.sortBtn.disabled = true;
    DOM.generateBtn.disabled = true;
    DOM.arraySize.disabled = true;

    // 获取选择的算法
    const algorithm = DOM.algorithmSelect.value;
    const algorithmNames = {
        bubble: '冒泡排序',
        selection: '选择排序',
        insertion: '插入排序',
        quick: '快速排序',
    };
    DOM.algorithmName.textContent = `当前算法：${algorithmNames[algorithm]}`;
    DOM.sortingStatus.textContent = '状态：排序中...';

    // 创建 hooks 对象（可视化钩子）
    const hooks = {
        onCompare: (i, j) => {
            comparisonCount++;
            updateStatus();
        },
        onSwap: (i, j) => {
            swapCount++;
            updateStatus();
        },
        onSorted: (i) => {
            markSorted(i);
        },
        shouldStop: shouldStop,
    };

    // 根据选择执行对应算法
    try {
        switch (algorithm) {
            case 'bubble':
                await bubbleSort(array, hooks);
                break;
            case 'selection':
                await selectionSort(array, hooks);
                break;
            case 'insertion':
                await insertionSort(array, hooks);
                break;
            case 'quick':
                await quickSort(array, hooks);
                break;
            default:
                throw new Error('未知的算法: ' + algorithm);
        }

        if (!stopRequested) {
            DOM.sortingStatus.textContent = '状态：排序完成！';
            // 确保所有柱子标记为绿色
            for (let i = 0; i < array.length; i++) {
                markSorted(i);
            }
        }
    } catch (error) {
        console.error('[排序可视化] 排序过程出错:', error);
        DOM.sortingStatus.textContent = '状态：排序已中断';
    }

    // 恢复控件
    isSorting = false;
    DOM.sortBtn.disabled = false;
    DOM.generateBtn.disabled = false;
    DOM.arraySize.disabled = false;
}

/**
 * 重置
 * 停止当前排序，重新生成数组
 */
function resetVisualization() {
    stopRequested = true;
    isSorting = false;
    resetCounters();
    DOM.sortingStatus.textContent = '状态：就绪';
    DOM.algorithmName.textContent = '当前算法：-';
    resetAllBars();
    DOM.sortBtn.disabled = false;
    DOM.generateBtn.disabled = false;
    DOM.arraySize.disabled = false;
}

// ========================================================================
// 初始化与事件绑定
// ========================================================================

/**
 * 页面加载完成后初始化
 */
function init() {
    // 绑定滑块值显示
    DOM.arraySize.addEventListener('input', () => {
        DOM.arraySizeValue.textContent = DOM.arraySize.value;
    });

    DOM.speedRange.addEventListener('input', () => {
        // 显示为：滑块值越大，延迟越短（排序越快）
        // 为了更直观，我们反转显示：200 - value
        const displayValue = 201 - parseInt(DOM.speedRange.value, 10);
        DOM.speedValue.textContent = displayValue;
    });

    // 绑定按钮事件
    DOM.generateBtn.addEventListener('click', () => {
        const size = parseInt(DOM.arraySize.value, 10);
        generateArray(size);
    });

    DOM.sortBtn.addEventListener('click', startSorting);

    DOM.resetBtn.addEventListener('click', resetVisualization);

    // 初始生成一个数组
    generateArray(parseInt(DOM.arraySize.value, 10));

    // 初始化速度显示值
    const displayValue = 201 - parseInt(DOM.speedRange.value, 10);
    DOM.speedValue.textContent = displayValue;

    console.log('[排序可视化] 初始化完成');
}

// 页面加载后执行初始化
document.addEventListener('DOMContentLoaded', init);
