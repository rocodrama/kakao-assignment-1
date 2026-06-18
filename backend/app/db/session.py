from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# DB 연결 통로
engine = create_engine("sqlite:///app.db", echo=True) # echo=True는 SQLAlchemy가 실행하는 SQL 쿼리를 콘솔에 출력.

# 세션 생성 
SessionLocal = sessionmaker(bind=engine) 

# DB 세션을 생성하는 함수
def get_db():
    # DB 세션을 생성하고, 사용 후에는 닫아주는 제너레이터 함수
    # 제너레이터 함수는 yield 키워드를 사용하여 값을 반환하고, 함수가 다시 호출될 때 이전 상태를 유지하면서 실행을 계속할 수 있는 함수입니다.
    with SessionLocal() as db:
        yield db # yield는 제너레이터 함수에서 값을 반환하는 키워드로, 이 경우에는 DB 세션을 반환하고, 사용이 끝나면 자동으로 세션이 닫히도록 함.