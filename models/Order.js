
const BaseModel = require('./BaseModel');
const db = require('../config/database');

class Order extends BaseModel {
  constructor() {
    super('orders');
  }

  // 通过订单号查询
  async findByOrderNo(orderNo) {
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE order_no = ?',
      [orderNo]
    );
    return rows[0];
  }

  // 获取用户订单列表
  async getUserOrders(userId, status = null, limit = 20, offset = 0) {
    let sql = `
      SELECT 
        id, order_no, product_type, amount, actual_amount,
        payment_method, status, created_at, payment_time
      FROM orders
      WHERE user_id = ?
    `;
    const params = [userId];

    if (status) {
      sql += ' AND status = ?';
      params.push(status);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [rows] = await db.query(sql, params);
    return rows;
  }

  // 创建订单（使用存储过程）
  async createOrder(orderData) {
    const [rows] = await db.query(
      'CALL sp_create_order(?, ?, ?, ?, ?, ?, ?, ?, @order_no)',
      [
        orderData.userId,
        orderData.productType,
        orderData.amount,
        orderData.paymentMethod,
        orderData.surname || null,
        orderData.givenName || null,
        orderData.birthDate || null,
        orderData.gender || null
      ]
    );

    // 获取输出参数
    const [result] = await db.query('SELECT @order_no as orderNo');
    return result[0].orderNo;
  }

  // 支付成功处理
  async markAsPaid(orderNo, transactionId) {
    await db.query(
      'CALL sp_payment_success(?, ?)',
      [orderNo, transactionId]
    );
    return true;
  }

  // 获取待支付订单
  async getPendingOrders(userId) {
    const [rows] = await db.query(`
      SELECT * FROM orders
      WHERE user_id = ? AND status = 'pending' AND expires_at > NOW()
      ORDER BY created_at DESC
    `, [userId]);
    return rows;
  }

  // 取消订单
  async cancelOrder(orderNo, userId) {
    const [result] = await db.query(`
      UPDATE orders
      SET status = 'cancelled'
      WHERE order_no = ? AND user_id = ? AND status = 'pending'
    `, [orderNo, userId]);
    return result.affectedRows > 0;
  }

  // 订单统计
  async getOrderStats(userId) {
    const [rows] = await db.query(`
      SELECT 
        COUNT(*) as totalOrders,
        SUM(CASE WHEN status = 'paid' THEN actual_amount ELSE 0 END) as totalAmount,
        SUM(CASE WHEN status = 'paid' THEN 1 ELSE 0 END) as paidOrders,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingOrders
      FROM orders
      WHERE user_id = ?
    `, [userId]);
    return rows[0];
  }
}

module.exports = new Order();