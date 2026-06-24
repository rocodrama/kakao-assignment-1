# TodoList

Next.js(App Router) 프론트엔드 + FastAPI 백엔드로 만든 할 일 관리 앱입니다. 카카오 프리코스 3차 과제.

## 구조

```
.
├── frontend/   Next.js (App Router, TypeScript, Tailwind v4)
├── backend/    FastAPI + SQLAlchemy + SQLite
└── render.yaml Render 배포용 Blueprint (backend)
```

프론트엔드는 조회는 Server Action(`app/actions.ts`)으로 FastAPI를 직접 호출하고, 생성/수정/삭제는 Route Handler(`app/api/todos/...`)를 거쳐 FastAPI로 전달합니다. 자세한 동작 흐름은 아래 문서들을 참고하세요.

## 문서

| 문서 | 내용 |
|---|---|
| [understand_frontend.md](./understand_frontend.md) | 프론트엔드 파일별 동작 흐름 (Server/Client Component 구분 포함) |
| [guide_backend.md](./guide_backend.md) | 백엔드 파일별 동작 흐름 (FastAPI 요청 처리 과정) |
| [study.md](./study.md) | SQLAlchemy/FastAPI 개념 학습 노트 |
| [assignment3.md](./assignment3.md) | 3차 과제 설계 이유, 핵심 개념, 트러블슈팅 정리 |

## 로컬 실행

### 백엔드 (FastAPI)

```bash
cd backend
python -m venv .venv
.venv/Scripts/activate   # Windows
pip install -r requirements.txt
cp .env.example .env.local   # DATABASE_URL 등 환경변수
uvicorn app.main:app --reload --port 8000
```

### 프론트엔드 (Next.js)

```bash
cd frontend
npm install
cp .env.example .env.local   # BACKEND_URL, NEXT_PUBLIC_API_URL
npm run dev
```

`http://localhost:3000`에 접속하면 `/todos`로 리다이렉트됩니다. 백엔드가 먼저 떠 있어야 합니다.

## 환경변수

`.env.local`은 커밋되지 않습니다(각 폴더의 `.env.example` 참고).

- `backend/.env.local` — `DATABASE_URL` (SQLite 연결 문자열)
- `frontend/.env.local` — `BACKEND_URL`(서버 전용, FastAPI 주소), `NEXT_PUBLIC_API_URL`(클라이언트용, 우리 Route Handler 주소)

## 배포

- **백엔드 → Render**: 리포 루트의 `render.yaml`을 Render에서 Blueprint로 가져오면 자동 설정됩니다.
- **프론트엔드 → Vercel**: 리포를 Import하고 Root Directory를 `frontend`로 지정, 환경변수(`BACKEND_URL`, `NEXT_PUBLIC_API_URL`)를 설정합니다.

브라우저는 항상 같은 origin(Vercel)에만 요청을 보내고, 실제 FastAPI 호출은 서버(Server Action/Route Handler)에서 일어나기 때문에 별도 CORS 설정이 필요 없습니다.

## 기술 스택

- **Frontend**: Next.js 16 (App Router, Turbopack), React 19, TypeScript, Tailwind CSS v4
- **Backend**: FastAPI, SQLAlchemy 2.0, SQLite, Pydantic / pydantic-settings
