const mysql = require('mysql2/promise');

// 创建连接池
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bazi_system',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  // 字符集设置
  charset: 'utf8mb4'
});

// 测试连接
pool.getConnection()
  .then(connection => {
    console.log('✅ MySQL数据库连接成功');
    connection.release();
  })
  .catch(err => {
    console.error('❌ MySQL数据库连接失败:', err);
  });

module.exports = pool;