const express = require('express');
const wechat = require('wechat');
const app =express();

const config = {
  token: 'weixin',
  appid: 'wxeed4195f75522c32',
  encodingAESKey: "yfiwga83QvDSbZQ0eqOYyGNs7TpkQDO8jpS0uWt9dyr",
  checkSignature: true
}
app.use('/wechat',wechat(config, (req, res, next) => {
  if (req.weixin.Content === '你好') {
    res.reply('你好')
  } else if(req.weixin.Content === '你真帅'){
    res.reply('真有眼光')
  } else {
    res.reply(req.weixin.Content)
  }
}))



app.listen(80)
