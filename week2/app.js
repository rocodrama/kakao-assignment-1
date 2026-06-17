// 할 일 데이터 배열 (각 항목: { id, text, completed, date })
let todos = [];

// 다음 항목에 사용할 고유 ID (추가할 때마다 1씩 증가)
let nextId = 1;

// 현재 선택된 필터 ('all' | 'active' | 'completed')
let currentFilter = 'all';

// 현재 선택된 날짜 (Date 객체, 시간은 00:00:00으로 고정)
let selectedDate = getTodayDate();

// 주간 뷰에 표시 중인 주의 시작일 (항상 월요일)
let weekStart = getWeekStart(getTodayDate());

// 달력 팝업에 표시 중인 월 (Date 객체, 1일로 고정)
let calendarViewDate = new Date();

// 현재 드래그 중인 Todo의 ID (null이면 드래그 없음)
let draggedTodoId = null;

// 로컬스토리지에서 사용할 키
const STORAGE_KEY = 'my-todo-data';

// ── DOM 요소 참조 ──────────────────────────────────────────
const todoInput        = document.getElementById('todo-input');
const addBtn           = document.getElementById('add-btn');
const todoList         = document.getElementById('todo-list');
const errorMessage     = document.getElementById('error-message');
const emptyMessage     = document.getElementById('empty-message');
const filterTabs       = document.querySelectorAll('.filter-tab');
const prevWeekBtn      = document.getElementById('prev-week-btn');
const nextWeekBtn      = document.getElementById('next-week-btn');
const weekStrip        = document.getElementById('week-strip');
const weekRangeEl      = document.getElementById('week-range');
const calendarBtn      = document.getElementById('calendar-btn');
const calendarBackdrop = document.getElementById('calendar-backdrop');
const calendarPopup    = document.getElementById('calendar-popup');

// ── 이벤트 바인딩 ──────────────────────────────────────────

addBtn.addEventListener('click', addTodo);

todoInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') addTodo();
});

todoInput.addEventListener('input', () => {
  if (todoInput.value.trim()) showError(false);
});

filterTabs.forEach((tab) => {
  tab.addEventListener('click', () => setFilter(tab.dataset.filter));
});

prevWeekBtn.addEventListener('click', () => moveWeek(-1));
nextWeekBtn.addEventListener('click', () => moveWeek(1));

// 달력 버튼 클릭: 팝업 열기/닫기 토글
calendarBtn.addEventListener('click', toggleCalendar);

// 배경(backdrop) 클릭 시 달력 닫기
calendarBackdrop.addEventListener('click', hideCalendar);

// ESC 키로 달력 닫기
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') hideCalendar();
});

// ── 로컬스토리지 ───────────────────────────────────────────

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ todos, nextId }));
}

function loadTodos() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  const data = JSON.parse(raw);
  todos  = data.todos  || [];
  nextId = data.nextId || 1;
}

// ── CRUD 함수 ──────────────────────────────────────────────

// [Create] 새 할 일 추가 (현재 선택된 날짜를 함께 저장)
function addTodo() {
  const text = todoInput.value.trim();

  if (!text) {
    showError(true);
    todoInput.focus();
    return;
  }

  showError(false);
  todos.push({ id: nextId++, text, completed: false, date: toDateKey(selectedDate) });
  saveTodos();
  todoInput.value = '';
  todoInput.focus();
  renderWeekView();
  renderTodos();
}

// [Update - Toggle] 체크박스 클릭 시 완료/미완료 상태 전환
function toggleTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.completed = !todo.completed;
    saveTodos();
    renderTodos();
  }
}

// [Update - Edit] 수정 버튼 클릭 시 인라인 편집 모드로 전환
function startEditTodo(id) {
  const todo = todos.find((t) => t.id === id);
  if (!todo) return;

  const listItem  = document.querySelector(`[data-id="${id}"]`);
  const textEl    = listItem.querySelector('.todo-text');
  const editBtn   = listItem.querySelector('.edit-btn');
  const actionsEl = listItem.querySelector('.todo-actions');

  const editInput     = document.createElement('input');
  editInput.type      = 'text';
  editInput.className = 'todo-edit-input';
  editInput.value     = todo.text;
  listItem.replaceChild(editInput, textEl);
  editInput.focus();

  const saveBtn       = document.createElement('button');
  saveBtn.className   = 'save-btn';
  saveBtn.textContent = '저장';
  saveBtn.addEventListener('click', () => saveEditTodo(id, editInput));
  actionsEl.replaceChild(saveBtn, editBtn);

  editInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') saveEditTodo(id, editInput);
  });
}

