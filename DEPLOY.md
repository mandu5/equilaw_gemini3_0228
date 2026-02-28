# GCP Cloud Run 배포 가이드 (equilaw)

프로젝트 ID: **geminihackathon0228**

## 사전 요구사항

1. **gcloud CLI** 설치 및 로그인
   ```bash
   gcloud auth login
   gcloud config set project geminihackathon0228
   ```

2. **필요한 API 활성화**
   ```bash
   gcloud services enable \
     cloudbuild.googleapis.com \
     run.googleapis.com \
     artifactregistry.googleapis.com
   ```

3. **Artifact Registry 리포지토리 생성** (최초 1회)
   ```bash
   gcloud artifacts repositories create equilaw \
     --repository-format=docker \
     --location=asia-northeast3
   ```

## GEMINI_API_KEY 설정 (중요)

앱이 동작하려면 `GEMINI_API_KEY` 환경변수가 필요합니다.

### 방법 1: Cloud Run 콘솔에서 설정

1. [Cloud Run 콘솔](https://console.cloud.google.com/run?project=geminihackathon0228) 이동
2. `equilaw` 서비스 선택 → **편집**
3. **환경 변수** 탭에서 `GEMINI_API_KEY` 추가 (비밀번호/비밀 값으로 설정 권장)

### 방법 2: gcloud로 배포 시 설정

```bash
gcloud run deploy equilaw \
  --source . \
  --region=asia-northeast3 \
  --set-env-vars="GEMINI_API_KEY=YOUR_API_KEY_HERE"
```

## 배포 방법

### 방법 A: Cloud Build (권장)

```bash
gcloud builds submit --config=cloudbuild.yaml .
```

### 방법 B: gcloud 직접 배포 (Dockerfile 사용)

```bash
gcloud run deploy equilaw \
  --source . \
  --region=asia-northeast3 \
  --allow-unauthenticated
```

환경변수는 콘솔에서 별도 설정하거나 `--set-env-vars`로 전달하세요.

### 방법 C: 로컬에서 Docker 빌드 후 수동 배포

```bash
# 1. Artifact Registry로 인증
gcloud auth configure-docker asia-northeast3-docker.pkg.dev

# 2. 빌드
docker build -t asia-northeast3-docker.pkg.dev/geminihackathon0228/equilaw/equilaw:latest .

# 3. 푸시
docker push asia-northeast3-docker.pkg.dev/geminihackathon0228/equilaw/equilaw:latest

# 4. Cloud Run 배포
gcloud run deploy equilaw \
  --image=asia-northeast3-docker.pkg.dev/geminihackathon0228/equilaw/equilaw:latest \
  --region=asia-northeast3
```

## 배포 후

- 배포 완료 시 Cloud Run이 서비스 URL을 출력합니다.
- 형식: `https://equilaw-xxxxx-xx.a.run.app`
- `--allow-unauthenticated`로 설정되어 있어 누구나 접근 가능합니다.

## 보안 참고

- `.env.local`의 `GEMINI_API_KEY`는 **절대 커밋하지 마세요.** `.gitignore`에 포함되어 있습니다.
- Cloud Run 환경변수 또는 Secret Manager로 API 키를 주입하세요.
