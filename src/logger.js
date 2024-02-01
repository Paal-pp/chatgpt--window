// src/logger.js
export const logger = {
    info(message) {
        console.log(`[Info] ${new Date().toISOString()}: ${message}`);
    },
    error(message) {
        console.error(`[Error] ${new Date().toISOString()}: ${message}`);
    },
    // 可以根据需要添加更多日志级别
};
