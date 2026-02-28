<div align="center">
  <h1>⚖️ EquiLaw (이퀄로)</h1>
  <p><strong>AI 노동법 위반 분석 및 진정서 원클릭 자동 접수 서비스</strong></p>
  <p>Gemini 3.0 API 해커톤 출품작</p>
</div>

---

## 🎬 최종 구현 영상 (Demo)
*(아래 영상을 클릭하여 시연을 확인하세요)*

https://github.com/user-attachments/assets/demo.mp4

> **Tip:** GitHub 리포지토리에 푸시하시면 영상이 자동으로 스트리밍 플레이어로 렌더링됩니다. (현재 `demo.mp4` 파일로 루트 디렉토리에 저장되어 있습니다.)

---

## 💡 프로젝트 소개 (About the Project)

**EquiLaw(이퀄로)**는 근로자가 부당한 대우(임금체불, 부당해고, 직장 내 괴롭힘 등)를 받았을 때, 복잡한 법적 절차를 AI를 통해 쉽고 빠르게 해결할 수 있도록 돕는 솔루션입니다. 

사용자가 카카오톡 대화 내용 캡처, 근로계약서 이미지, 녹음 파일 등 다양한 형태의 증거 자료를 업로드하면, **Google Gemini API의 강력한 멀티모달 분석 능력**을 활용하여 위반된 노동법을 찾아내고 체불 임금을 계산합니다. 나아가 분석된 데이터를 바탕으로 고용노동부 양식에 맞춘 진정서를 자동 생성하고, 관할 관서로 팩스를 발송하거나 노동포털에 원클릭으로 접수할 수 있도록 돕습니다.

### 🌟 기획 배경
법률 지식이 부족한 일반 근로자들은 본인의 권리를 찾기 위해 수많은 문서 작업과 법령 검색, 증거 정리에 많은 시간과 비용을 소모해야 합니다. EquiLaw는 이러한 정보의 비대칭성을 해소하고 누구나 쉽게 자신의 권리를 구제받을 수 있도록 개발되었습니다.

---

## ✨ 주요 기능 (Key Features)

### 1. 멀티모달 증거 자료 AI 분석 (이미지 & 음성)
- 카카오톡 캡처 화면이나 영수증 등 이미지 파일에서 텍스트를 추출 (OCR)
- 통화 녹음 파일 및 음성 파일의 내용을 분석하여 법적 쟁점 파악
- Gemini API를 활용한 컨텍스트 인지 및 **노동법 위반 조항 매핑**

### 2. 스마트 임금 체불 계산기
- 추출된 근로계약 정보와 근무 기록을 바탕으로 체불된 기본급 및 연장/야간 수당을 자동 계산
- 사용자가 직접 확인하고 수정할 수 있는 인터랙티브 UI 제공

### 3. 고용노동부 진정서 자동 생성 (Auto-generation)
- 분석된 증거와 법률 조항, 산정된 금액을 바탕으로 전문적인 법률 용어가 포함된 **진정서 3장 분량을 자동 작성**
- 작성 완료된 진정서를 확인하고 즉시 PDF 형태로 출력/다운로드 가능

### 4. 노동청 원클릭 자동 접수 시뮬레이션 및 팩스 발송
- **관할 관서 자동 매핑**: 사용자의 사업장 주소를 기반으로 최적의 관할 고용노동관서를 자동 탐색
- **자동 접수(RPA) 시뮬레이션**: 고용노동부 노동포털의 복잡한 입력 폼을 AI Action Agent가 자동으로 채워주는 시뮬레이션 시각화
- **인터넷 팩스 직접 발송**: 클릭 한 번으로 관할 노동청으로 실제 작성된 서류를 팩스 발송

### 5. 투명한 AI Agent Activity Monitor
- AI가 백그라운드에서 진행 중인 과정(추출, 분석, 계산, 폼 입력 등)을 사용자가 실시간으로 파악할 수 있도록 터미널 콘솔 형태의 모니터링 UI 제공

---

## 🛠 기술 스택 (Tech Stack)

### Frontend
- **Framework:** Next.js 15 (App Router), React 19
- **Styling:** Tailwind CSS, PostCSS
- **Icons & UI:** Lucide React

### Backend & AI
- **AI Model:** Google Gemini API (`@google/genai`) - Multimodal (Text, Image, Audio) Prompting
- **API Routes:** Next.js Route Handlers (`/api/analyze`, `/api/generate-complaint`)

### Infrastructure
- **Deployment:** Google Cloud Run (GCP), Docker (Containerized)
- **CI/CD:** Google Cloud Build

---

## 🚀 실행 방법 (Getting Started)

### 1. 레포지토리 클론
```bash
git clone https://github.com/your-username/equilaw.git
cd equilaw
```

### 2. 패키지 설치
```bash
npm install
```

### 3. 환경 변수 설정
프로젝트 루트 디렉토리에 `.env.local` 파일을 생성하고 Gemini API 키를 입력합니다.
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`에 접속하여 확인할 수 있습니다.

---

## 📝 화면 구성 (Screenshots)

1. **메인 & 파일 업로드** - 카카오톡 대화/음성 파일 등 멀티모달 데이터 업로드
2. **AI 분석 대시보드** - 법률 위반 내역 적발 및 체불 수당 계산기
3. **진정서 뷰어** - 자동 완성된 고용노동부 양식 진정서 확인
4. **자동 접수 시뮬레이션** - 노동포털 민원신청 폼 자동 입력 애니메이션
5. **팩스 전송 및 완료** - 접수 번호 안내 및 이후 절차 가이드

---

## 🤝 기여 (Contributors)

- **개발 및 기획** : 박현우 (개발자 이름을 수정해주세요)
- **이메일** : your-email@example.com

---

> **Disclaimer**: 본 서비스는 해커톤 출품작으로 개발된 프로토타입이며, 제공되는 법률 정보와 생성된 진정서 내용은 공식적인 법적 자문을 대체하지 않습니다. 실제 법적 조치를 취할 시에는 노무사 등 전문가의 조언을 구하시기 바랍니다.
