const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL 환경변수가 설정되지 않았습니다. .env.local을 확인하세요.");
}

export { API_URL };
