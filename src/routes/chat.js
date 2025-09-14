import { Router } from "express";
import OpenAI from "openai";
import axios from "axios";

const router = Router();

// OpenAI 클라이언트 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// 관광 데이터 API 설정
const TOURISM_API_BASE_URL =
  "https://apis.data.go.kr/B551011/TarRlteTarService1";
const SERVICE_KEY = process.env.TOURISM_SERVICE_KEY;

// ChatGPT 채팅 엔드포인트 (관광 데이터 자동 조회 포함)
router.post("/chat", async (req, res) => {
  try {
    const {
      message,
      tourismParams = {}, // 관광 API 파라미터들
    } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "메시지가 필요합니다.",
      });
    }

    let tourismData = null;

    // 관광 데이터 조회 (기본값으로 항상 시도)
    {
      try {
        const {
          pageNo = 1,
          numOfRows = 10,
          areaCd = "1", // 서울
          signguCd = "1", // 강남구
          baseYm = "202503",
        } = { ...tourismParams };

        // 필수 파라미터 검증 (기본값이 있으므로 검증 완화)
        if (!areaCd || !signguCd) {
          return res.status(400).json({
            success: false,
            message:
              "관광 데이터 조회를 위한 필수 파라미터가 누락되었습니다. (areaCd, signguCd)",
          });
        }

        const response = await axios.get(
          `${TOURISM_API_BASE_URL}/areaBasedList1`,
          {
            params: {
              serviceKey: SERVICE_KEY,
              pageNo,
              numOfRows,
              MobileOS: "WEB",
              MobileApp: "Aventura",
              baseYm,
              areaCd,
              signguCd,
              _type: "json",
            },
          }
        );

        // API 응답 구조 확인 및 처리
        const responseData = response.data;
        console.log(
          "Tourism API Response:",
          JSON.stringify(responseData, null, 2)
        );

        if (responseData.response && responseData.response.body) {
          tourismData = responseData.response.body;
          console.log("Tourism data retrieved successfully:", tourismData);
        } else {
          console.log("No tourism data found in response");
        }
      } catch (tourismError) {
        console.error("관광 데이터 조회 오류:", tourismError.message);
        // 관광 데이터 조회 실패해도 채팅은 계속 진행
      }
    }

    // 시스템 프롬프트 설정
    let systemPrompt = `당신은 한국 관광에 대한 전문적인 AI 어시스턴트입니다. 
사용자의 질문에 대해 친절하고 정확한 답변을 제공해주세요.`;

    if (tourismData) {
      systemPrompt += `\n\n현재 조회된 관광 데이터:\n${JSON.stringify(
        tourismData,
        null,
        2
      )}`;
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: message,
        },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    res.json({
      success: true,
      data: {
        message: completion.choices[0].message.content,
        usage: completion.usage,
        tourismData: tourismData, // 조회된 관광 데이터도 함께 반환
      },
    });
  } catch (error) {
    console.error("ChatGPT API 오류:", error.message);
    res.status(500).json({
      success: false,
      message: "채팅 응답을 생성하는데 실패했습니다.",
      error: error.message,
    });
  }
});

// 관광지 추천 채팅
router.post("/recommend", async (req, res) => {
  try {
    const { preferences, area, budget, duration } = req.body;

    const prompt = `사용자의 관광지 추천 요청:
- 선호도: ${preferences || "특별한 선호도 없음"}
- 지역: ${area || "전국"}
- 예산: ${budget || "제한 없음"}
- 여행 기간: ${duration || "1일"}

위 조건에 맞는 한국의 관광지를 추천해주세요. 각 관광지에 대해 간단한 설명과 함께 추천 이유를 알려주세요.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "당신은 한국 관광 전문가입니다. 사용자의 요구사항에 맞는 관광지를 추천해주세요.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 1500,
      temperature: 0.7,
    });

    res.json({
      success: true,
      data: {
        recommendation: completion.choices[0].message.content,
        usage: completion.usage,
      },
    });
  } catch (error) {
    console.error("관광지 추천 API 오류:", error.message);
    res.status(500).json({
      success: false,
      message: "관광지 추천을 생성하는데 실패했습니다.",
      error: error.message,
    });
  }
});

export default router;