// [Update - Save] 수정 내용을 데이터에 반영하고 목록 다시 그리기
function saveEditTodo(id, editInput) {
  const newText = editInput.value.trim();
  if (!newText) return;

  const todo = todos.find((t) => t.id === id);
  if (todo) {
    todo.text = newText;
    saveTodos();
    renderTodos();
  }
}

// [Delete] 해당 ID의 할 일을 배열에서 제거
function deleteTodo(id) {
  todos = todos.filter((t) => t.id !== id);
  saveTodos();
  renderWeekView();
  renderTodos();
}

// [Reorder] 드래그앤드롭으로 Todo 순서 변경
// insertBefore: true면 target 앞, false면 target 뒤에 삽입
function reorderTodo(draggedId, targetId, insertBefore) {
  const draggedIdx = todos.findIndex((t) => t.id === draggedId);
  const [dragged]  = todos.splice(draggedIdx, 1); // 드래그 항목 제거

  const targetIdx  = todos.findIndex((t) => t.id === targetId);
  const insertIdx  = insertBefore ? targetIdx : targetIdx + 1;
  todos.splice(insertIdx, 0, dragged); // 목표 위치에 삽입

  saveTodos();
  renderWeekView();
  renderTodos();
}

// ── 달력 팝업 ──────────────────────────────────────────────

// 달력 열기/닫기 토글
function toggleCalendar() {
  const isHidden = calendarPopup.classList.contains('hidden');
  if (isHidden) {
    // 선택된 날짜의 월부터 시작
    calendarViewDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    renderCalendar();
    calendarBackdrop.classList.remove('hidden');
    calendarPopup.classList.remove('hidden');
  } else {
    hideCalendar();
  }
}

// 달력 닫기
function hideCalendar() {
  calendarBackdrop.classList.add('hidden');
  calendarPopup.classList.add('hidden');
}

// 달력 그리드 렌더링
function renderCalendar() {
  calendarPopup.innerHTML = '';

  const year     = calendarViewDate.getFullYear();
  const month    = calendarViewDate.getMonth();
  const todayKey = toDateKey(getTodayDate());
  const selKey   = toDateKey(selectedDate);

  // ── 달력 헤더 (이전/다음 달 + 연/월 레이블)
  const header = document.createElement('div');
  header.className = 'cal-header';

  const prevBtn = document.createElement('button');
  prevBtn.className   = 'cal-nav-btn';
  prevBtn.textContent = '‹';
  prevBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    calendarViewDate = new Date(year, month - 1, 1);
    renderCalendar();
  });

  const monthLabel       = document.createElement('span');
  monthLabel.className   = 'cal-month-label';
  monthLabel.textContent = `${year}년 ${month + 1}월`;

  const nextBtn = document.createElement('button');
  nextBtn.className   = 'cal-nav-btn';
  nextBtn.textContent = '›';
  nextBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    calendarViewDate = new Date(year, month + 1, 1);
    renderCalendar();
  });

  header.appendChild(prevBtn);
  header.appendChild(monthLabel);
  header.appendChild(nextBtn);
  calendarPopup.appendChild(header);

  // ── 요일 이름 행 (월~일)
  const dayNamesRow = document.createElement('div');
  dayNamesRow.className = 'cal-day-names';
  ['월', '화', '수', '목', '금', '토', '일'].forEach((name) => {
    const cell       = document.createElement('span');
    cell.className   = 'cal-day-name';
    cell.textContent = name;
    dayNamesRow.appendChild(cell);
    if(name === '토') cell.classList.add('saturday'); // 토요일은 파란색
    if(name === '일') cell.classList.add('sunday'); // 일요일은 빨간색
  });
  calendarPopup.appendChild(dayNamesRow);

  // ── 날짜 그리드
  const grid = document.createElement('div');
  grid.className = 'cal-grid';

  // 1일의 요일을 기준으로 앞 빈 칸 수 계산 (월요일 시작)
  const firstWeekday = new Date(year, month, 1).getDay(); // 0=일, 1=월, ..., 6=토
  const emptyCount   = firstWeekday === 0 ? 6 : firstWeekday - 1;

  for (let i = 0; i < emptyCount; i++) {
    const blank = document.createElement('div');
    blank.className = 'cal-day empty';
    grid.appendChild(blank);
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let d = 1; d <= daysInMonth; d++) {
    const date    = new Date(year, month, d);
    const dateKey = toDateKey(date);
    const isToday    = dateKey === todayKey;
    const isSelected = dateKey === selKey;
    const hasTodos   = todos.some((t) => t.date === dateKey);

    const cell = document.createElement('button');
    cell.className = 'cal-day';
    if (isToday)    cell.classList.add('today');
    if (isSelected) cell.classList.add('selected');

    const numEl       = document.createElement('span');
    numEl.textContent = d;
    cell.appendChild(numEl);

    // Todo가 있는 날짜에는 점, 없으면 투명 점으로 높이 유지
    const dotEl     = document.createElement('span');
    dotEl.className = hasTodos ? 'cal-dot' : 'cal-dot-placeholder';
    cell.appendChild(dotEl);

    cell.addEventListener('click', (e) => {
      e.stopPropagation();
      selectCalendarDate(date);
    });

    grid.appendChild(cell);
  }

  calendarPopup.appendChild(grid);
}

