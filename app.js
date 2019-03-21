const express = require('express');
// 引入转换 xml -> json 的 方法
const {xmlToJson, jsonToXml}  = require('./utils/index');

// 引入sha1算法
const sha1 = require('sha1');
const app =express();

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.get('/', (req,res) => {
  res.send('hello world')
});
// 验证 消息是否来自微信服务器0
app.get('/wechat',(req,res) => {
  // console.log('hello world');
  // get的参数
  // console.log(req.query)
  // 1）将token、timestamp、nonce三个参数进行字典序排序(A,B,C)
  let {signature, echostr, timestamp, nonce} = req.query;
  const token = 'weixin';
  // 数组的字典序排序
  let arr = [nonce, token, timestamp].sort();
  // 2）将三个参数字符串拼接成一个字符串进行sha1加密
  let str=  arr.join('');
  // 得到 sha1加密后的字符串
  let newStr = sha1(str);
  // 3）获得加密后的字符串与signature对比，如果配对成功，即为微信发送过来，并把 echostr(随机字符串) 给发送回去，作为验证，如果配对不成功，则发送失败
  if (newStr === signature) {
    console.log('验证成功');
    res.send(echostr);
  } else {
    res.send('失败')
    console.log('失败')
  }
});

// 接受普通消息
app.post('/wechat', (req, res) => {
  // 获取得到发送过来的xml数据
  let buf = '';
  req.on('data', (chunk) => {
    buf += chunk;
  });
  req.on('end', async() => {
    let json = await xmlToJson(buf);
    // 取出给公众号发送消息的用户id，及接受信息的公众号id;
    let ToUserName = json.xml['ToUserName'];
    let FromUserName = json.xml['FromUserName'];
    // 构建自己的xml结构发送给 微信
    let myJson = json;
    myJson.xml.ToUserName = FromUserName;
    myJson.xml.FromUserName = ToUserName;
    let myXml = jsonToXml(myJson);
    res.send(myXml);
  })
})

app.listen(80)
