const db = require('../config/database');

class BaseModel {
  constructor(table) {
    this.table = table;
  }

  // 查询单条
  async findById(id) {
    const [rows] = await db.query(
      `SELECT * FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  // 查询多条
  async findAll(conditions = {}, limit = 100, offset = 0) {
    let sql = `SELECT * FROM ${this.table}`;
    const params = [];

    if (Object.keys(conditions).length > 0) {
      const where = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');
      sql += ` WHERE ${where}`;
      params.push(...Object.values(conditions));
    }

    sql += ` LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await db.query(sql, params);
    return rows;
  }

  // 创建
  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const [result] = await db.query(
      `INSERT INTO ${this.table} (${keys.join(', ')}) VALUES (${placeholders})`,
      values
    );

    return result.insertId;
  }

  // 更新
  async update(id, data) {
    const sets = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(data), id];

    const [result] = await db.query(
      `UPDATE ${this.table} SET ${sets} WHERE id = ?`,
      values
    );

    return result.affectedRows;
  }

  // 删除
  async delete(id) {
    const [result] = await db.query(
      `DELETE FROM ${this.table} WHERE id = ?`,
      [id]
    );
    return result.affectedRows;
  }

  // 软删除
  async softDelete(id) {
    return this.update(id, { deleted_at: new Date() });
  }

  // 统计
  async count(conditions = {}) {
    let sql = `SELECT COUNT(*) as total FROM ${this.table}`;
    const params = [];

    if (Object.keys(conditions).length > 0) {
      const where = Object.keys(conditions)
        .map(key => `${key} = ?`)
        .join(' AND ');
      sql += ` WHERE ${where}`;
      params.push(...Object.values(conditions));
    }

    const [rows] = await db.query(sql, params);
    return rows[0].total;
  }
}

module.exports = BaseModel;