# FastAPI with sqlalchemy

---

## `app/db`

### `app/db/base.py`

DeclarativeBase란?

- SQLAlchemy 2.0 스타일에서 ORM 모델의 공통 부모 클래스. 모든 모델(`Todo` 등)이 이 클래스를 상속하면, SQLAlchemy가 해당 클래스들을 자동으로 인식해서 테이블 매핑 정보를 모아둠.
- `Base.metadata`에 지금까지 정의된 모든 테이블 스키마 정보가 쌓이고, 이걸 가지고 `Base.metadata.create_all(engine)`을 호출하면 실제 DB에 테이블을 생성할 수 있음.

### `app/db/session.py`

engine, sessionmaker란?

- `engine`: 실제 DB(sqlite/postgres 등)와의 연결을 관리하는 객체. 커넥션 풀을 들고 있고, SQL을 실제로 실행하는 통로.
- `sessionmaker(bind=engine)`: `Session` 객체를 만들어주는 팩토리. `Session`은 트랜잭션 단위로 쿼리를 보내고 커밋/롤백하는 작업 단위(unit of work).

get_db()가 제너레이터(yield)인 이유

- FastAPI의 `Depends(get_db)`는 제너레이터 함수를 의존성으로 받으면, `yield` 이전 코드를 요청 시작 시 실행하고 `yield`로 넘긴 값을 라우터에 주입한 뒤, 요청이 끝나면(정상/예외 모두) `yield` 이후 코드(여기선 `with` 블록 종료 = 세션 close)를 실행해줌.
- 즉 매 요청마다 세션을 새로 만들고, 응답이 끝나면 자동으로 닫아주는 패턴. `with SessionLocal() as db:` 덕분에 예외가 나도 세션이 안전하게 닫힘.

---

## `app/modules/todos`

### `app/modules/todos/model.py`

Mapped, mapped_column란?

- SQLAlchemy 2.0의 타입 어노테이션 기반 매핑 방식. `Mapped[int]`처럼 파이썬 타입 힌트로 컬럼 타입을 표현하고, `mapped_column()`으로 실제 컬럼 옵션(primary_key, nullable, default 등)을 지정함.
- 기존 1.x 스타일(`Column(Integer, primary_key=True)`)보다 타입 체커(mypy 등)와 IDE 자동완성이 더 잘 동작함.

__tablename__

- 이 모델이 매핑될 실제 DB 테이블 이름을 지정하는 클래스 속성. 여기선 `"todos"`.

### `app/modules/todos/schema.py`

pydantic BaseModel

- 요청/응답 데이터의 형태를 검증하고 직렬화하는 클래스. FastAPI가 요청 body를 받을 때 이 모델로 자동 파싱/검증하고, 응답을 보낼 때는 자동으로 JSON으로 변환함.

TodoCreate / TodoUpdate / TodoResponse를 나누는 이유

- 같은 `Todo`라도 상황별로 필요한 필드가 다름. 생성할 때는 `id`가 없어야 하고, 수정할 때는 모든 필드가 선택적(optional)이어야 하고, 응답할 때는 `id`까지 포함해서 보내야 함.
- 하나의 모델로 다 처리하면 "생성 시 id를 보내면 안 됨" 같은 제약을 표현하기 어려워서, 용도별로 스키마를 분리하는 게 일반적인 패턴.

model_config = {"from_attributes": True}란?

- 기본적으로 pydantic은 dict 형태의 입력만 파싱함. 이 설정을 켜면 SQLAlchemy 모델 인스턴스처럼 속성(attribute)으로 데이터를 가진 객체도 그대로 읽어서 pydantic 모델로 변환할 수 있게 해줌 (구버전의 `orm_mode = True`와 동일).
- 그래서 라우터에서 `Todo` ORM 객체를 그대로 반환해도 `TodoResponse`로 자동 변환됨.

### `app/modules/todos/repository.py`

클래스 기반 repository 패턴인 이유

- `Session`을 생성자에서 한 번 받아두면 각 메서드(`get_all`, `create` 등)마다 `db` 파라미터를 반복해서 넘기지 않아도 됨.
- DB 접근 로직을 한 곳에 캡슐화해서, 라우터 쪽은 "무엇을 하는지"만 알면 되고 "어떻게 쿼리하는지"는 몰라도 됨. 테스트할 때 repository만 교체/모킹하기도 쉬움.

select(), db.scalars(), db.get() 차이

- `select(Todo)`: SQLAlchemy 2.0 스타일로 "이런 쿼리를 만들겠다"는 쿼리 객체(Select)를 구성. 아직 실행은 안 됨.
- `db.scalars(select(Todo))`: 쿼리를 실제로 실행하고, 결과 row에서 첫 번째 컬럼(여기선 `Todo` 객체 자체)만 꺼내는 이터러블을 반환. 여러 행을 다룰 때 사용.
- `db.get(Todo, todo_id)`: 기본키(primary key)로 단일 객체를 바로 조회하는 단축 메서드. `select(Todo).where(Todo.id == todo_id)`보다 간결하고, ID 조회용으로 최적화되어 있음.

model_dump(exclude_unset=True)란?

- pydantic 모델을 dict로 변환하는 메서드. `exclude_unset=True`를 주면 사용자가 실제로 값을 넣은 필드만 포함하고, 기본값이라 안 건드린 필드는 제외함.
- `TodoUpdate`처럼 일부 필드만 수정(PATCH)할 때, "보내지 않은 필드는 None으로 덮어쓰지 않고 건너뛴다"를 구현하기 위해 필요함.

---
