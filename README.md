# 관대 백엔드 API

Express.js 기반의 관광 정보 및 채팅 API 서버입니다.

## 설치 및 실행

1. 의존성 설치:

```bash
npm install
```

2. 환경변수 설정:
   프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# OpenAI API 설정
OPENAI_API_KEY=your_openai_api_key_here

# 관광 데이터 API 설정
TOURISM_SERVICE_KEY=your_tourism_service_key_here

# 서버 설정
PORT=3000
NODE_ENV=development
```

3. 서버 실행:

```bash
# 개발 모드
npm run dev

# 프로덕션 모드
npm start
```

## API 엔드포인트

- `GET /` - API 상태 확인
- `GET /health` - 헬스 체크
- `POST /api/chat` - ChatGPT 채팅 (관광 데이터 포함)
- `POST /api/chat/recommend` - 관광지 추천
- `GET /api/tourism/area-based` - 관광 데이터 조회

## 필요한 API 키

1. **OpenAI API Key**: ChatGPT 기능을 위해 필요

   - https://platform.openai.com/api-keys 에서 발급

2. **Tourism Service Key**: 한국 관광 데이터 API를 위해 필요
   - https://www.data.go.kr 에서 발급

## 문제 해결

만약 `OPENAI_API_KEY is not defined` 오류가 발생한다면:

1. `.env` 파일이 프로젝트 루트에 있는지 확인
2. `.env` 파일에 올바른 API 키가 설정되어 있는지 확인
3. 서버를 재시작해보세요
