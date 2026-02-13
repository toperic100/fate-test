
const NameResult = require('../models/NameResult');
const Order = require('../models/Order');
const { analyzeName } = require('../services/nameAnalysisService');

class NameController {
  // 获取分析结果
  async getResult(req, res) {
    try {
      const { orderNo } = req.params;
      const userId = req.user.id;

      // 验证订单
      const order = await Order.findByOrderNo(orderNo);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: '订单不存在'
        });
      }

      if (order.user_id !== userId) {
        return res.status(403).json({
          success: false,
          message: '无权访问'
        });
      }

      if (order.status !== 'paid') {
        return res.status(403).json({
          success: false,
          message: '订单未支付'
        });
      }

      // 获取结果
      const result = await NameResult.getByOrderId(order.id, userId);

      if (!result) {
        return res.status(404).json({
          success: false,
          message: '结果不存在或已过期'
        });
      }

      res.json({
        success: true,
        data: result
      });

    } catch (error) {
      console.error('获取结果失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }

  // 保存分析结果（内部使用，支付成功后调用）
  async saveResult(orderId, userId, analysisData) {
    try {
      const resultId = await NameResult.saveResult({
        orderId,
        userId,
        ...analysisData
      });

      return resultId;

    } catch (error) {
      console.error('保存结果失败:', error);
      throw error;
    }
  }

  // 获取用户历史记录
  async getHistory(req, res) {
    try {
      const userId = req.user.id;
      const { limit = 20 } = req.query;

      const results = await NameResult.getUserResults(userId, parseInt(limit));

      res.json({
        success: true,
        data: results
      });

    } catch (error) {
      console.error('获取历史记录失败:', error);
      res.status(500).json({
        success: false,
        message: '服务器错误'
      });
    }
  }
}

module.exports = new NameController();