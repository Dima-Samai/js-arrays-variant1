// 1. Дані студентів
let students = [
    { name: "Олександр", age: 20, gpa: 95, faculty: "IT" },
    { name: "Марія", age: 22, gpa: 88, faculty: "Design" },
    { name: "Дмитро", age: 19, gpa: 75, faculty: "IT" },
    { name: "Олена", age: 21, gpa: 92, faculty: "Economics" },
    { name: "Іван", age: 23, gpa: 65, faculty: "Design" }
];

let currentSort = { field: 'name', asc: true };

// 2. Алгоритми сортування (Bubble & Quick)
function bubbleSort(arr, field) {
    let a = [...arr];
    let comparisons = 0;
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a.length - i - 1; j++) {
            comparisons++;
            if (a[j][field] > a[j + 1][field]) {
                [a[j], a[j + 1]] = [a[j + 1], a[j]];
            }
        }
    }
    return { sorted: a, comparisons };
}

function quickSort(arr, field) {
    let comparisons = 0;
    function sort(array) {
        if (array.length <= 1) return array;
        let pivot = array[Math.floor(array.length / 2)];
        let left = [], right = [], equal = [];
        for (let item of array) {
            comparisons++;
            if (item[field] < pivot[field]) left.push(item);
            else if (item[field] > pivot[field]) right.push(item);
            else equal.push(item);
        }
        return [...sort(left), ...equal, ...sort(right)];
    }
    return { sorted: sort(arr), comparisons };
}

// 3. Функції рендеру та статистики
function renderStudents() {
    const fac = document.getElementById('facultyFilter').value;
    const name = document.getElementById('nameFilter').value.toLowerCase();
    
    let filtered = students
        .filter(s => (!fac || s.faculty === fac) && s.name.toLowerCase().includes(name))
        .sort((a, b) => {
            let res = a[currentSort.field] > b[currentSort.field] ? 1 : -1;
            return currentSort.asc ? res : -res;
        });

    const tbody = document.getElementById('studentBody');
    tbody.innerHTML = filtered.map(s => `
        <tr><td>${s.name}</td><td>${s.age}</td><td>${s.gpa}</td><td>${s.faculty}</td></tr>
    `).join('');

    updateStats(filtered);
}

function updateStats(data) {
    if (data.length === 0) return;
    const avgGpa = (data.reduce((sum, s) => sum + s.gpa, 0) / data.length).toFixed(1);
    const top3 = [...data].sort((a, b) => b.gpa - a.gpa).slice(0, 3).map(s => s.name).join(', ');
    
    document.getElementById('stats').innerHTML = `
        <div class="stat-card">Студентів: ${data.length}</div>
        <div class="stat-card">Сер. GPA: ${avgGpa}</div>
        <div class="stat-card">Топ-3: ${top3}</div>
    `;
}

// 4. Бенчмарк
function runBenchmark(size) {
    const testData = Array.from({ length: size }, () => ({
        gpa: Math.floor(Math.random() * 101)
    }));

    const t1 = performance.now();
    const bResult = bubbleSort(testData, 'gpa');
    const t2 = performance.now();

    const t3 = performance.now();
    const qResult = quickSort(testData, 'gpa');
    const t4 = performance.now();

    document.getElementById('benchmarkResults').innerHTML = `
        > Тест на ${size} елементів:<br>
        - Bubble Sort: ${(t2 - t1).toFixed(2)}ms (${bResult.comparisons} порівнянь)<br>
        - Quick Sort: ${(t4 - t3).toFixed(2)}ms (${qResult.comparisons} порівнянь)
    `;
}

function setSort(field) {
    currentSort = { field, asc: !currentSort.asc };
    renderStudents();
}

renderStudents();