
const BaseModel = require('./BaseModel');
const db = require('../config/database');

class KangxiDict extends BaseModel {
  constructor() {
    super('kangxi_dict');
  }

  // 获取汉字信息
  async getCharacter(char) {
    const [rows] = await db.query(
      'SELECT * FROM kangxi_dict WHERE character = ?',
      [char]
    );
    return rows[0];
  }

  // 批量获取汉字信息
  async getCharacters(chars) {
    const placeholders = chars.map(() => '?').join(',');
    const [rows] = await db.query(
      `SELECT * FROM kangxi_dict WHERE character IN (${placeholders})`,
      chars
    );
    return rows;
  }

  // 根据五行搜索汉字
  async searchByWuxing(wuxing, limit = 100) {
    const [rows] = await db.query(
      'SELECT * FROM kangxi_dict WHERE wuxing = ? AND is_common = 1 LIMIT ?',
      [wuxing, limit]
    );
    return rows;
  }

  // 根据笔画数搜索
  async searchByStroke(strokeCount, limit = 100) {
    const [rows] = await db.query(
      'SELECT * FROM kangxi_dict WHERE stroke_count = ? AND is_common = 1 LIMIT ?',
      [strokeCount, limit]
    );
    return rows;
  }

  // 全文搜索
  async fullTextSearch(keyword, limit = 50) {
    const [rows] = await db.query(
      'SELECT * FROM kangxi_dict WHERE MATCH(meaning) AGAINST(? IN NATURAL LANGUAGE MODE) LIMIT ?',
      [keyword, limit]
    );
    return rows;
  }
}

module.exports = new KangxiDict();