# 姓名测算功能技术文档

## 目录
1. [功能概述](#功能概述)
2. [理论基础](#理论基础)
3. [核心算法](#核心算法)
4. [评分体系](#评分体系)
5. [数据库设计](#数据库设计)
6. [API接口](#api接口)
7. [优化建议](#优化建议)

---

## 功能概述

### 主要功能
- ✅ 五格数理计算（天格、人格、地格、外格、总格）
- ✅ 姓名汉字五行分析
- ✅ 八字五行匹配度评估
- ✅ 数理吉凶判断
- ✅ 综合评分系统
- ✅ 专业取名建议
- ✅ 可视化评分展示

### 测算流程
```
输入姓名 → 计算笔画 → 五格数理 → 五行分析 → 匹配八字 → 综合评分 → 生成报告
```

---

## 理论基础

### 1. 五格剖象法

**创始人**: 日本熊崎健翁（1920年代），后传入中国并发展

**五格含义**:

```
天格 = 姓氏笔画 + 1（单姓）
      姓氏首字笔画 + 姓氏次字笔画（复姓）

人格 = 姓氏末字笔画 + 名字首字笔画

地格 = 名字各字笔画之和
      若单字名，则为该字笔画 + 1

外格 = 总格 - 人格 + 1

总格 = 姓名所有字的笔画总和
```

**示例**（张伟）:
- 张：11画
- 伟：11画

```
天格 = 11 + 1 = 12
人格 = 11 + 11 = 22
地格 = 11 + 1 = 12
外格 = 23 - 22 + 1 = 2
总格 = 11 + 11 = 22
```

### 2. 八十一数理吉凶

**分类**:
- **大吉数**: 1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 31, 32, 33, 35, 37, 39, 41, 45, 47, 48, 52, 57, 61, 63, 65, 67, 68, 81
- **次吉数**: 40, 42, 43, 50, 51, 53, 55, 58, 71, 73, 75, 77, 78
- **凶数**: 其他数字

**数理含义表**（部分）:
```javascript
const numberMeanings = {
  1: '太极之数，万物开泰，生发无穷，利禄亨通',
  2: '两仪之数，混沌未开，进退保守，志望难达',
  3: '三才之数，天地人和，大事大业，繁荣昌隆',
  5: '五行俱权，循环相生，圆通畅达，福祉无穷',
  6: '六爻之数，发展变化，天赋美德，吉祥安泰',
  7: '七政之数，精悍严谨，天赋之力，吉星高照',
  8: '八卦之数，乾坎艮震，巽离坤兑，无穷无尽',
  11: '旱苗逢雨，枯木逢春，稳健着实，必得人望',
  13: '天赋吉运，能得人望，善用智慧，必获成功',
  15: '福寿拱照，德高望重，雅量厚重，集上集下',
  16: '厚重载德，安富尊荣，财官双美，功成名就',
  17: '权威刚强，突破万难，如能容忍，必获成功',
  18: '有志竟成，内外有运，刻苦经营，必有所成',
  21: '明月中天，万物确立，官运亨通，大博名利',
  23: '旭日东升，壮丽壮观，权威旺盛，功名荣达',
  24: '锦绣前程，须靠自力，多用智谋，能奏大功',
  // ... 更多数理含义
};
```

### 3. 汉字五行属性

**判断方法**:

#### 方法一：字意五行（最准确）
根据汉字的含义判断：
```javascript
金: 金、银、铜、铁、钢、锐、鑫、瑞、钰、铭等
木: 木、林、森、树、松、柏、梓、杰、栋、梅等
水: 水、江、河、湖、海、洋、波、涛、浩、清等
火: 火、炎、焱、烨、煜、明、昊、阳、晓、丽等
土: 土、山、石、岩、峰、坤、培、墨、宇、安等
```

#### 方法二：部首五行
根据汉字偏旁部首判断：
```javascript
金: 钅、刂、刀、斤、戈、匕等
木: 木、艹、竹、禾、米等
水: 氵、冫、水、雨、鱼等
火: 火、灬、日、目、心等
土: 土、山、石、田、厂等
```

#### 方法三：笔画五行（康熙字典）
根据笔画数尾数判断：
```javascript
1、2 → 木
3、4 → 火
5、6 → 土
7、8 → 金
9、0 → 水
```

**优先级**: 字意五行 > 部首五行 > 笔画五行

### 4. 五行生克关系

```
相生: 木→火→土→金→水→木
相克: 木克土、土克水、水克火、火克金、金克木

日主喜用神判断:
- 日主为木: 喜水、木，忌金、土
- 日主为火: 喜木、火，忌水、金
- 日主为土: 喜火、土，忌木、水
- 日主为金: 喜土、金，忌火、木
- 日主为水: 喜金、水，忌土、火
```

---

## 核心算法

### 1. 笔画计算

```javascript
/**
 * 获取汉字康熙字典笔画数
 * 实际应用需要完整的康熙字典数据库
 */
const strokeDatabase = {
  // 常用字笔画数据库
  '一': 1, '二': 2, '三': 3, '四': 5, '五': 4,
  '张': 11, '王': 4, '李': 7, '刘': 15, '陈': 16,
  '伟': 11, '芳': 10, '娜': 10, '敏': 11, '静': 16,
  // ... 完整数据库应包含数万汉字
};

const getStrokeCount = (char) => {
  if (strokeDatabase[char]) {
    return strokeDatabase[char];
  }
  
  // 如果数据库中没有，可以调用第三方API
  // 或使用简化算法（精度较低）
  const code = char.charCodeAt(0);
  return ((code - 0x4E00) % 20) + 1;
};
```

### 2. 五格计算完整实现

```javascript
class NameAnalyzer {
  constructor(surname, givenName) {
    this.surname = surname;
    this.givenName = givenName;
    this.surnameStrokes = this.getStrokes(surname);
    this.givenStrokes = this.getStrokes(givenName);
  }
  
  getStrokes(name) {
    return Array.from(name).map(char => getStrokeCount(char));
  }
  
  // 天格计算
  getTiange() {
    if (this.surnameStrokes.length === 1) {
      // 单姓
      return this.surnameStrokes[0] + 1;
    } else {
      // 复姓
      return this.surnameStrokes[0] + this.surnameStrokes[1];
    }
  }
  
  // 人格计算
  getRenge() {
    const lastSurnameStroke = this.surnameStrokes[this.surnameStrokes.length - 1];
    const firstGivenStroke = this.givenStrokes[0] || 0;
    return lastSurnameStroke + firstGivenStroke;
  }
  
  // 地格计算
  getDige() {
    if (this.givenStrokes.length === 0) {
      return 1; // 单字名特殊情况
    } else if (this.givenStrokes.length === 1) {
      return this.givenStrokes[0] + 1;
    } else {
      return this.givenStrokes.reduce((a, b) => a + b, 0);
    }
  }
  
  // 总格计算
  getZongge() {
    const allStrokes = [...this.surnameStrokes, ...this.givenStrokes];
    return allStrokes.reduce((a, b) => a + b, 0);
  }
  
  // 外格计算
  getWaige() {
    return this.getTiange() + this.getDige() - this.getRenge() + 1;
  }
  
  // 获取完整五格
  getWuge() {
    return {
      tiange: this.getTiange(),
      renge: this.getRenge(),
      dige: this.getDige(),
      waige: this.getWaige(),
      zongge: this.getZongge()
    };
  }
}

// 使用示例
const analyzer = new NameAnalyzer('张', '伟');
const wuge = analyzer.getWuge();
console.log(wuge);
// { tiange: 12, renge: 22, dige: 12, waige: 2, zongge: 22 }
```

### 3. 数理吉凶判断

```javascript
class LuckyNumberSystem {
  // 完整的八十一数理吉凶表
  static luckyTable = {
    // 大吉数（90-100分）
    lucky: [1, 3, 5, 6, 7, 8, 11, 13, 15, 16, 17, 18, 21, 23, 24, 25, 
            29, 31, 32, 33, 35, 37, 39, 41, 45, 47, 48, 52, 57, 61, 
            63, 65, 67, 68, 81],
    
    // 次吉数（70-89分）
    halfLucky: [40, 42, 43, 50, 51, 53, 55, 58, 71, 73, 75, 77, 78],
    
    // 凶数（40-59分）
    unlucky: [2, 4, 9, 10, 12, 14, 19, 20, 22, 26, 27, 28, 30, 34, 36, 
              38, 44, 46, 49, 54, 56, 59, 60, 62, 64, 66, 69, 70, 72, 
              74, 76, 79, 80]
  };
  
  static getNumberLuck(num) {
    // 超过81的数字，需要减去80
    if (num > 81) {
      num = num - 80;
    }
    
    if (this.luckyTable.lucky.includes(num)) {
      return {
        level: '吉',
        score: 90 + Math.floor(Math.random() * 10),
        description: this.getMeaning(num)
      };
    } else if (this.luckyTable.halfLucky.includes(num)) {
      return {
        level: '半吉',
        score: 70 + Math.floor(Math.random() * 19),
        description: this.getMeaning(num)
      };
    } else {
      return {
        level: '凶',
        score: 40 + Math.floor(Math.random() * 19),
        description: this.getMeaning(num)
      };
    }
  }
  
  static getMeaning(num) {
    const meanings = {
      1: '太极之数，万物开泰，生发无穷，利禄亨通',
      2: '两仪之数，混沌未开，进退保守，志望难达',
      // ... 完整的81个数理含义
    };
    return meanings[num] || '平常数理';
  }
}
```

### 4. 五行匹配分析

```javascript
class WuxingMatcher {
  // 五行相生相克关系
  static sheng = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
  };
  
  static ke = {
    '木': '土', '土': '水', '水': '火', '火': '金', '金': '木'
  };
  
  // 判断两个五行的关系
  static getRelation(element1, element2) {
    if (element1 === element2) {
      return { type: '同类', score: 15 };
    }
    if (this.sheng[element1] === element2) {
      return { type: '相生', score: 20 };
    }
    if (this.sheng[element2] === element1) {
      return { type: '被生', score: 18 };
    }
    if (this.ke[element1] === element2) {
      return { type: '相克', score: -10 };
    }
    if (this.ke[element2] === element1) {
      return { type: '被克', score: -8 };
    }
    return { type: '无关', score: 10 };
  }
  
  // 分析姓名五行与八字的匹配度
  static analyzeMatch(nameElements, baziDayMaster, baziLackElements) {
    let totalScore = 50; // 基础分
    const details = [];
    
    // 与日主的关系
    nameElements.forEach(element => {
      const relation = this.getRelation(element, baziDayMaster);
      totalScore += relation.score;
      details.push({
        element,
        relation: relation.type,
        score: relation.score
      });
    });
    
    // 是否补足了缺失的五行
    if (baziLackElements && baziLackElements.length > 0) {
      baziLackElements.forEach(lackElement => {
        if (nameElements.includes(lackElement)) {
          totalScore += 15;
          details.push({
            element: lackElement,
            relation: '补缺',
            score: 15
          });
        }
      });
    }
    
    // 确保分数在0-100之间
    totalScore = Math.max(0, Math.min(100, totalScore));
    
    return {
      score: totalScore,
      details,
      level: totalScore >= 80 ? '优秀' : 
             totalScore >= 60 ? '良好' : '一般'
    };
  }
}
```

---

## 评分体系

### 综合评分计算

```javascript
class NameScoring {
  static calculate(wugeScores, wuxingMatchScore, otherFactors = {}) {
    // 权重分配
    const weights = {
      wuge: 0.6,        // 五格数理 60%
      wuxing: 0.3,      // 五行匹配 30%
      other: 0.1        // 其他因素 10%
    };
    
    // 计算五格平均分
    const wugeAvg = Object.values(wugeScores).reduce((a, b) => a + b, 0) / 5;
    
    // 综合评分
    const finalScore = 
      wugeAvg * weights.wuge +
      wuxingMatchScore * weights.wuxing +
      (otherFactors.pronunciation || 80) * weights.other;
    
    return Math.round(finalScore);
  }
  
  static getRating(score) {
    if (score >= 90) return { level: '极佳', color: 'green', stars: 5 };
    if (score >= 80) return { level: '优秀', color: 'blue', stars: 4 };
    if (score >= 70) return { level: '良好', color: 'yellow', stars: 3 };
    if (score >= 60) return { level: '及格', color: 'orange', stars: 2 };
    return { level: '不佳', color: 'red', stars: 1 };
  }
  
  static generateReport(name, scores) {
    const rating = this.getRating(scores.final);
    
    return {
      name,
      finalScore: scores.final,
      rating: rating.level,
      breakdown: {
        wuge: scores.wuge,
        wuxing: scores.wuxing,
        other: scores.other
      },
      strengths: this.getStrengths(scores),
      weaknesses: this.getWeaknesses(scores),
      suggestions: this.getSuggestions(scores)
    };
  }
}
```

### 评分标准说明

| 分数区间 | 等级 | 说明 |
|---------|------|------|
| 90-100 | 极佳 | 五格吉祥，五行匹配极好，是难得的好名字 |
| 80-89 | 优秀 | 五格较吉，五行匹配良好，是不错的名字 |
| 70-79 | 良好 | 五格尚可，五行基本匹配，可以使用 |
| 60-69 | 及格 | 五格一般，五行匹配度不高，建议改进 |
| 0-59 | 不佳 | 五格或五行存在问题，建议重新取名 |

---

## 数据库设计

### 1. 汉字数据库表

```sql
-- 康熙字典笔画表
CREATE TABLE kangxi_strokes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    character CHAR(1) UNIQUE NOT NULL,
    stroke_count TINYINT NOT NULL,
    radical VARCHAR(10),
    meaning TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_character ON kangxi_strokes(character);

-- 示例数据
INSERT INTO kangxi_strokes (character, stroke_count, radical, meaning) VALUES
('张', 11, '弓', '开弓、展开'),
('伟', 11, '亻', '伟大、宏大'),
('明', 8, '日', '光明、明亮');
```

### 2. 五行属性表

```sql
-- 汉字五行表
CREATE TABLE character_wuxing (
    id INT PRIMARY KEY AUTO_INCREMENT,
    character CHAR(1) UNIQUE NOT NULL,
    wuxing ENUM('木', '火', '土', '金', '水') NOT NULL,
    source ENUM('meaning', 'radical', 'stroke') NOT NULL,
    confidence TINYINT NOT NULL, -- 置信度 1-100
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_char_wuxing ON character_wuxing(character, wuxing);

-- 示例数据
INSERT INTO character_wuxing (character, wuxing, source, confidence) VALUES
('林', '木', 'meaning', 95),
('炎', '火', 'meaning', 95),
('坤', '土', 'meaning', 95),
('钰', '金', 'radical', 90),
('洋', '水', 'radical', 90);
```

### 3. 数理吉凶表

```sql
-- 八十一数理表
CREATE TABLE number_fortune (
    number TINYINT PRIMARY KEY,
    fortune ENUM('吉', '半吉', '凶') NOT NULL,
    score TINYINT NOT NULL,
    meaning TEXT NOT NULL,
    detailed_explanation TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 示例数据
INSERT INTO number_fortune (number, fortune, score, meaning) VALUES
(1, '吉', 95, '太极之数，万物开泰，生发无穷，利禄亨通'),
(2, '凶', 45, '两仪之数，混沌未开，进退保守，志望难达'),
(3, '吉', 92, '三才之数，天地人和，大事大业，繁荣昌隆');
```

### 4. 姓名记录表

```sql
-- 姓名分析记录表
CREATE TABLE name_analysis (
    id INT PRIMARY KEY AUTO_INCREMENT,
    surname VARCHAR(20) NOT NULL,
    given_name VARCHAR(20) NOT NULL,
    birth_date DATE,
    gender ENUM('male', 'female'),
    tiange TINYINT,
    renge TINYINT,
    dige TINYINT,
    waige TINYINT,
    zongge TINYINT,
    wuge_score TINYINT,
    wuxing_score TINYINT,
    final_score TINYINT,
    rating VARCHAR(10),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45)
);

-- 索引
CREATE INDEX idx_created_at ON name_analysis(created_at);
CREATE INDEX idx_final_score ON name_analysis(final_score);
```

---

## API接口

### RESTful API设计

```javascript
// routes/name.js
const express = require('express');
const router = express.Router();
const NameController = require('../controllers/nameController');

/**
 * POST /api/name/analyze
 * 姓名分析接口
 */
router.post('/analyze', NameController.analyze);

/**
 * GET /api/name/suggest
 * 取名建议接口
 */
router.get('/suggest', NameController.suggest);

/**
 * GET /api/name/strokes/:character
 * 查询汉字笔画
 */
router.get('/strokes/:character', NameController.getStrokes);

/**
 * GET /api/name/wuxing/:character
 * 查询汉字五行
 */
router.get('/wuxing/:character', NameController.getWuxing);

module.exports = router;
```

### 控制器实现

```javascript
// controllers/nameController.js
const NameService = require('../services/nameService');

class NameController {
  // 姓名分析
  static async analyze(req, res) {
    try {
      const { surname, givenName, birthDate, gender } = req.body;
      
      // 参数验证
      if (!surname || !givenName) {
        return res.status(400).json({
          success: false,
          message: '姓名不能为空'
        });
      }
      
      // 调用服务层
      const result = await NameService.analyzeName({
        surname,
        givenName,
        birthDate,
        gender
      });
      
      // 保存记录
      await NameService.saveAnalysis(result, req.ip);
      
      res.json({
        success: true,
        data: result
      });
      
    } catch (error) {
      console.error('姓名分析失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }
  
  // 取名建议
  static async suggest(req, res) {
    try {
      const { surname, birthDate, gender, count = 10 } = req.query;
      
      const suggestions = await NameService.generateSuggestions({
        surname,
        birthDate,
        gender,
        count: parseInt(count)
      });
      
      res.json({
        success: true,
        data: suggestions
      });
      
    } catch (error) {
      console.error('生成建议失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }
}

module.exports = NameController;
```

---

## 优化建议

### 1. 数据完善

**康熙字典数据库**:
```javascript
// 从权威来源导入完整数据
// 推荐数据源：
// - 新华字典API
// - 康熙字典在线数据库
// - Unicode汉字数据库

const importKangxiData = async () => {
  const fs = require('fs');
  const data = JSON.parse(fs.readFileSync('kangxi.json'));
  
  for (const item of data) {
    await db.query(
      'INSERT INTO kangxi_strokes (character, stroke_count) VALUES (?, ?)',
      [item.char, item.strokes]
    );
  }
};
```

### 2. 智能取名算法

```javascript
class SmartNameGenerator {
  /**
   * 基于八字智能生成名字建议
   */
  static async generate(surname, bazi, gender, preferences = {}) {
    // 1. 分析八字喜用神
    const xiyongshen = this.analyzeXiyongshen(bazi);
    
    // 2. 确定需要的五行
    const neededWuxing = xiyongshen.xi;
    
    // 3. 从数据库筛选合适的字
    const candidates = await this.findCandidateChars({
      wuxing: neededWuxing,
      gender,
      strokeRange: preferences.strokeRange,
      avoidChars: preferences.avoid
    });
    
    // 4. 组合名字并评分
    const combinations = this.generateCombinations(surname, candidates);
    
    // 5. 按评分排序
    const scored = await Promise.all(
      combinations.map(async name => ({
        name,
        score: await this.scoreName(name, bazi)
      }))
    );
    
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  }
  
  static analyzeXiyongshen(bazi) {
    // 复杂的喜用神分析算法
    // 需要考虑：日主强弱、季节、格局等
    // ...
  }
}
```

### 3. 机器学习优化

```python
# 使用机器学习预测名字评分
import pandas as pd
from sklearn.ensemble import RandomForestRegressor

class NameMLModel:
    def __init__(self):
        self.model = RandomForestRegressor()
    
    def train(self, historical_data):
        """
        使用历史数据训练模型
        特征：笔画数、五行、音韵等
        标签：用户满意度、实际使用情况
        """
        X = historical_data[['tiange', 'renge', 'dige', 
                            'wuxing_match', 'pronunciation']]
        y = historical_data['user_rating']
        
        self.model.fit(X, y)
    
    def predict_score(self, name_features):
        """预测名字评分"""
        return self.model.predict([name_features])[0]
```

### 4. 性能优化

```javascript
// 使用Redis缓存常用查询
const redis = require('redis');
const client = redis.createClient();

class CacheService {
  static async getStroke(char) {
    const cacheKey = `stroke:${char}`;
    
    // 先查缓存
    let stroke = await client.get(cacheKey);
    
    if (!stroke) {
      // 缓存未命中，查数据库
      stroke = await db.query(
        'SELECT stroke_count FROM kangxi_strokes WHERE character = ?',
        [char]
      );
      
      // 存入缓存，过期时间1天
      await client.setex(cacheKey, 86400, stroke);
    }
    
    return parseInt(stroke);
  }
}
```

### 5. 用户体验优化

```javascript
// 实时预览功能
const NamePreview = ({ surname, givenName }) => {
  const [preview, setPreview] = useState(null);
  
  // 防抖处理
  useEffect(() => {
    const timer = setTimeout(() => {
      if (surname && givenName) {
        quickAnalyze(surname, givenName).then(setPreview);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [surname, givenName]);
  
  return (
    <div>
      {preview && (
        <div className="preview">
          <div className="score-badge">{preview.score}分</div>
          <div className="quick-info">
            <span>五格: {preview.wuge}</span>
            <span>五行: {preview.wuxing}</span>
          </div>
        </div>
      )}
    </div>
  );
};

// 快速分析（简化版，只计算核心指标）
const quickAnalyze = async (surname, givenName) => {
  const wuge = calculateWuge(surname, givenName);
  const score = estimateScore(wuge);
  return { score, wuge: wuge.zongge };
};
```

### 6. 音韵分析

```javascript
class PhoneticAnalysis {
  // 声母
  static shengmu = {
    'b': '唇音', 'p': '唇音', 'm': '唇音', 'f': '唇音',
    'd': '舌音', 't': '舌音', 'n': '舌音', 'l': '舌音',
    'g': '牙音', 'k': '牙音', 'h': '牙音',
    'j': '齿音', 'q': '齿音', 'x': '齿音',
    'z': '舌尖音', 'c': '舌尖音', 's': '舌尖音',
    'zh': '翘舌音', 'ch': '翘舌音', 'sh': '翘舌音', 'r': '翘舌音'
  };
  
  // 韵母
  static yunmu = {
    'a': '开口呼', 'o': '开口呼', 'e': '开口呼',
    'i': '齐齿呼', 'u': '合口呼', 'ü': '撮口呼'
  };
  
  // 声调
  static shengdiao = ['阴平', '阳平', '上声', '去声'];
  
  /**
   * 分析姓名音韵是否和谐
   */
  static analyze(fullName) {
    const pinyins = this.getPinyin(fullName);
    const scores = {
      rhythm: 0,      // 韵律
      tone: 0,        // 声调
      homophone: 0    // 谐音
    };
    
    // 1. 检查声调搭配
    scores.tone = this.checkTonePattern(pinyins);
    
    // 2. 检查韵律
    scores.rhythm = this.checkRhythm(pinyins);
    
    // 3. 检查不良谐音
    scores.homophone = this.checkHomophone(fullName);
    
    const total = (scores.rhythm + scores.tone + scores.homophone) / 3;
    
    return {
      score: total,
      details: scores,
      suggestions: this.getSuggestions(scores)
    };
  }
  
  static checkTonePattern(pinyins) {
    // 推荐：平仄相间
    // 避免：全平或全仄
    const tones = pinyins.map(p => p.tone);
    
    if (tones.every(t => t === 1 || t === 2)) return 50; // 全平
    if (tones.every(t => t === 3 || t === 4)) return 50; // 全仄
    
    // 平仄相间得分高
    let alternating = 0;
    for (let i = 1; i < tones.length; i++) {
      const prev = (tones[i-1] === 1 || tones[i-1] === 2) ? 'ping' : 'ze';
      const curr = (tones[i] === 1 || tones[i] === 2) ? 'ping' : 'ze';
      if (prev !== curr) alternating++;
    }
    
    return 60 + (alternating / (tones.length - 1)) * 40;
  }
  
  static checkHomophone(fullName) {
    // 检查是否有不良谐音
    const badHomophones = [
      '死', '丧', '病', '穷', '贱', '鬼', '妖',
      '杀', '绝', '败', '亡', '衰', '损'
    ];
    
    // 使用拼音相似度算法检测
    // ...
    
    return 80; // 简化返回
  }
}
```

---

## 高级功能扩展

### 1. 起名大师模式

```javascript
class MasterNamingSystem {
  /**
   * 综合考虑所有因素的专业起名
   */
  static async masterName(params) {
    const {
      surname,
      bazi,
      gender,
      preferences = {}
    } = params;
    
    // 1. 八字分析
    const baziAnalysis = await BaziAnalyzer.deepAnalysis(bazi);
    
    // 2. 确定喜用神
    const xiyongshen = baziAnalysis.xiyongshen;
    
    // 3. 生成候选字库
    const charPool = await this.buildCharPool({
      xiyongshen,
      gender,
      generation: preferences.generation, // 辈分用字
      avoid: preferences.avoid
    });
    
    // 4. 智能组合
    const combinations = this.smartCombine(surname, charPool, {
      maxCombinations: 1000,
      minScore: 80
    });
    
    // 5. 多维度评分
    const evaluated = await Promise.all(
      combinations.map(async name => {
        const scores = await this.comprehensiveScore(name, bazi);
        return { name, ...scores };
      })
    );
    
    // 6. 排序和筛选
    return evaluated
      .filter(n => n.total >= 85)
      .sort((a, b) => b.total - a.total)
      .slice(0, 30);
  }
  
  static async comprehensiveScore(name, bazi) {
    const scores = {};
    
    // 五格数理 (30%)
    scores.wuge = await WugeScorer.score(name);
    
    // 五行匹配 (25%)
    scores.wuxing = await WuxingMatcher.score(name, bazi);
    
    // 音韵和谐 (15%)
    scores.phonetic = await PhoneticAnalysis.score(name);
    
    // 字义内涵 (15%)
    scores.meaning = await MeaningAnalyzer.score(name);
    
    // 文化内涵 (10%)
    scores.culture = await CultureAnalyzer.score(name);
    
    // 现代适用 (5%)
    scores.modern = await ModernAnalyzer.score(name);
    
    // 计算总分
    scores.total = 
      scores.wuge * 0.30 +
      scores.wuxing * 0.25 +
      scores.phonetic * 0.15 +
      scores.meaning * 0.15 +
      scores.culture * 0.10 +
      scores.modern * 0.05;
    
    return scores;
  }
}
```

### 2. 字义分析系统

```javascript
class MeaningAnalyzer {
  static dictionary = {
    '伟': {
      meaning: '伟大、宏大',
      connotation: '志向远大、成就非凡',
      category: '褒义',
      score: 90
    },
    '杰': {
      meaning: '杰出、出众',
      connotation: '才华横溢、卓尔不群',
      category: '褒义',
      score: 92
    },
    '娜': {
      meaning: '婀娜、柔美',
      connotation: '姿态优美、女性特质',
      category: '褒义',
      score: 88
    }
    // ... 更多字义数据
  };
  
  static async score(fullName) {
    const chars = Array.from(fullName);
    let totalScore = 0;
    const details = [];
    
    for (const char of chars) {
      const info = this.dictionary[char] || {
        meaning: '待查',
        score: 70
      };
      
      totalScore += info.score;
      details.push({ char, ...info });
    }
    
    return {
      score: totalScore / chars.length,
      details,
      summary: this.generateSummary(details)
    };
  }
  
  static generateSummary(details) {
    const meanings = details.map(d => d.meaning).join('、');
    const connotations = details.map(d => d.connotation).join('，');
    
    return `字义：${meanings}。寓意：${connotations}。`;
  }
}
```

### 3. 文化内涵分析

```javascript
class CultureAnalyzer {
  static sources = {
    classics: {
      '诗经': '中国最早的诗歌总集',
      '楚辞': '浪漫主义诗歌',
      '论语': '儒家经典',
      '道德经': '道家经典'
    },
    idioms: {
      '明': ['光明磊落', '明察秋毫'],
      '志': ['志在四方', '壮志凌云'],
      '清': ['清风明月', '一清二白']
    }
  };
  
  static async score(fullName) {
    const chars = Array.from(fullName);
    let culturalDepth = 0;
    const references = [];
    
    // 检查是否来自经典
    for (const char of chars) {
      const found = this.findInClassics(char);
      if (found.length > 0) {
        culturalDepth += 15;
        references.push(...found);
      }
      
      // 检查成语
      const idioms = this.sources.idioms[char] || [];
      if (idioms.length > 0) {
        culturalDepth += 10;
        references.push(...idioms.map(i => ({ type: '成语', content: i })));
      }
    }
    
    return {
      score: Math.min(100, 60 + culturalDepth),
      references,
      summary: this.generateCulturalSummary(references)
    };
  }
}
```

### 4. 现代适用性分析

```javascript
class ModernAnalyzer {
  static popularityData = {
    // 2020-2024年常用字统计
    '涵': { frequency: 'high', trend: 'rising' },
    '轩': { frequency: 'high', trend: 'stable' },
    '梓': { frequency: 'very_high', trend: 'peaked' }
  };
  
  static async score(fullName) {
    const chars = Array.from(fullName);
    const factors = {};
    
    // 1. 重名率检查
    factors.uniqueness = await this.checkUniqueness(fullName);
    
    // 2. 书写难度
    factors.writability = this.checkWritability(chars);
    
    // 3. 电脑输入便利性
    factors.inputEase = this.checkInputEase(chars);
    
    // 4. 国际化友好度
    factors.international = this.checkInternational(chars);
    
    // 5. 时代感
    factors.modernity = this.checkModernity(chars);
    
    const total = Object.values(factors).reduce((a, b) => a + b, 0) / 5;
    
    return {
      score: total,
      factors,
      suggestions: this.modernSuggestions(factors)
    };
  }
  
  static checkUniqueness(fullName) {
    // 调用姓名数据库API查询重名率
    // 重名率越低，得分越高
    // ...
    return 75;
  }
  
  static checkWritability(chars) {
    // 检查笔画是否过多、结构是否复杂
    const avgStroke = chars.reduce((sum, char) => 
      sum + getStrokeCount(char), 0) / chars.length;
    
    if (avgStroke > 20) return 50;  // 过于复杂
    if (avgStroke > 15) return 70;
    return 90; // 适中易写
  }
}
```

---

## 实战案例

### 案例1: 完整的姓名分析

```javascript
// 输入
const input = {
  surname: '李',
  givenName: '明泽',
  birthDate: '2024-01-15',
  birthTime: '08:30',
  gender: 'male'
};

// 执行分析
const analysis = await NameAnalyzer.fullAnalysis(input);

// 输出结果
{
  fullName: '李明泽',
  
  // 基本信息
  basic: {
    totalStrokes: 28,
    surname: { char: '李', strokes: 7 },
    given: [
      { char: '明', strokes: 8 },
      { char: '泽', strokes: 13 }
    ]
  },
  
  // 五格数理
  wuge: {
    tiange: { value: 8, luck: '吉', score: 88 },
    renge: { value: 15, luck: '吉', score: 95 },
    dige: { value: 21, luck: '吉', score: 96 },
    waige: { value: 14, luck: '凶', score: 55 },
    zongge: { value: 28, luck: '凶', score: 58 }
  },
  
  // 五行分析
  wuxing: {
    chars: [
      { char: '李', element: '木' },
      { char: '明', element: '火' },
      { char: '泽', element: '水' }
    ],
    distribution: { 木: 1, 火: 1, 水: 1, 金: 0, 土: 0 },
    matchScore: 78,
    relation: '木生火，但火水相克，需注意平衡'
  },
  
  // 八字匹配
  baziMatch: {
    dayMaster: '甲木',
    xiYong: '水木',
    matchScore: 85,
    analysis: '明属火，泽属水，水生木，对日主有利'
  },
  
  // 音韵分析
  phonetic: {
    pinyin: ['lǐ', 'míng', 'zé'],
    tones: [3, 2, 2],
    rhythm: '仄平平',
    score: 82,
    evaluation: '声调较为和谐，读音顺口'
  },
  
  // 字义分析
  meaning: {
    chars: [
      { char: '明', meaning: '光明、明亮', connotation: '聪明睿智' },
      { char: '泽', meaning: '恩泽、润泽', connotation: '德泽深厚' }
    ],
    overall: '寓意光明磊落，恩泽四方',
    score: 92
  },
  
  // 综合评分
  finalScore: 83,
  rating: '优秀',
  
  // 优缺点
  strengths: [
    '人格、地格数理大吉',
    '五行配置较好',
    '字义美好',
    '读音顺口'
  ],
  weaknesses: [
    '外格、总格数理不佳',
    '五行缺金土'
  ],
  
  // 建议
  suggestions: [
    '整体来说是个不错的名字',
    '建议平时佩戴金属饰品以补金',
    '可多接触土属性事物以补土'
  ]
}
```

### 案例2: 批量取名建议

```javascript
// 输入
const request = {
  surname: '王',
  bazi: {
    year: { gan: '甲', zhi: '子' },
    month: { gan: '丙', zhi: '寅' },
    day: { gan: '戊', zhi: '午' },
    hour: { gan: '壬', zhi: '戌' }
  },
  gender: 'female',
  count: 10,
  preferences: {
    avoidChars: ['花', '草'], // 不喜欢的字
    preferElements: ['金', '水'], // 偏好的五行
    generation: '雨' // 辈分字
  }
};

// 生成建议
const suggestions = await MasterNamingSystem.generateSuggestions(request);

// 输出结果
[
  {
    name: '王雨欣',
    score: 92,
    wuge: { tiange: 5, renge: 12, dige: 16, waige: 9, zongge: 20 },
    wuxing: ['土', '水', '木'],
    reason: '五格吉祥，五行补水，欣字寓意快乐'
  },
  {
    name: '王雨晨',
    score: 90,
    wuge: { tiange: 5, renge: 12, dige: 19, waige: 12, zongge: 23 },
    wuxing: ['土', '水', '金'],
    reason: '总格大吉，五行金水相生，晨字朝气蓬勃'
  },
  // ... 更多建议
]
```

---

## 测试方案

### 单元测试

```javascript
// tests/name.test.js
const { expect } = require('chai');
const NameAnalyzer = require('../src/nameAnalyzer');

describe('姓名分析测试', () => {
  
  describe('笔画计算', () => {
    it('应该正确计算单字笔画', () => {
      expect(getStrokeCount('张')).to.equal(11);
      expect(getStrokeCount('伟')).to.equal(11);
    });
  });
  
  describe('五格计算', () => {
    it('应该正确计算五格数理', () => {
      const wuge = calculateWuge('张', '伟');
      expect(wuge.tiange).to.equal(12);
      expect(wuge.renge).to.equal(22);
      expect(wuge.dige).to.equal(12);
      expect(wuge.zongge).to.equal(22);
    });
  });
  
  describe('五行判断', () => {
    it('应该正确判断汉字五行', () => {
      expect(getCharWuxing('林')).to.equal('木');
      expect(getCharWuxing('炎')).to.equal('火');
      expect(getCharWuxing('泽')).to.equal('水');
    });
  });
  
  describe('吉凶判断', () => {
    it('应该正确判断数理吉凶', () => {
      expect(getNumberLuck(1).level).to.equal('吉');
      expect(getNumberLuck(2).level).to.equal('凶');
      expect(getNumberLuck(15).level).to.equal('吉');
    });
  });
  
  describe('综合评分', () => {
    it('评分应该在0-100之间', () => {
      const score = calculateScore('张', '伟');
      expect(score).to.be.at.least(0);
      expect(score).to.be.at.most(100);
    });
  });
});
```

### 性能测试

```javascript
// tests/performance.test.js
const { performance } = require('perf_hooks');

describe('性能测试', () => {
  it('单次分析应该在100ms内完成', async () => {
    const start = performance.now();
    await NameAnalyzer.analyze('李', '明');
    const end = performance.now();
    
    expect(end - start).to.be.lessThan(100);
  });
  
  it('批量生成100个名字应该在5秒内完成', async () => {
    const start = performance.now();
    await NameGenerator.generate('王', { count: 100 });
    const end = performance.now();
    
    expect(end - start).to.be.lessThan(5000);
  });
});
```

---

## 部署和监控

### Docker部署

```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# 导入康熙字典数据
RUN node scripts/importData.js

EXPOSE 3000

CMD ["node", "server.js"]
```

### 监控指标

```javascript
// 监控关键指标
const metrics = {
  // 业务指标
  totalAnalysis: 0,        // 总分析次数
  avgScore: 0,             // 平均得分
  popularNames: [],        // 热门名字
  
  // 性能指标
  avgResponseTime: 0,      // 平均响应时间
  cacheHitRate: 0,         // 缓存命中率
  dbQueryTime: 0,          // 数据库查询时间
  
  // 错误监控
  errorRate: 0,            // 错误率
  timeoutCount: 0          // 超时次数
};

// 使用Prometheus收集指标
const prometheus = require('prom-client');
const counter = new prometheus.Counter({
  name: 'name_analysis_total',
  help: '姓名分析总次数'
});
```

---

## 总结

姓名测算系统是一个综合性的应用，涉及：

1. **传统文化**: 五格剖象法、八十一数理、五行学说
2. **数据处理**: 康熙字典、五行数据库、音韵数据
3. **算法设计**: 评分系统、匹配算法、推荐算法
4. **现代技术**: API设计、数据库优化、缓存策略
5. **用户体验**: 可视化展示、实时反馈、智能建议

关键成功因素：
- ✅ 准确的基础数据（康熙字典笔画）
- ✅ 科学的评分体系
- ✅ 良好的用户体验
- ✅ 持续的功能优化

未来发展方向：
- 🔮 AI智能起名
- 🔮 大数据分析流行趋势
- 🔮 个性化推荐算法
- 🔮 多语言国际化支持

希望这份文档能帮助你深入理解姓名测算系统的实现原理！
