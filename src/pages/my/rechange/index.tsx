/**title: 充值 */

import React, { Component } from 'react';
import styles from './index.less';
import { WingBlank, Flex, InputItem, Button, Toast } from 'antd-mobile';
import request from '@/services/request';
import Cookies from 'js-cookie';
declare global {
  interface Window { open_id: string; pay_url: string; Url: string }
}
const Url = window.url ? window.url : 'http://test.api.tdianyi.com/';
const open_id = window.open_id ? window.open_id : 'test_open_id';
export default class Rechange extends Component {

  state = { money: 0 };
  /**input change */
  handleInputChange = (value: any) => this.setState({ money: parseFloat(value) });
  /** recahnge submit value */
  submit = async () => {
<<<<<<< HEAD
    let openId = Cookies.get(open_id)
    // 判断是否授权
    if (openId) {
      Toast.loading('充值中');
      const res = await request({
        url: 'v3/pay/recharge',
        method: 'post',
        data: {
          xcx: 0,
          rechargeMoney: this.state.money,
          open_id: openId
        }
      });

      Toast.hide();

      if (res.code === 200) {
        window.WeixinJSBridge.invoke('getBrandWCPayRequest', res.data, function (res: { err_msg: string }) {
          ``;
          if (res.err_msg == 'get_brand_wcpay_request:ok') {
            // '支付成功'
=======
    console.log(this.state.money)
    console.log(open_id)
    let openId = Cookies.get(open_id)
    //判断是否为零
    if (this.state.money == 0 || this.state.money == null || this.state.money == undefined || isNaN(this.state.money)) {
      Toast.fail('请输入充值金额', 1.5);
    } else {
      // 判断是否授权
      if (openId) {
        console.log('调起充值')
        Toast.loading('充值中');
        const res = await request({
          url: 'v3/pay/recharge',
          method: 'post',
          data: {
            xcx: 0,
            rechargeMoney: this.state.money,
            open_id: openId
>>>>>>> 01589b783c1254fe250f2a95c607d940144c8b93
          }
        });

        Toast.hide();

        if (res.code === 200) {
          window.WeixinJSBridge.invoke('getBrandWCPayRequest', res.data, function (res: { err_msg: string }) {
            ``;
            if (res.err_msg == 'get_brand_wcpay_request:ok') {
              // '支付成功'
              Toast.success('充值成功', 1.5);
            } else {
              Toast.fail('充值失败', 1.5);
            }
          });
        } else {
          Toast.fail('充值失败', 1.5);
        }
      } else {
        console.log('跳到授权')
        console.log('open_id' + openId)
        this.auth()
      }
<<<<<<< HEAD
    }else {
      this.auth()
=======
>>>>>>> 01589b783c1254fe250f2a95c607d940144c8b93
    }
  };

  // 授权
  auth = () => {
    let from = window.location.href;
    let url = Url + 'wechat/wxoauth?code_id=0&from=' + from;
    url = encodeURIComponent(url);
    let urls =
      'http://wxauth.tdianyi.com/index.html?appid=wxecdd282fde9a9dfd&redirect_uri=' +
      url +
      '&response_type=code&scope=snsapi_userinfo&connect_redirect=1&state=STATE&state=STATE';
    return (window.location.href = urls);
  }


  render() {
    return (
      <div className={styles.page}>
        <WingBlank>
          <div className="title">充值金额</div>
          <Flex className="input-wrap">
            <span className="symbol">￥</span>
            <Flex.Item>
              <InputItem type="money" placeholder="" onChange={this.handleInputChange} clear />
            </Flex.Item>
          </Flex>
          <Button type="primary" onClick={this.submit}>
            充值
					</Button>
        </WingBlank>
      </div>
    );
  }
}
