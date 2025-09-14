import { Router } from 'express';
import axios from 'axios';

const router = Router();

// 관광 데이터 API 기본 설정
const TOURISM_API_BASE_URL = 'https://apis.data.go.kr/B551011/TarRlteTarService1';
const SERVICE_KEY = 'JnriSTQzAibWCdOYpWPZYXInnpWhqm7sJdUO6fvWMxj1qYN6T+D4Ok/oMI5XYyp+67zRvRDKQ1V1V/Svy8FjQQ==';

// 관광지 목록 조회
router.get('/areas', async (req, res) => {
  try {
    const { pageNo = 1, numOfRows = 10, areaCd = 11, signguCd = 11530, baseYm = '202503' } = req.query;
    
    const response = await axios.get(`${TOURISM_API_BASE_URL}/areaBasedList1`, {
      params: {
        serviceKey: SERVICE_KEY,
        pageNo,
        numOfRows,
        MobileOS: 'WEB',
        MobileApp: 'Aventura',
        baseYm,
        areaCd,
        signguCd,
        _type: 'json'
      }
    });

    // API 응답 구조 확인 및 처리
    const responseData = response.data;
    
    if (responseData.response && responseData.response.body) {
      res.json({
        success: true,
        data: responseData.response.body
      });
    } else {
      // 에러 응답인 경우
      res.json({
        success: false,
        message: '관광 데이터 API 응답 오류',
        data: responseData
      });
    }
  } catch (error) {
    console.error('관광 데이터 API 오류:', error.message);
    res.status(500).json({
      success: false,
      message: '관광 데이터를 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

// 관광지 상세 정보 조회
router.get('/detail/:contentId', async (req, res) => {
  try {
    const { contentId } = req.params;
    
    const response = await axios.get(`${TOURISM_API_BASE_URL}/detailCommon1`, {
      params: {
        serviceKey: SERVICE_KEY,
        contentId,
        defaultYN: 'Y',
        firstImageYN: 'Y',
        areacodeYN: 'Y',
        catcodeYN: 'Y',
        addrinfoYN: 'Y',
        mapinfoYN: 'Y',
        overviewYN: 'Y',
        MobileOS: 'WEB',
        MobileApp: 'Aventura',
        _type: 'json'
      }
    });

    res.json({
      success: true,
      data: response.data.response.body
    });
  } catch (error) {
    console.error('관광지 상세 정보 API 오류:', error.message);
    res.status(500).json({
      success: false,
      message: '관광지 상세 정보를 가져오는데 실패했습니다.',
      error: error.message
    });
  }
});

export default router;