
const Order = require('../models/Order');
const NameResult = require('../models/NameResult');

class OrderController {
  // 创建订单
  async createOrder(req, res) {
    try {
      const { productType, amount, paymentMethod, surname, givenName, birthDate, gender } = req.body;
      const userId = req.user.id; // 从JWT token获取

      // 验证参数
      if (!productType || !amount || !paymentMethod) {
        return res.status(400).json({
          success: false,
          message: '缺少必要参数'
        });
      }

      // 创建订单
      const orderNo = await Order.createOrder({
        userId,
        productType,
        amount,
        paymentMethod,
        surname,
        givenName,
        birthDate,
        gender
      });

      // 获取订单详情
      const order = await Order.findByOrderNo(orderNo);

      res.json({
        success: true,
        data: {
          orderNo: order.order_no,
          amount: order.amount,
          expiresAt: order.expires_at
        }
      });

    } catch (error) {
      console.error('创建订单失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }

  // 查询订单状态
  async getOrderStatus(req, res) {
    try {
      const { orderNo } = req.params;
      const userId = req.user.id;

      const order = await Order.findByOrderNo(orderNo);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: '订单不存在'
        });
      }

      // 验证订单归属
      if (order.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: '无权访问此订单'
        });
      }

      res.json({
        success: true,
        data: {
          orderNo: order.order_no,
          status: order.status,
          amount: order.actual_amount,
          paymentTime: order.payment_time
        }
      });

    } catch (error) {
      console.error('查询订单失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }

  // 获取用户订单列表
  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const { status, page = 1, pageSize = 20 } = req.query;

      const offset = (page - 1) * pageSize;
      const orders = await Order.getUserOrders(userId, status, parseInt(pageSize), offset);
      const total = await Order.count({ user_id: userId });

      res.json({
        success: true,
        data: {
          orders,
          pagination: {
            page: parseInt(page),
            pageSize: parseInt(pageSize),
            total
          }
        }
      });

    } catch (error) {
      console.error('获取订单列表失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }

  // 取消订单
  async cancelOrder(req, res) {
    try {
      const { orderNo } = req.params;
      const userId = req.user.id;

      const success = await Order.cancelOrder(orderNo, userId);

      if (!success) {
        return res.status(400).json({
          success: false,
          message: '订单无法取消'
        });
      }

      res.json({
        success: true,
        message: '订单已取消'
      });

    } catch (error) {
      console.error('取消订单失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }
}

module.exports = new OrderController();