// 달력에서 날짜 선택: 선택 날짜 갱신 → 해당 주로 이동 → 달력 닫기
function selectCalendarDate(date) {
  selectedDate = new Date(date);
  selectedDate.setHours(0, 0, 0, 0);
  weekStart = getWeekStart(selectedDate); // 해당 날짜의 주로 이동
  hideCalendar();
  renderWeekView();
  renderTodos();
}

// ── 주간 뷰 ────────────────────────────────────────────────

// weekStart를 delta 주만큼 이동하고 해당 주 월요일을 자동 선택
function moveWeek(delta) {
  weekStart.setDate(weekStart.getDate() + delta * 7);
  selectedDate = new Date(weekStart);
  selectedDate.setHours(0, 0, 0, 0);
  renderWeekView();
  renderTodos();
}

// 주간 스트립 렌더링 (연/월 레이블 + 7개 요일 셀)
function renderWeekView() {
  weekStrip.innerHTML = '';

  const weekDates   = getWeekDates(weekStart);
  const todayKey    = toDateKey(getTodayDate());
  const selectedKey = toDateKey(selectedDate);
  const DAY_NAMES   = ['일', '월', '화', '수', '목', '금', '토'];

  const firstDate = weekDates[0];
  const lastDate  = weekDates[6];
  const sameMonth = firstDate.getMonth() === lastDate.getMonth();
  weekRangeEl.textContent = sameMonth
    ? `${firstDate.getFullYear()}년 ${firstDate.getMonth() + 1}월`
    : `${firstDate.getFullYear()}년 ${firstDate.getMonth() + 1}월 - ${lastDate.getMonth() + 1}월`;

  weekDates.forEach((date) => {
    const dateKey    = toDateKey(date);
    const isToday    = dateKey === todayKey;
    const isSelected = dateKey === selectedKey;
    const count      = todos.filter((t) => t.date === dateKey).length;

    const cell = document.createElement('button');
    cell.className = 'day-cell';
    if (isToday)    cell.classList.add('today');
    if (isSelected) cell.classList.add('selected');

    const nameEl       = document.createElement('span');
    nameEl.className   = 'day-cell__name';
    nameEl.textContent = DAY_NAMES[date.getDay()];
    if (date.getDay() === 6) nameEl.classList.add('saturday'); // 토요일은 파란색
    if (date.getDay() === 0) nameEl.classList.add('sunday'); // 일요일은 빨간색

    const dateEl       = document.createElement('span');
    dateEl.className   = 'day-cell__date';
    dateEl.textContent = date.getDate();

    const countEl       = document.createElement('span');
    countEl.className   = 'day-cell__count' + (count === 0 ? ' empty' : '');
    countEl.textContent = count > 0 ? count : '·';

    cell.appendChild(nameEl);
    cell.appendChild(dateEl);
    cell.appendChild(countEl);

    cell.addEventListener('click', () => {
      selectedDate = new Date(date);
      selectedDate.setHours(0, 0, 0, 0);
      renderWeekView();
      renderTodos();
    });

    weekStrip.appendChild(cell);
  });
}

// ── 필터 ───────────────────────────────────────────────────

function setFilter(filter) {
  currentFilter = filter;
  filterTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.filter === filter);
  });
  renderTodos();
}

