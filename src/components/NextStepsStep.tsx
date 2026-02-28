import { Building2, Phone, Scale, UserPlus } from "lucide-react";

export function NextStepsStep() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
      <div className="text-center mb-10">
        <h2 className="text-2xl font-bold text-navy mb-3">다음 절차 안내</h2>
        <p className="text-gray-600">
          작성된 진정서를 바탕으로 아래 기관에 도움을 요청할 수 있습니다.
          <br />
          가장 적합한 방법을 선택하여 권리를 찾으세요.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <a
          href="https://minwon.moel.go.kr/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-6 rounded-xl border-2 border-transparent hover:border-gold shadow-md transition-all group flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-navy/10 p-3 rounded-lg text-navy group-hover:bg-navy group-hover:text-white transition-colors">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              고용노동부 진정 접수
            </h3>
          </div>
          <p className="text-sm text-gray-600 flex-1">
            임금체불, 퇴직금 미지급 등의 경우 온라인(노동포털) 또는 관할
            지방고용노동관서에 방문/우편으로 진정서를 제출할 수 있습니다.
          </p>
          <div className="mt-4 text-gold font-semibold text-sm flex items-center gap-1 group-hover:underline">
            온라인 민원 신청하기 →
          </div>
        </a>

        <a
          href="tel:1350"
          className="bg-navy text-white p-6 rounded-xl shadow-md transition-transform hover:scale-[1.02] flex flex-col h-full"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white/20 p-3 rounded-lg text-white">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">노동청 상담전화 1350</h3>
          </div>
          <p className="text-sm text-white/80 flex-1">
            혼자 해결하기 어렵다면 고용노동부 고객상담센터로 전화하여 무료 익명
            상담을 받아보세요. (평일 09:00~18:00)
          </p>
          <div className="mt-4 font-semibold text-sm flex items-center gap-1">
            📞 1350 전화걸기 (모바일)
          </div>
        </a>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-100 p-3 rounded-lg text-gray-700">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">지방노동위원회</h3>
          </div>
          <p className="text-sm text-gray-600 flex-1">
            부당해고, 부당징계, 부당전보 등의 경우 사건 발생일로부터 3개월
            이내에 관할 지방노동위원회에 구제신청을 해야 합니다.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col h-full">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gray-100 p-3 rounded-lg text-gray-700">
              <UserPlus className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">공인노무사 상담</h3>
          </div>
          <p className="text-sm text-gray-600 flex-1">
            사건이 복잡하거나 체불액이 큰 경우, 전문가인 공인노무사의 조력을
            받는 것이 유리할 수 있습니다. 월평균 급여가 300만원 미만인 경우 무료
            &apos;국선노무사&apos; 제도를 이용할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="mt-12 text-center p-6 bg-yellow-50 rounded-lg w-full border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>주의:</strong> 본 AI 서비스가 분석한 결과와 작성된 진정서는
          법적 효력을 보장하지 않는 참고용 서류입니다.
          <br />
          실제 노동청 조사 과정에서 추가 증거나 사실관계 확인이 요구될 수
          있습니다.
        </p>
      </div>

      <button
        onClick={() => window.location.reload()}
        className="mt-8 text-navy font-semibold hover:underline"
      >
        처음으로 돌아가기 (새로운 분석 시작)
      </button>
    </div>
  );
}
