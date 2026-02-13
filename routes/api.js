
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

// Controllers
const orderController = require('../controllers/orderController');
const nameController = require('../controllers/nameController');
const paymentController = require('../controllers/paymentController');

// 订单路由
router.post('/orders', authMiddleware, orderController.createOrder);
router.get('/orders', authMiddleware, orderController.getUserOrders);
router.get('/orders/:orderNo', authMiddleware, orderController.getOrderStatus);
router.post('/orders/:orderNo/cancel', authMiddleware, orderController.cancelOrder);

// 姓名分析路由
router.get('/name/result/:orderNo', authMiddleware, nameController.getResult);
router.get('/name/history', authMiddleware, nameController.getHistory);

// 支付路由
router.post('/payment/wechat/callback', paymentController.wechatCallback);
router.post('/payment/alipay/callback', paymentController.alipayCallback);

module.exports = router;