function getFilteredTodos() {
  const byDate = todos.filter((t) => t.date === toDateKey(selectedDate));
  if (currentFilter === 'active')    return byDate.filter((t) => !t.completed);
  if (currentFilter === 'completed') return byDate.filter((t) => t.completed);
  return byDate;
}

// ── 렌더링 ─────────────────────────────────────────────────

// 필터링된 todos를 DOM에 그리는 함수 (드래그 핸들 포함)
function renderTodos() {
  todoList.innerHTML = '';
  const filteredTodos = getFilteredTodos();

  if (filteredTodos.length === 0) {
    const messages = {
      all:       '이 날의 할 일이 없어요. 새로운 할 일을 추가해 보세요!',
      active:    '진행 중인 할 일이 없어요.',
      completed: '완료된 할 일이 없어요.',
    };
    emptyMessage.textContent = messages[currentFilter];
    emptyMessage.classList.remove('hidden');
    return;
  }

  emptyMessage.classList.add('hidden');

  filteredTodos.forEach((todo) => {
    const li        = document.createElement('li');
    li.className    = 'todo-item';
    li.dataset.id   = todo.id;
    li.setAttribute('draggable', 'true');

    // ── 드래그 핸들
    const handle     = document.createElement('span');
    handle.className = 'drag-handle';
    handle.title     = '드래그하여 순서 변경';

    // ── 드래그 이벤트
    li.addEventListener('dragstart', (e) => {
      draggedTodoId = todo.id;
      e.dataTransfer.effectAllowed = 'move';
      // 드래그 이미지 캡처 후 반투명 적용
      requestAnimationFrame(() => li.classList.add('dragging'));
    });

    li.addEventListener('dragend', () => {
      draggedTodoId = null;
      li.classList.remove('dragging');
      // 모든 드롭 위치 표시 제거
      document.querySelectorAll('.todo-item').forEach((el) => {
        el.classList.remove('drag-before', 'drag-after');
      });
    });

    li.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      if (todo.id === draggedTodoId) return;

      // 커서가 항목의 위/아래 절반 어느 쪽에 있는지 판단
      const rect    = li.getBoundingClientRect();
      const isAbove = e.clientY < rect.top + rect.height / 2;

      document.querySelectorAll('.todo-item').forEach((el) => {
        el.classList.remove('drag-before', 'drag-after');
      });
      li.classList.add(isAbove ? 'drag-before' : 'drag-after');
    });

    li.addEventListener('drop', (e) => {
      e.preventDefault();
      if (draggedTodoId === null || draggedTodoId === todo.id) return;

      const rect         = li.getBoundingClientRect();
      const insertBefore = e.clientY < rect.top + rect.height / 2;
      reorderTodo(draggedTodoId, todo.id, insertBefore);
    });

    // ── 체크박스
    const checkbox      = document.createElement('input');
    checkbox.type       = 'checkbox';
    checkbox.className  = 'todo-checkbox';
    checkbox.checked    = todo.completed;
    checkbox.addEventListener('change', () => toggleTodo(todo.id));

    // ── 텍스트
    const textEl       = document.createElement('span');
    textEl.className   = 'todo-text' + (todo.completed ? ' completed' : '');
    textEl.textContent = todo.text;

    // ── 버튼 영역 (수정 + 삭제)
    const actionsEl     = document.createElement('div');
    actionsEl.className = 'todo-actions';

    const editBtn       = document.createElement('button');
    editBtn.className   = 'edit-btn';
    editBtn.textContent = '수정';
    editBtn.addEventListener('click', () => startEditTodo(todo.id));

    const deleteBtn       = document.createElement('button');
    deleteBtn.className   = 'delete-btn';
    deleteBtn.textContent = '삭제';
    deleteBtn.addEventListener('click', () => deleteTodo(todo.id));

    actionsEl.appendChild(editBtn);
    actionsEl.appendChild(deleteBtn);

    li.appendChild(handle);
    li.appendChild(checkbox);
    li.appendChild(textEl);
    li.appendChild(actionsEl);

    todoList.appendChild(li);
  });
}

// ── 유틸리티 ───────────────────────────────────────────────

function showError(visible) {
  errorMessage.classList.toggle('hidden', !visible);
}

function getTodayDate() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

function getWeekStart(date) {
  const d   = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getWeekDates(weekStart) {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function toDateKey(date) {
  const year  = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day   = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ── 초기 실행 ──────────────────────────────────────────────

loadTodos();
renderWeekView();
renderTodos();
