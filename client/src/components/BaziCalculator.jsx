import React, { useState } from 'react';
import { Calendar, Info, Heart, QrCode, X } from 'lucide-react';

const BaziCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [birthTime, setBirthTime] = useState('');
  const [gender, setGender] = useState('male');
  const [result, setResult] = useState(null);
  const [showDonation, setShowDonation] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('wechat');

  // 天干
  const tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
  
  // 地支
  const diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  
  // 五行属性
  const wuXing = {
    '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
    '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
    '子': '水', '丑': '土', '寅': '木', '卯': '木', '辰': '土',
    '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金',
    '戌': '土', '亥': '水'
  };
  
  // 阴阳属性
  const yinYang = {
    '甲': '阳', '乙': '阴', '丙': '阳', '丁': '阴', '戊': '阳',
    '己': '阴', '庚': '阳', '辛': '阴', '壬': '阳', '癸': '阴',
    '子': '阳', '丑': '阴', '寅': '阳', '卯': '阴', '辰': '阳',
    '巳': '阴', '午': '阳', '未': '阴', '申': '阳', '酉': '阴',
    '戌': '阳', '亥': '阴'
  };

  // 地支藏干
  const dizhiCangGan = {
    '子': ['癸'],
    '丑': ['己', '癸', '辛'],
    '寅': ['甲', '丙', '戊'],
    '卯': ['乙'],
    '辰': ['戊', '乙', '癸'],
    '巳': ['丙', '庚', '戊'],
    '午': ['丁', '己'],
    '未': ['己', '丁', '乙'],
    '申': ['庚', '壬', '戊'],
    '酉': ['辛'],
    '戌': ['戊', '辛', '丁'],
    '亥': ['壬', '甲']
  };

  // 星座日期范围
  const zodiacSigns = {
    '白羊座': { start: [3, 21], end: [4, 19], element: '火', quality: '开创' },
    '金牛座': { start: [4, 20], end: [5, 20], element: '土', quality: '固定' },
    '双子座': { start: [5, 21], end: [6, 21], element: '风', quality: '变动' },
    '巨蟹座': { start: [6, 22], end: [7, 22], element: '水', quality: '开创' },
    '狮子座': { start: [7, 23], end: [8, 22], element: '火', quality: '固定' },
    '处女座': { start: [8, 23], end: [9, 22], element: '土', quality: '变动' },
    '天秤座': { start: [9, 23], end: [10, 23], element: '风', quality: '开创' },
    '天蝎座': { start: [10, 24], end: [11, 22], element: '水', quality: '固定' },
    '射手座': { start: [11, 23], end: [12, 21], element: '火', quality: '变动' },
    '摩羯座': { start: [12, 22], end: [1, 19], element: '土', quality: '开创' },
    '水瓶座': { start: [1, 20], end: [2, 18], element: '风', quality: '固定' },
    '双鱼座': { start: [2, 19], end: [3, 20], element: '水', quality: '变动' }
  };

  // 计算星座
  const getZodiacSign = (month, day) => {
    for (const [sign, range] of Object.entries(zodiacSigns)) {
      const [startMonth, startDay] = range.start;
      const [endMonth, endDay] = range.end;
      
      if (startMonth === endMonth) {
        if (month === startMonth && day >= startDay && day <= endDay) return sign;
      } else {
        if ((month === startMonth && day >= startDay) || 
            (month === endMonth && day <= endDay)) {
          return sign;
        }
      }
    }
    return '白羊座';
  };

  // 星座健康分析
  const getZodiacHealth = (sign) => {
    const healthMap = {
      '白羊座': { area: '头部、面部', tendency: '易头痛、上火', advice: '注意控制情绪，避免冲动受伤' },
      '金牛座': { area: '喉咙、颈部', tendency: '易咽喉炎、甲状腺问题', advice: '注意喉部保养，避免过度用嗓' },
      '双子座': { area: '肺部、手臂', tendency: '易呼吸道疾病、神经紧张', advice: '多做深呼吸，保持心态平和' },
      '巨蟹座': { area: '胃部、胸部', tendency: '易消化不良、情绪性胃痛', advice: '饮食规律，注意情绪管理' },
      '狮子座': { area: '心脏、脊椎', tendency: '易心血管问题、背部劳损', advice: '适度运动，避免过度劳累' },
      '处女座': { area: '肠道、消化系统', tendency: '易肠胃敏感、过敏', advice: '注意饮食卫生，保持规律作息' },
      '天秤座': { area: '肾脏、腰部', tendency: '易肾虚、腰痛', advice: '保持水分摄入，注意腰部保暖' },
      '天蝎座': { area: '生殖系统、排泄系统', tendency: '易内分泌失调', advice: '定期体检，注意私密部位健康' },
      '射手座': { area: '肝脏、大腿', tendency: '易肝火旺、运动损伤', advice: '适度运动，避免过度冒险' },
      '摩羯座': { area: '骨骼、关节', tendency: '易骨质问题、关节炎', advice: '补充钙质，注意关节保护' },
      '水瓶座': { area: '循环系统、小腿', tendency: '易血液循环不良、静脉曲张', advice: '多活动腿部，促进血液循环' },
      '双鱼座': { area: '足部、淋巴系统', tendency: '易水肿、免疫力低', advice: '注意足部保养，增强体质' }
    };
    return healthMap[sign];
  };

  // 星座财运分析
  const getZodiacWealth = (sign) => {
    const wealthMap = {
      '白羊座': { style: '冲动型消费', strength: '创业能力强', advice: '善于把握商机，但需谨防冲动投资' },
      '金牛座': { style: '稳健型理财', strength: '积累财富能力强', advice: '擅长长期投资，建议不动产和价值投资' },
      '双子座': { style: '多元化投资', strength: '信息捕捉能力强', advice: '适合短线交易和多渠道创收' },
      '巨蟹座': { style: '保守型储蓄', strength: '家庭理财能力强', advice: '重视安全感，适合稳健型理财产品' },
      '狮子座': { style: '大手笔投资', strength: '领导创业能力强', advice: '有赚大钱的潜力，但需控制炫耀性消费' },
      '处女座': { style: '精打细算型', strength: '财务规划能力强', advice: '擅长分析，适合做投资顾问或理财规划' },
      '天秤座': { style: '均衡型投资', strength: '合作赚钱能力强', advice: '适合合伙经营，注意保持财务平衡' },
      '天蝎座': { style: '深度投资型', strength: '洞察力强', advice: '擅长发现隐藏价值，适合风险投资' },
      '射手座': { style: '投机冒险型', strength: '国际贸易能力强', advice: '财运波动大，建议分散风险' },
      '摩羯座': { style: '长期规划型', strength: '事业成就带来财富', advice: '通过努力累积财富，晚年运势更佳' },
      '水瓶座': { style: '创新投资型', strength: '科技领域机会多', advice: '适合投资新兴产业和高科技' },
      '双鱼座': { style: '直觉型投资', strength: '艺术变现能力', advice: '财运靠灵感和创意，需防上当受骗' }
    };
    return wealthMap[sign];
  };

  // 星座学业分析
  const getZodiacEducation = (sign) => {
    const eduMap = {
      '白羊座': { style: '行动派学习', strength: '体育、竞技类', advice: '学习有冲劲但耐心不足，适合短期目标激励' },
      '金牛座': { style: '稳扎稳打', strength: '艺术、商科', advice: '学习踏实但较慢，需要时间消化知识' },
      '双子座': { style: '多元化学习', strength: '语言、传媒', advice: '学习能力强但易分心，需培养专注力' },
      '巨蟹座': { style: '情感记忆型', strength: '历史、文学', advice: '记忆力好，适合需要背诵的科目' },
      '狮子座': { style: '表现型学习', strength: '表演、领导学', advice: '喜欢展示成果，适合演讲和表演类' },
      '处女座': { style: '完美主义型', strength: '医学、研究', advice: '注重细节，适合精确性学科' },
      '天秤座': { style: '平衡协调型', strength: '法律、艺术', advice: '善于权衡，适合需要判断力的学科' },
      '天蝎座': { style: '深度钻研型', strength: '心理学、侦探', advice: '专注力强，适合深度研究' },
      '射手座': { style: '探索型学习', strength: '哲学、旅游', advice: '视野开阔，适合国际化学科' },
      '摩羯座': { style: '目标导向型', strength: '管理、工程', advice: '学习有毅力，适合长期项目' },
      '水瓶座': { style: '创新思维型', strength: '科技、创新', advice: '思维独特，适合前沿科技领域' },
      '双鱼座': { style: '想象力型', strength: '艺术、音乐', advice: '富有创意，适合艺术创作类' }
    };
    return eduMap[sign];
  };

  // 星座爱情分析
  const getZodiacLove = (sign) => {
    const loveMap = {
      '白羊座': { style: '热情直接', compatibility: '狮子座、射手座、双子座', advice: '追求刺激，需要学会耐心经营感情' },
      '金牛座': { style: '稳定专一', compatibility: '处女座、摩羯座、巨蟹座', advice: '重视安全感，适合长期稳定关系' },
      '双子座': { style: '多变有趣', compatibility: '水瓶座、天秤座、白羊座', advice: '需要精神交流，害怕枯燥关系' },
      '巨蟹座': { style: '体贴顾家', compatibility: '天蝎座、双鱼座、金牛座', advice: '情感丰富，需要被重视和保护' },
      '狮子座': { style: '慷慨大方', compatibility: '白羊座、射手座、双子座', advice: '需要被崇拜，喜欢浪漫场面' },
      '处女座': { style: '细心谨慎', compatibility: '金牛座、摩羯座、天蝎座', advice: '完美主义，需要时间建立信任' },
      '天秤座': { style: '优雅浪漫', compatibility: '双子座、水瓶座、狮子座', advice: '追求和谐，害怕冲突和孤独' },
      '天蝎座': { style: '深情专一', compatibility: '巨蟹座、双鱼座、处女座', advice: '占有欲强，感情浓烈而深刻' },
      '射手座': { style: '自由奔放', compatibility: '白羊座、狮子座、水瓶座', advice: '需要空间，害怕被束缚' },
      '摩羯座': { style: '务实稳重', compatibility: '金牛座、处女座、天蝎座', advice: '慢热型，但一旦认定就很专一' },
      '水瓶座': { style: '理性独立', compatibility: '双子座、天秤座、射手座', advice: '重视精神契合，需要个人空间' },
      '双鱼座': { style: '浪漫梦幻', compatibility: '巨蟹座、天蝎座、摩羯座', advice: '感性易感，需要被呵护和理解' }
    };
    return loveMap[sign];
  };

  // 星座事业分析
  const getZodiacCareer = (sign) => {
    const careerMap = {
      '白羊座': { field: '创业、销售、体育、军警', trait: '领导力强、执行力佳', advice: '适合开创性工作，不适合重复性工作' },
      '金牛座': { field: '金融、艺术、餐饮、园艺', trait: '耐心稳定、审美能力', advice: '适合需要耐心和品味的工作' },
      '双子座': { field: '媒体、教育、销售、翻译', trait: '沟通能力强、反应快', advice: '适合需要交流和灵活性的工作' },
      '巨蟹座': { field: '教育、护理、餐饮、房地产', trait: '关怀能力、记忆力好', advice: '适合照顾他人和家庭相关的工作' },
      '狮子座': { field: '管理、表演、奢侈品、娱乐', trait: '领导魅力、表现力强', advice: '适合需要领导力和舞台的工作' },
      '处女座': { field: '医疗、研究、会计、编辑', trait: '细致严谨、分析能力', advice: '适合需要精确性和服务的工作' },
      '天秤座': { field: '法律、设计、外交、咨询', trait: '协调能力、审美能力', advice: '适合需要公正和美感的工作' },
      '天蝎座': { field: '调查、金融、心理、医疗', trait: '洞察力强、专注力高', advice: '适合需要深度研究和保密的工作' },
      '射手座': { field: '旅游、教育、出版、法律', trait: '乐观开朗、视野广阔', advice: '适合国际化和自由度高的工作' },
      '摩羯座': { field: '管理、建筑、政府、工程', trait: '责任心强、组织能力', advice: '适合需要长期规划和稳定的工作' },
      '水瓶座': { field: '科技、创新、公益、咨询', trait: '创新思维、人道主义', advice: '适合前沿和改革性的工作' },
      '双鱼座': { field: '艺术、影视、慈善、治疗', trait: '想象力丰富、同理心强', advice: '适合创意和帮助他人的工作' }
    };
    return careerMap[sign];
  };

  // 时辰对应地支
  const timeToZhi = (hour) => {
    const h = parseInt(hour);
    if (h >= 23 || h < 1) return 0; // 子
    if (h >= 1 && h < 3) return 1;  // 丑
    if (h >= 3 && h < 5) return 2;  // 寅
    if (h >= 5 && h < 7) return 3;  // 卯
    if (h >= 7 && h < 9) return 4;  // 辰
    if (h >= 9 && h < 11) return 5; // 巳
    if (h >= 11 && h < 13) return 6; // 午
    if (h >= 13 && h < 15) return 7; // 未
    if (h >= 15 && h < 17) return 8; // 申
    if (h >= 17 && h < 19) return 9; // 酉
    if (h >= 19 && h < 21) return 10; // 戌
    return 11; // 亥
  };

  // 计算年柱
  const getYearPillar = (year) => {
    const baseYear = 1984; // 甲子年
    const offset = year - baseYear;
    const ganIndex = offset % 10;
    const zhiIndex = offset % 12;
    return {
      gan: tianGan[(ganIndex + 10) % 10],
      zhi: diZhi[(zhiIndex + 12) % 12]
    };
  };

  // 计算月柱（简化版）
  const getMonthPillar = (year, month) => {
    const yearGanIndex = tianGan.indexOf(getYearPillar(year).gan);
    const monthGanStart = (yearGanIndex % 5) * 2;
    const ganIndex = (monthGanStart + month - 1) % 10;
    const zhiIndex = (month + 1) % 12;
    return {
      gan: tianGan[ganIndex],
      zhi: diZhi[zhiIndex]
    };
  };

  // 计算日柱（简化版，实际需要万年历）
  const getDayPillar = (date) => {
    const baseDate = new Date('1984-01-01');
    const targetDate = new Date(date);
    const diffDays = Math.floor((targetDate - baseDate) / (1000 * 60 * 60 * 24));
    const ganIndex = diffDays % 10;
    const zhiIndex = diffDays % 12;
    return {
      gan: tianGan[(ganIndex + 10) % 10],
      zhi: diZhi[(zhiIndex + 12) % 12]
    };
  };

  // 计算时柱
  const getHourPillar = (dayGan, hour) => {
    const dayGanIndex = tianGan.indexOf(dayGan);
    const zhiIndex = timeToZhi(hour);
    const ganStart = (dayGanIndex % 5) * 2;
    const ganIndex = (ganStart + zhiIndex) % 10;
    return {
      gan: tianGan[ganIndex],
      zhi: diZhi[zhiIndex]
    };
  };

  // 五行统计
  const countWuXing = (bazi) => {
    const count = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    ['year', 'month', 'day', 'hour'].forEach(pillar => {
      count[wuXing[bazi[pillar].gan]]++;
      count[wuXing[bazi[pillar].zhi]]++;
    });
    return count;
  };

  // 分析五行强弱
  const analyzeWuXing = (count) => {
    const total = Object.values(count).reduce((a, b) => a + b, 0);
    const analysis = {};
    Object.keys(count).forEach(element => {
      const ratio = (count[element] / total * 100).toFixed(1);
      if (count[element] === 0) {
        analysis[element] = '缺';
      } else if (count[element] >= 3) {
        analysis[element] = '旺';
      } else if (count[element] === 1) {
        analysis[element] = '弱';
      } else {
        analysis[element] = '平';
      }
    });
    return analysis;
  };

  // 健康预测
  const getHealthPrediction = (bazi, wuxingCount, wuxingAnalysis) => {
    const predictions = [];
    const riZhuWuxing = wuXing[bazi.day.gan];
    
    // 根据五行旺衰判断健康倾向
    if (wuxingAnalysis['木'] === '缺' || wuxingAnalysis['木'] === '弱') {
      predictions.push({ organ: '肝胆系统', level: '注意', advice: '注意肝胆保养，避免熬夜，保持心情舒畅' });
    }
    if (wuxingAnalysis['火'] === '缺' || wuxingAnalysis['火'] === '弱') {
      predictions.push({ organ: '心血管系统', level: '注意', advice: '注意心脏健康，适度运动，保持血液循环' });
    }
    if (wuxingAnalysis['土'] === '缺' || wuxingAnalysis['土'] === '弱') {
      predictions.push({ organ: '脾胃系统', level: '注意', advice: '注意饮食规律，避免暴饮暴食，健脾养胃' });
    }
    if (wuxingAnalysis['金'] === '缺' || wuxingAnalysis['金'] === '弱') {
      predictions.push({ organ: '呼吸系统', level: '注意', advice: '注意肺部健康，避免受寒，保持呼吸道通畅' });
    }
    if (wuxingAnalysis['水'] === '缺' || wuxingAnalysis['水'] === '弱') {
      predictions.push({ organ: '肾泌尿系统', level: '注意', advice: '注意肾脏保养，多喝水，避免过度劳累' });
    }
    
    if (wuxingAnalysis['木'] === '旺') {
      predictions.push({ organ: '肝胆系统', level: '偏旺', advice: '肝气偏旺，注意情绪管理，避免暴怒伤肝' });
    }
    if (wuxingAnalysis['火'] === '旺') {
      predictions.push({ organ: '心血管系统', level: '偏旺', advice: '火气偏旺，注意降火清热，保持心态平和' });
    }
    
    return predictions.length > 0 ? predictions : [{ organ: '整体', level: '良好', advice: '五行较为平衡，保持良好生活习惯' }];
  };

  // 财运预测
  const getWealthPrediction = (bazi, wuxingCount, riZhuWuxing) => {
    const predictions = [];
    
    // 财星判断（我克者为财）
    const caiXing = {
      '木': '土', '火': '金', '土': '水', '金': '木', '水': '火'
    };
    const myCai = caiXing[riZhuWuxing];
    const caiCount = wuxingCount[myCai];
    
    if (caiCount === 0) {
      predictions.push({
        aspect: '财运基础',
        trend: '偏弱',
        advice: '命中财星较弱，建议开源节流，理性投资，稳健为主'
      });
    } else if (caiCount >= 3) {
      predictions.push({
        aspect: '财运基础',
        trend: '旺盛',
        advice: '命中财星旺盛，财运机会多，但需把握时机，避免财多身弱'
      });
    } else {
      predictions.push({
        aspect: '财运基础',
        trend: '平稳',
        advice: '财运平稳，适合稳健投资，积少成多'
      });
    }
    
    // 根据日柱天干判断求财方式
    const ganCai = {
      '甲': '脚踏实地，适合实业投资',
      '乙': '灵活变通，适合商贸流通',
      '丙': '热情开朗，适合服务行业',
      '丁': '细心谨慎，适合技术专业',
      '戊': '诚信厚重，适合不动产业',
      '己': '勤俭持家，适合稳健理财',
      '庚': '果断决绝，适合金融投资',
      '辛': '精致细腻，适合艺术珠宝',
      '壬': '智慧流动，适合贸易物流',
      '癸': '柔和包容，适合服务咨询'
    };
    
    predictions.push({
      aspect: '求财方式',
      trend: '建议',
      advice: ganCai[bazi.day.gan]
    });
    
    return predictions;
  };

  // 生成支付二维码（模拟）
  const generatePaymentQR = (method, amount) => {
    // 实际应用中，这里需要调用后端API生成真实的支付二维码
    // 返回二维码URL或base64数据
    const qrData = {
      wechat: `wxp://f2f0xxxxxxxxxxxxx?amount=${amount}`,
      alipay: `alipays://platformapi/startapp?amount=${amount}`
    };
    return qrData[method];
  };

  // 处理打赏
  const handleDonation = () => {
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('请输入有效的打赏金额');
      return;
    }
    
    // 实际应用中，这里应该：
    // 1. 调用后端API创建订单
    // 2. 获取支付二维码
    // 3. 轮询支付状态
    
    const qrCode = generatePaymentQR(paymentMethod, donationAmount);
    console.log('Payment QR Code:', qrCode);
    
    // 这里只是演示，实际需要显示真实的二维码
    alert(`感谢您的${donationAmount}元打赏！\n请使用${paymentMethod === 'wechat' ? '微信' : '支付宝'}扫码支付`);
  };

  // 学业预测
  const getEducationPrediction = (bazi, wuxingCount) => {
    const predictions = [];
    
    // 印星代表学业（生我者为印）
    const riZhuWuxing = wuXing[bazi.day.gan];
    const yinXing = {
      '木': '水', '火': '木', '土': '火', '金': '土', '水': '金'
    };
    const myYin = yinXing[riZhuWuxing];
    const yinCount = wuxingCount[myYin];
    
    if (yinCount >= 2) {
      predictions.push({
        aspect: '学习能力',
        level: '优秀',
        detail: '印星旺盛，学习能力强，善于吸收知识，适合深造'
      });
    } else if (yinCount === 1) {
      predictions.push({
        aspect: '学习能力',
        level: '良好',
        detail: '印星适中，学习踏实，通过努力可取得好成绩'
      });
    } else {
      predictions.push({
        aspect: '学习能力',
        level: '需努力',
        detail: '印星较弱，需要加倍努力，培养良好学习习惯'
      });
    }
    
    // 根据五行判断擅长领域
    const maxElement = Object.keys(wuxingCount).reduce((a, b) => 
      wuxingCount[a] > wuxingCount[b] ? a : b
    );
    
    const subjectMap = {
      '木': '文学、艺术、设计类学科',
      '火': '理工、电子、计算机类学科',
      '土': '建筑、地理、农学类学科',
      '金': '经济、法律、管理类学科',
      '水': '哲学、历史、医学类学科'
    };
    
    predictions.push({
      aspect: '擅长方向',
      level: '推荐',
      detail: `五行${maxElement}较旺，适合${subjectMap[maxElement]}`
    });
    
    return predictions;
  };

  // 感情预测
  const getLovePrediction = (bazi, wuxingCount, gender) => {
    const predictions = [];
    const riZhuWuxing = wuXing[bazi.day.gan];
    
    // 男命以财为妻，女命以官为夫
    let spouseStar;
    if (gender === 'male') {
      const caiXing = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
      spouseStar = caiXing[riZhuWuxing];
    } else {
      const guanXing = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };
      spouseStar = guanXing[riZhuWuxing];
    }
    
    const spouseCount = wuxingCount[spouseStar];
    const starName = gender === 'male' ? '财星' : '官星';
    
    if (spouseCount === 0) {
      predictions.push({
        aspect: '感情缘分',
        status: '缘分较晚',
        advice: `${starName}不现，姻缘可能较晚，需要主动创造机会`
      });
    } else if (spouseCount === 1) {
      predictions.push({
        aspect: '感情缘分',
        status: '专一稳定',
        advice: `${starName}独现，感情专一，易得良缘`
      });
    } else if (spouseCount >= 2) {
      predictions.push({
        aspect: '感情缘分',
        status: '桃花较旺',
        advice: `${starName}多现，异性缘佳，但需谨慎选择，避免多角关系`
      });
    }
    
    // 日支看配偶性格
    const spouseChar = {
      '子': '聪明灵活，善于沟通',
      '丑': '勤劳踏实，顾家节俭',
      '寅': '热情开朗，积极进取',
      '卯': '温柔体贴，心思细腻',
      '辰': '稳重大气，有责任心',
      '巳': '聪慧敏锐，追求完美',
      '午': '热情奔放，富有激情',
      '未': '温和善良，重视家庭',
      '申': '聪明机智，善于社交',
      '酉': '细致认真，注重品质',
      '戌': '忠诚可靠，重情重义',
      '亥': '宽容大度，善解人意'
    };
    
    predictions.push({
      aspect: '配偶特质',
      status: '性格参考',
      advice: `日支${bazi.day.zhi}，配偶${spouseChar[bazi.day.zhi]}`
    });
    
    return predictions;
  };

  // 事业预测
  const getCareerPrediction = (bazi, wuxingCount, wuxingAnalysis) => {
    const predictions = [];
    const riZhuWuxing = wuXing[bazi.day.gan];
    
    // 官星代表事业（克我者为官）
    const guanXing = {
      '木': '金', '火': '水', '土': '木', '金': '火', '水': '土'
    };
    const myGuan = guanXing[riZhuWuxing];
    const guanCount = wuxingCount[myGuan];
    
    if (guanCount >= 2) {
      predictions.push({
        category: '职业发展',
        potential: '管理潜力',
        description: '官星旺盛，适合公职、管理岗位，有领导才能'
      });
    } else if (guanCount === 1) {
      predictions.push({
        category: '职业发展',
        potential: '稳步上升',
        description: '官星适中，事业平稳发展，需要持续努力'
      });
    } else {
      predictions.push({
        category: '职业发展',
        potential: '自由发展',
        description: '官星较弱，适合自由职业或创业，不宜受约束'
      });
    }
    
    // 根据日干推荐职业方向
    const careerMap = {
      '甲': ['林业', '木材', '家具', '园艺', '教育'],
      '乙': ['文化', '出版', '花卉', '服装', '设计'],
      '丙': ['能源', '电力', '光学', '娱乐', '演艺'],
      '丁': ['餐饮', '化工', '照明', '文艺', '美容'],
      '戊': ['房地产', '建筑', '矿业', '农业', '陶瓷'],
      '己': ['农产品', '畜牧', '食品', '中介', '顾问'],
      '庚': ['金融', '机械', '五金', '军警', '汽车'],
      '辛': ['珠宝', '钟表', '精密仪器', '医疗器械'],
      '壬': ['航运', '水产', '物流', '旅游', '饮料'],
      '癸': ['渔业', '洗涤', '清洁', '医药', '化学']
    };
    
    predictions.push({
      category: '行业方向',
      potential: '推荐领域',
      description: `适合行业：${careerMap[bazi.day.gan].join('、')}`
    });
    
    // 根据五行强弱推荐发展方位
    const directionMap = {
      '木': '东方', '火': '南方', '土': '中部', '金': '西方', '水': '北方'
    };
    
    const strongElements = Object.keys(wuxingAnalysis).filter(
      e => wuxingAnalysis[e] === '旺' || wuxingAnalysis[e] === '平'
    );
    
    if (strongElements.length > 0) {
      predictions.push({
        category: '发展方位',
        potential: '有利方向',
        description: `适合在${strongElements.map(e => directionMap[e]).join('、')}发展`
      });
    }
    
    return predictions;
  };

  // 计算八字
  const calculateBazi = () => {
    if (!birthDate || !birthTime) {
      alert('请填写完整的出生日期和时间');
      return;
    }

    const date = new Date(birthDate + 'T' + birthTime);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();

    const yearPillar = getYearPillar(year);
    const monthPillar = getMonthPillar(year, month);
    const dayPillar = getDayPillar(birthDate);
    const hourPillar = getHourPillar(dayPillar.gan, hour);

    const bazi = {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourPillar
    };

    const wuxingCount = countWuXing(bazi);
    const wuxingAnalysis = analyzeWuXing(wuxingCount);

    // 确定日主和用神（简化版）
    const riZhu = dayPillar.gan;
    const riZhuWuXing = wuXing[riZhu];
    
    // 计算星座
    const zodiac = getZodiacSign(month, day);
    const zodiacInfo = zodiacSigns[zodiac];
    
    // 生成各方面预测
    const healthPred = getHealthPrediction(bazi, wuxingCount, wuxingAnalysis);
    const wealthPred = getWealthPrediction(bazi, wuxingCount, riZhuWuXing);
    const eduPred = getEducationPrediction(bazi, wuxingCount);
    const lovePred = getLovePrediction(bazi, wuxingCount, gender);
    const careerPred = getCareerPrediction(bazi, wuxingCount, wuxingAnalysis);
    
    // 星座预测
    const zodiacHealth = getZodiacHealth(zodiac);
    const zodiacWealth = getZodiacWealth(zodiac);
    const zodiacEdu = getZodiacEducation(zodiac);
    const zodiacLove = getZodiacLove(zodiac);
    const zodiacCareer = getZodiacCareer(zodiac);
    
    setResult({
      bazi,
      wuxingCount,
      wuxingAnalysis,
      riZhu,
      riZhuWuXing,
      zodiac,
      zodiacInfo,
      predictions: {
        health: healthPred,
        wealth: wealthPred,
        education: eduPred,
        love: lovePred,
        career: careerPred
      },
      zodiacPredictions: {
        health: zodiacHealth,
        wealth: zodiacWealth,
        education: zodiacEdu,
        love: zodiacLove,
        career: zodiacCareer
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <Calendar className="w-8 h-8 text-amber-600" />
            <h1 className="text-3xl font-bold text-gray-800">八字命理推导系统</h1>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                出生日期
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                出生时间
              </label>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                性别
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="male"
                    checked={gender === 'male'}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2"
                  />
                  男
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="female"
                    checked={gender === 'female'}
                    onChange={(e) => setGender(e.target.value)}
                    className="mr-2"
                  />
                  女
                </label>
              </div>
            </div>

            <button
              onClick={calculateBazi}
              className="w-full bg-gradient-to-r from-amber-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:from-amber-700 hover:to-orange-700 transition-all shadow-lg"
            >
              排盘推算
            </button>
          </div>
        </div>

        {result && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Info className="w-6 h-6 text-amber-600" />
                四柱八字
              </h2>
              
              <div className="grid grid-cols-4 gap-4 mb-8">
                {['year', 'month', 'day', 'hour'].map((pillar, idx) => (
                  <div key={pillar} className="text-center">
                    <div className="text-sm text-gray-500 mb-2">
                      {['年柱', '月柱', '日柱', '时柱'][idx]}
                    </div>
                    <div className="bg-gradient-to-br from-red-100 to-orange-100 rounded-xl p-4 shadow-md">
                      <div className="text-3xl font-bold text-red-800 mb-2">
                        {result.bazi[pillar].gan}
                      </div>
                      <div className="text-3xl font-bold text-orange-800">
                        {result.bazi[pillar].zhi}
                      </div>
                      <div className="mt-3 pt-3 border-t border-orange-200 space-y-1">
                        <div className="text-xs text-gray-600">
                          天干: {yinYang[result.bazi[pillar].gan]} {wuXing[result.bazi[pillar].gan]}
                        </div>
                        <div className="text-xs text-gray-600">
                          地支: {yinYang[result.bazi[pillar].zhi]} {wuXing[result.bazi[pillar].zhi]}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-amber-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">日主分析</h3>
                <p className="text-gray-700">
                  日主为 <span className="font-bold text-red-700 text-xl">{result.riZhu}</span>，
                  五行属 <span className="font-bold text-amber-700 text-xl">{result.riZhuWuXing}</span>
                </p>
              </div>

              <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <span className="text-2xl">⭐</span> 星座信息
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">星座</div>
                    <div className="text-2xl font-bold text-purple-700">{result.zodiac}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">元素</div>
                    <div className="text-xl font-semibold text-pink-700">{result.zodiacInfo.element}象</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-gray-600 mb-1">性质</div>
                    <div className="text-xl font-semibold text-purple-600">{result.zodiacInfo.quality}星座</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">五行统计</h3>
                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(result.wuxingCount).map(([element, count]) => (
                    <div key={element} className="text-center">
                      <div className="text-2xl font-bold mb-2">{element}</div>
                      <div className="text-3xl font-bold text-indigo-600 mb-2">{count}</div>
                      <div className={`text-sm font-semibold px-3 py-1 rounded-full ${
                        result.wuxingAnalysis[element] === '旺' ? 'bg-green-200 text-green-800' :
                        result.wuxingAnalysis[element] === '缺' ? 'bg-red-200 text-red-800' :
                        result.wuxingAnalysis[element] === '弱' ? 'bg-yellow-200 text-yellow-800' :
                        'bg-blue-200 text-blue-800'
                      }`}>
                        {result.wuxingAnalysis[element]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-xl font-bold text-gray-800 mb-4">地支藏干详解</h3>
              <div className="grid grid-cols-2 gap-4">
                {['year', 'month', 'day', 'hour'].map((pillar, idx) => (
                  <div key={pillar} className="bg-gray-50 rounded-lg p-4">
                    <div className="font-semibold text-gray-700 mb-2">
                      {['年支', '月支', '日支', '时支'][idx]} {result.bazi[pillar].zhi}
                    </div>
                    <div className="text-sm text-gray-600">
                      藏干: {dizhiCangGan[result.bazi[pillar].zhi].map(gan => 
                        `${gan}(${wuXing[gan]})`
                      ).join('、')}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 命理预测部分 */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b-2 border-amber-200 pb-3">
                命理预测详解
              </h2>

              {/* 健康运势 */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-red-700 mb-4 flex items-center gap-2">
                  <span className="text-2xl">❤️</span> 健康运势
                </h3>
                
                {/* 八字健康 */}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-red-100 text-red-700 rounded">八字分析</span>
                  </div>
                  <div className="space-y-3">
                    {result.predictions.health.map((item, idx) => (
                      <div key={idx} className="bg-red-50 rounded-lg p-4 border-l-4 border-red-400">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-gray-800">{item.organ}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.level === '良好' ? 'bg-green-100 text-green-700' :
                            item.level === '注意' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {item.level}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{item.advice}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 星座健康 */}
                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">星座参考</span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-400">
                    <div className="font-semibold text-gray-800 mb-2">
                      {result.zodiac} - {result.zodiacPredictions.health.area}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">倾向：</span>{result.zodiacPredictions.health.tendency}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">建议：</span>{result.zodiacPredictions.health.advice}
                    </p>
                  </div>
                </div>
              </div>

              {/* 财运分析 */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-yellow-700 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💰</span> 财运分析
                </h3>
                
                {/* 八字财运 */}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">八字分析</span>
                  </div>
                  <div className="space-y-3">
                    {result.predictions.wealth.map((item, idx) => (
                      <div key={idx} className="bg-yellow-50 rounded-lg p-4 border-l-4 border-yellow-400">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-gray-800">{item.aspect}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.trend === '旺盛' ? 'bg-green-100 text-green-700' :
                            item.trend === '偏弱' ? 'bg-orange-100 text-orange-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {item.trend}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{item.advice}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 星座财运 */}
                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">星座参考</span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-400">
                    <div className="font-semibold text-gray-800 mb-2">
                      {result.zodiac} - {result.zodiacPredictions.wealth.style}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">优势：</span>{result.zodiacPredictions.wealth.strength}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">建议：</span>{result.zodiacPredictions.wealth.advice}
                    </p>
                  </div>
                </div>
              </div>

              {/* 学业运势 */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-blue-700 mb-4 flex items-center gap-2">
                  <span className="text-2xl">📚</span> 学业运势
                </h3>
                
                {/* 八字学业 */}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded">八字分析</span>
                  </div>
                  <div className="space-y-3">
                    {result.predictions.education.map((item, idx) => (
                      <div key={idx} className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-gray-800">{item.aspect}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.level === '优秀' ? 'bg-green-100 text-green-700' :
                            item.level === '良好' ? 'bg-blue-100 text-blue-700' :
                            item.level === '推荐' ? 'bg-purple-100 text-purple-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {item.level}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{item.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 星座学业 */}
                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">星座参考</span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-400">
                    <div className="font-semibold text-gray-800 mb-2">
                      {result.zodiac} - {result.zodiacPredictions.education.style}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">擅长：</span>{result.zodiacPredictions.education.strength}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">建议：</span>{result.zodiacPredictions.education.advice}
                    </p>
                  </div>
                </div>
              </div>

              {/* 感情运势 */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-pink-700 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💕</span> 感情运势
                </h3>
                
                {/* 八字感情 */}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded">八字分析</span>
                  </div>
                  <div className="space-y-3">
                    {result.predictions.love.map((item, idx) => (
                      <div key={idx} className="bg-pink-50 rounded-lg p-4 border-l-4 border-pink-400">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-gray-800">{item.aspect}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === '专一稳定' ? 'bg-green-100 text-green-700' :
                            item.status === '桃花较旺' ? 'bg-pink-100 text-pink-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{item.advice}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 星座感情 */}
                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">星座参考</span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-400">
                    <div className="font-semibold text-gray-800 mb-2">
                      {result.zodiac} - {result.zodiacPredictions.love.style}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">最佳配对：</span>{result.zodiacPredictions.love.compatibility}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">建议：</span>{result.zodiacPredictions.love.advice}
                    </p>
                  </div>
                </div>
              </div>

              {/* 事业运势 */}
              <div>
                <h3 className="text-xl font-semibold text-indigo-700 mb-4 flex items-center gap-2">
                  <span className="text-2xl">💼</span> 事业运势
                </h3>
                
                {/* 八字事业 */}
                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded">八字分析</span>
                  </div>
                  <div className="space-y-3">
                    {result.predictions.career.map((item, idx) => (
                      <div key={idx} className="bg-indigo-50 rounded-lg p-4 border-l-4 border-indigo-400">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-semibold text-gray-800">{item.category}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            item.potential === '管理潜力' ? 'bg-purple-100 text-purple-700' :
                            item.potential === '稳步上升' ? 'bg-blue-100 text-blue-700' :
                            item.potential === '推荐领域' ? 'bg-green-100 text-green-700' :
                            item.potential === '有利方向' ? 'bg-orange-100 text-orange-700' :
                            'bg-teal-100 text-teal-700'
                          }`}>
                            {item.potential}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 星座事业 */}
                <div>
                  <div className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">星座参考</span>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border-l-4 border-purple-400">
                    <div className="font-semibold text-gray-800 mb-2">
                      {result.zodiac} - 推荐领域
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">适合行业：</span>{result.zodiacPredictions.career.field}
                    </p>
                    <p className="text-sm text-gray-600 mb-2">
                      <span className="font-medium">性格优势：</span>{result.zodiacPredictions.career.trait}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">建议：</span>{result.zodiacPredictions.career.advice}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-6 text-center text-sm text-gray-500">
          <p>* 本程序结合东方八字命理与西方星座学说，预测结果仅供参考学习</p>
          <p className="mt-1">* 命运掌握在自己手中，积极努力才是成功之道</p>
          <p className="mt-1">* 八字与星座可互为参考，综合分析更为全面</p>
        </div>

        {/* 打赏按钮 */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowDonation(true)}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-500 text-white rounded-full font-semibold hover:from-pink-600 hover:to-rose-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Heart className="w-5 h-5" fill="currentColor" />
            觉得有帮助？请作者喝杯咖啡
          </button>
        </div>

        {/* 打赏弹窗 */}
        {showDonation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
              <button
                onClick={() => setShowDonation(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-100 to-rose-100 rounded-full mb-4">
                  <Heart className="w-8 h-8 text-rose-500" fill="currentColor" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">感谢您的支持</h3>
                <p className="text-gray-600 text-sm">您的打赏是我们持续优化的动力</p>
              </div>

              {/* 金额选择 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  选择金额或自定义
                </label>
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {[6, 18, 66, 88].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setDonationAmount(amount.toString())}
                      className={`py-2 rounded-lg font-semibold transition-all ${
                        donationAmount === amount.toString()
                          ? 'bg-rose-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ¥{amount}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="自定义金额（元）"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  min="0.01"
                  step="0.01"
                />
              </div>

              {/* 支付方式 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  支付方式
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setPaymentMethod('wechat')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
                      paymentMethod === 'wechat'
                        ? 'bg-green-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded ${paymentMethod === 'wechat' ? 'bg-white' : 'bg-green-500'}`}>
                      <svg viewBox="0 0 24 24" fill={paymentMethod === 'wechat' ? '#10B981' : 'white'}>
                        <path d="M8.5,2A6.5,6.5,0,0,0,2,8.5c0,3.08,2.13,5.66,5,6.32V21l3.5-3.5H14A6.5,6.5,0,0,0,20.5,11V8.5A6.5,6.5,0,0,0,14,2ZM9,13H7V11H9Zm4,0H11V11h2Zm4,0H15V11h2Z"/>
                      </svg>
                    </div>
                    微信支付
                  </button>
                  <button
                    onClick={() => setPaymentMethod('alipay')}
                    className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition-all ${
                      paymentMethod === 'alipay'
                        ? 'bg-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className={`w-6 h-6 rounded ${paymentMethod === 'alipay' ? 'bg-white' : 'bg-blue-500'}`}>
                      <svg viewBox="0 0 24 24" fill={paymentMethod === 'alipay' ? '#3B82F6' : 'white'}>
                        <path d="M12,2A10,10,0,1,0,22,12,10,10,0,0,0,12,2Zm0,18a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z"/>
                        <path d="M16,11H13V8H11v3H8v2h3v3h2V13h3Z"/>
                      </svg>
                    </div>
                    支付宝
                  </button>
                </div>
              </div>

              {/* 打赏说明 */}
              <div className="bg-amber-50 rounded-lg p-4 mb-6">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <span className="font-semibold">💡 温馨提示：</span>
                  打赏为自愿行为，所有费用将用于服务器维护和功能优化。
                  点击支付后将生成二维码，请使用对应APP扫码完成支付。
                </p>
              </div>

              {/* 支付按钮 */}
              <button
                onClick={handleDonation}
                disabled={!donationAmount || parseFloat(donationAmount) <= 0}
                className="w-full py-3 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-lg font-semibold hover:from-rose-600 hover:to-pink-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <QrCode className="w-5 h-5" />
                生成支付二维码
              </button>

              {/* 其他支持方式 */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-sm text-gray-600 mb-3">其他支持方式</p>
                <div className="flex justify-center gap-4">
                  <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                    分享给朋友
                  </button>
                  <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                    留言建议
                  </button>
                  <button className="text-xs text-gray-500 hover:text-gray-700 transition-colors">
                    关注更新
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BaziCalculator;