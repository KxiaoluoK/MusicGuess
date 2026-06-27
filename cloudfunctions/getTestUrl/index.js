// 测试云函数：获取指定 fileId 的临时下载链接
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

exports.main = async (event) => {
  const fileId = event.fileId;
  if (!fileId) return { code: -1, message: '缺少 fileId' };

  try {
    const res = await cloud.getTempFileURL({ fileList: [fileId] });
    const tempUrl = res.fileList[0].tempFileURL;
    if (!tempUrl) {
      return { code: -1, message: 'getTempFileURL 返回空', fileList: res.fileList };
    }
    return { code: 0, tempUrl };
  } catch (err) {
    return { code: -1, message: err.message };
  }
};
