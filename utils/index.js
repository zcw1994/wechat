const xml2js = require('xml2js');

// 将xml 转换为 json
const  xmlToJson = (xml) => {
  // 用promise 函数将 异步操作装起来,使用 promise中的参数将信息暴露出去
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  })

}

const jsonToXml = (json) => {
  var builder = new xml2js.Builder();
  var xml = builder.buildObject(json);
  return xml;
}

module.exports = {
  xmlToJson,
  jsonToXml
}
