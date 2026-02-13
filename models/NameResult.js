const BaseModel = require('./BaseModel');
const db = require('../config/database');

class NameResult extends BaseModel {
  constructor() {
    super('name_results');
  }

  // 保存姓名分析结果
  async saveResult(resultData) {
    const {
      orderId, userId, fullName, surname, givenName, birthDate,
      tianGe, renGe, diGe, waiGe, zongGe,
      tianGeLuck, renGeLuck, diGeLuck, waiGeLuck, zongGeLuck,
      nameWuxing, wuxingCount,
      wugeScore, wuxingScore, finalScore, rating,
      analysisDetail, suggestions
    } = resultData;

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7天有效期

    const [result] = await db.query(`
      INSERT INTO name_results (
        order_id, user_id, full_name, surname, given_name, birth_date,
        tian_ge, ren_ge, di_ge, wai_ge, zong_ge,
        tian_ge_luck, ren_ge_luck, di_ge_luck, wai_ge_luck, zong_ge_luck,
        name_wuxing, wuxing_count,
        wuge_score, wuxing_score, final_score, rating,
        analysis_detail, suggestions, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      orderId, userId, fullName, surname, givenName, birthDate,
      tianGe, renGe, diGe, waiGe, zongGe,
      tianGeLuck, renGeLuck, diGeLuck, waiGeLuck, zongGeLuck,
      JSON.stringify(nameWuxing), JSON.stringify(wuxingCount),
      wugeScore, wuxingScore, finalScore, rating,
      JSON.stringify(analysisDetail), suggestions, expiresAt
    ]);

    return result.insertId;
  }

  // 通过订单ID获取结果
  async getByOrderId(orderId, userId) {
    const [rows] = await db.query(`
      SELECT * FROM name_results
      WHERE order_id = ? AND user_id = ? AND expires_at > NOW()
    `, [orderId, userId]);

    if (rows.length === 0) return null;

    const result = rows[0];
    // 解析JSON字段
    result.nameWuxing = JSON.parse(result.name_wuxing);
    result.wuxingCount = JSON.parse(result.wuxing_count);
    result.analysisDetail = JSON.parse(result.analysis_detail);

    return result;
  }

  // 获取用户的所有分析记录
  async getUserResults(userId, limit = 20) {
    const [rows] = await db.query(`
      SELECT 
        id, full_name, final_score, rating, created_at, expires_at
      FROM name_results
      WHERE user_id = ? AND expires_at > NOW()
      ORDER BY created_at DESC
      LIMIT ?
    `, [userId, limit]);
    return rows;
  }

  // 更新PDF URL
  async updatePdfUrl(id, pdfUrl) {
    await db.query(`
      UPDATE name_results
      SET pdf_url = ?, pdf_generated_at = NOW()
      WHERE id = ?
    `, [pdfUrl, id]);
  }

  // 检查是否有重复姓名分析
  async checkDuplicate(userId, surname, givenName, days = 7) {
    const [rows] = await db.query(`
      SELECT id, final_score, created_at
      FROM name_results
      WHERE user_id = ? AND surname = ? AND given_name = ?
        AND created_at >= DATE_SUB(NOW(), INTERVAL ? DAY)
      ORDER BY created_at DESC
      LIMIT 1
    `, [userId, surname, givenName, days]);
    return rows[0];
  }
}

module.exports = new NameResult();