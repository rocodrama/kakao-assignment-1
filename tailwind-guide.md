# Tailwind CSS 사용 규칙 및 개선 가이드

> 현재 프로젝트(todo-list) 코드 기반으로 작성된 실전 가이드입니다.

---

## 목차

1. [색상 토큰 등록 (최우선)](#1-색상-토큰-등록-최우선)
2. [임의값 [] 사용 기준](#2-임의값--사용-기준)
3. [반복 클래스 추출](#3-반복-클래스-추출)
4. [기본 유틸리티 우선 사용](#4-기본-유틸리티-우선-사용)
5. [중복 클래스 제거](#5-중복-클래스-제거)
6. [반응형 레이아웃](#6-반응형-레이아웃)
7. [접근성 focus 스타일](#7-접근성-focus-스타일)

---

## 1. 색상 토큰 등록 (최우선)

### 문제

현재 `#3A5A8C`, `#497CBF`, `#8FAFD9`, `#CEDEF2` 같은 hex 값이 파일마다 흩어져 있습니다.
색상 하나를 바꾸려면 모든 파일을 찾아야 합니다.

```jsx
// WeekView.jsx
className="bg-[#3A5A8C]"

// TodoInput.jsx
className="bg-[#497CBF] ... hover:bg-[#3A5A8C] disabled:bg-[#8FAFD9]"

// App.jsx
className="bg-[#CEDEF2]"
```

### 해결 방법

**Step 1.** 프로젝트 루트에 `tailwind.config.js` 파일이 없으면 생성합니다.

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#497CBF',  // 메인 파란색 — bg-primary
          dark:    '#3A5A8C',  // 진한 파란색 — bg-primary-dark
          light:   '#8FAFD9',  // 연한 파란색 — bg-primary-light
        },
        surface: {
          bg:    '#CEDEF2',  // 페이지 배경 — bg-surface-bg
          card:  '#FFFFFF',  // 카드/입력창 배경 — bg-surface-card
          border:'#8FAFD9',  // 기본 테두리 — border-surface-border
        },
        text: {
          heading: '#1D2F40',  // 제목 색상 — text-text-heading
        },
      },
    },
  },
  plugins: [],
}
```

**Step 2.** 기존 코드의 hex 값을 토큰으로 교체합니다.

```jsx
// Before
<button className="bg-[#497CBF] hover:bg-[#3A5A8C] disabled:bg-[#8FAFD9]">

// After
<button className="bg-primary hover:bg-primary-dark disabled:bg-primary-light">
```

```jsx
// Before
<div className="bg-[#CEDEF2]">

// After
<div className="bg-surface-bg">
```

```jsx
// Before
<h1 className="text-[#1D2F40]">

// After
<h1 className="text-text-heading">
```

---

## 2. 임의값 `[]` 사용 기준

### 언제 써도 되는가

- Tailwind 기본 스케일에 없는 값일 때
- 디자인상 정확한 수치가 필요할 때 (예: `w-[600px]`)

### 언제 쓰면 안 되는가

Tailwind 기본 스케일로 대체 가능한 경우 임의값 대신 기본 클래스를 사용합니다.

| 현재 코드 | 개선 | 설명 |
|----------|------|------|
| `gap-[8px]` | `gap-2` | 1단위 = 4px, 2 = 8px |
| `text-[#fff]` | `text-white` | 기본 내장 색상 활용 |
| `text-[#000]` | `text-black` | 기본 내장 색상 활용 |
| `border-[#497CBF]` | `border-primary` | 색상 토큰 등록 후 |
| `w-[400px]` | 유지 또는 `w-96`(384px) | 정밀 수치는 유지 가능 |
| `w-[600px]` | 유지 | 디자인 의도 명확하면 유지 |

**Tailwind spacing 스케일 참고:**

```
1  = 4px
2  = 8px
3  = 12px
4  = 16px
5  = 20px
6  = 24px
8  = 32px
10 = 40px
12 = 48px
```

### 적용 예시

```jsx
// TodoInput.jsx — Before
<div className="flex flex-row gap-[8px] mb-4">

// After
<div className="flex flex-row gap-2 mb-4">
```

```jsx
// TodoFilter.jsx — Before
<button className="... w-[130px] ...">

// After  
<button className="... w-32 ...">  // 128px, 130px과 근사
```

---

## 3. 반복 클래스 추출

### 문제

`TodoFilter.jsx`에서 버튼 3개가 거의 동일한 클래스를 중복 작성하고 있습니다.

```jsx
// TodoFilter.jsx — Before (중복이 심함)
<button className={`${filter === '전체' ? 'bg-[#497CBF] text-[#fff] border-[#497CBF]' : 'bg-[#fff] text-[#000]'} border-1 border-solid text-center w-[130px] rounded hover:bg-[#497CBF] hover:text-[#fff] hover:border-[#497CBF]`}
  onClick={() => setFilter('전체')}>
  전체
</button>
<button className={`${filter === '완료' ? 'bg-[#497CBF] text-[#fff] border-[#497CBF]' : 'bg-[#fff] text-[#000]'} border-1 border-solid text-center w-[130px] rounded hover:bg-[#497CBF] hover:text-[#fff] hover:border-[#497CBF]`}
  onClick={() => setFilter('완료')}>
  완료
</button>
```

### 해결 방법

공통 클래스를 변수로 분리합니다.

```jsx
// TodoFilter.jsx — After
export default function TodoFilter({ filter, setFilter }) {
  const FILTERS = ['전체', '완료', '진행중'];

  const baseClass = 'border border-solid text-center w-32 rounded transition-colors';
  const activeClass = 'bg-primary text-white border-primary';
  const inactiveClass = 'bg-white text-black border-surface-border hover:bg-primary hover:text-white hover:border-primary';

  return (
    <div className="flex flex-row justify-between items-center mb-2 gap-2">
      {FILTERS.map((f) => (
        <button
          key={f}
          className={`${baseClass} ${filter === f ? activeClass : inactiveClass}`}
          onClick={() => setFilter(f)}
        >
          {f}
        </button>
      ))}
    </div>
  );
}
```

### 규칙

- 3줄 이상 반복되는 클래스 조합은 반드시 변수로 추출한다.
- 상태에 따라 달라지는 부분(active/inactive)만 삼항연산자로 처리한다.
- 아이템 목록이 배열로 표현 가능하면 `.map()`으로 렌더링한다.

---

## 4. 기본 유틸리티 우선 사용

### 문제

Tailwind에 이미 있는 클래스를 임의값으로 쓰고 있습니다.

```jsx
// Before
<span className="text-[#fff]">  // text-white로 대체 가능
<span className="text-[#000]">  // text-black으로 대체 가능
```

### 해결 방법

```jsx
// After
<span className="text-white">
<span className="text-black">
```

### 자주 쓰는 기본 유틸리티 목록

| 임의값 | 기본 클래스 |
|--------|------------|
| `text-[#fff]` | `text-white` |
| `text-[#000]` | `text-black` |
| `bg-[#fff]` | `bg-white` |
| `bg-[#000]` | `bg-black` |
| `rounded-[4px]` | `rounded` |
| `opacity-[0.5]` | `opacity-50` |
| `font-[700]` | `font-bold` |
| `font-[400]` | `font-normal` |

---

## 5. 중복 클래스 제거

### 문제

`App.jsx`에서 `flex`가 두 번 선언되어 있습니다.

```jsx
// App.jsx — Before
<div className="box-border flex flex-col min-h-screen w-full bg-[#CEDEF2] flex justify-center items-center">
```

Tailwind는 중복 클래스를 걸러주지 않고 CSS 우선순위 규칙을 따릅니다.
`flex`가 두 번 있어도 에러는 안 나지만 코드가 혼란스럽고, `flex-col`과 `items-center`의 동작이 의도와 다를 수 있습니다.

### 해결 방법

```jsx
// App.jsx — After
<div className="box-border flex flex-col min-h-screen w-full bg-surface-bg justify-center items-center">
```

### 규칙

- 같은 속성을 제어하는 클래스(예: `flex`, `block`, `grid`)는 하나만 쓴다.
- 클래스가 길어지면 아래 순서로 정렬하면 읽기 쉽다:

```
레이아웃(flex/grid) → 크기(w/h) → 간격(p/m/gap) → 색상(bg/text/border) → 상태(hover/focus/disabled)
```

---

## 6. 반응형 레이아웃

### 문제

현재 고정 픽셀 너비만 사용 중이라 모바일에서 레이아웃이 깨집니다.

```jsx
// Todo.jsx
<div className="w-[600px]">

// TodoInput.jsx
<input className="w-[400px] ...">
```

### 해결 방법

Tailwind 반응형 prefix를 사용합니다: `sm:`, `md:`, `lg:`

| Prefix | 기준 너비 |
|--------|---------|
| (없음) | 모든 화면 (모바일 우선) |
| `sm:` | 640px 이상 |
| `md:` | 768px 이상 |
| `lg:` | 1024px 이상 |

```jsx
// Todo.jsx — After
<div className="w-full px-4 sm:w-[600px] sm:px-0">
```

```jsx
// TodoInput.jsx — After
<input className="bg-white border-2 border-surface-border w-full sm:w-[400px] px-4 py-2 rounded ...">
```

```jsx
// TodoFilter.jsx — After (버튼 너비도 반응형으로)
<button className="... w-full sm:w-32 ...">
```

### 모바일 우선(Mobile First) 원칙

Tailwind는 **모바일 우선** 설계입니다.
prefix 없는 클래스 = 모바일 기본값, prefix 있는 클래스 = 큰 화면에서 덮어씀.

```jsx
// 잘못된 방향: 데스크탑 기준으로 쓰고 모바일을 override 하려 함
<div className="w-[600px]">  // 모바일에서도 600px → 화면 벗어남

// 올바른 방향: 모바일 기본 → 데스크탑에서 override
<div className="w-full sm:w-[600px]">  // 모바일: 전체 너비, sm 이상: 600px
```

---

## 7. 접근성 focus 스타일

### 문제

현재 버튼에 `hover:` 스타일은 있지만 `focus:` 스타일이 없습니다.
키보드로 Tab 이동 시 어떤 버튼에 포커스가 있는지 시각적으로 알 수 없습니다.

```jsx
// WeekView.jsx — Before
<button className="bg-white text-black px-4 py-2 rounded hover:bg-primary">
```

### 해결 방법

```jsx
// WeekView.jsx — After
<button className="bg-white text-black px-4 py-2 rounded hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1">
```

### input 포커스 스타일

```jsx
// TodoInput.jsx — Before
<input className="... focus:outline-0 focus:border-[#497CBF]">

// After (border-primary 토큰 사용)
<input className="... focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary">
```

### 공통 focus 클래스

프로젝트 전체에서 일관된 focus 스타일을 위해 아래 클래스 조합을 표준으로 사용합니다.

```
// 버튼용
focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1

// 인풋용
focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary
```

---

## 전체 적용 순서 체크리스트

- [ ] `tailwind.config.js` 생성 후 색상 토큰 등록
- [ ] 전체 파일에서 hex 값 → 토큰 이름으로 교체
- [ ] `text-[#fff]` → `text-white`, `text-[#000]` → `text-black` 교체
- [ ] `gap-[8px]` → `gap-2` 등 스케일 대체 가능한 임의값 교체
- [ ] `App.jsx` 중복 `flex` 제거
- [ ] `TodoFilter.jsx` 반복 클래스 변수로 추출 + `.map()` 렌더링으로 리팩토링
- [ ] `Todo.jsx`, `TodoInput.jsx` 고정 픽셀 너비에 반응형 prefix 추가
- [ ] 버튼, 인풋 전체에 `focus:` 스타일 추가
