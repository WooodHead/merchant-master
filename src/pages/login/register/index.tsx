/**
 * title：注册账号
 */
import React, { Component } from 'react';
import { Flex, WingBlank, Button, Toast } from 'antd-mobile';
import styles from './index.less';
import request from '@/services/request';

export default class Register extends Component {
  state = {
    /**账号 */
    username:'',
    /**手机号 */
    phone:'',
    /**密码 */
    password:'',
    /**验证码 */
    code:'',
    /**邀请人手机号 */
    inviter_phone:'',
    /**限制发验证码的次数，每分钟可发一次 */
    is_ok:true,
    /**验证码时间 */
    wait:''
  };
  /**设置账号 */
  handleSetUser = (e: any) => {
    this.setState({username: e.target.value});
  };
  /**设置手机号 */
  handlePhone = (e: any) => {
    this.setState({phone: e.target.value});
  };
  /**设置密码 */
  handlePassword = (e: any) => {
    this.setState({password: e.target.value});
  };
  /**设置验证码 */
  handleCode = (e: any) => {
    this.setState({code: e.target.value});
  };
  /**设置邀请人手机号 */
  handleInviter = (e: any) => {
    this.setState({inviter_phone: e.target.value});
  };
  /**
   * 获取验证码
   */
  getCode = () => {
    const { phone } = this.state;
    let wait = 60;
    if(phone){
      request({
        url: 'v3/verify_code',
        method: 'get',
        params: {
          phone: phone,
        }
      }).then(res => {
        let { code } = res.data;
        if ( code == 200 ){
          let timer = setInterval(time, 1000);
        }
      });
    }

    //定时器执行函数
    let time = () => {
      if( wait == 0){
        this.setState({ is_ok: true })
      }else{
        wait --;
        this.setState({ is_ok: false, wait:wait });
        clearInterval();
      }
    }

  }
  /**
   * 注册
   */
  register = () => {
    const { username, phone, password, code, inviter_phone} = this.state;
    request({
      url: 'v3/register',
      method: 'post',
      data: {
        user_name: username,
        password,
        user_phone: phone,
        verify_code: code,
        invite_phone: inviter_phone
      },
    }).then(res => {
      let {code} = res.data;
      let {data} = res.data;
      if(code == 200){
        Toast.success(data)
      }else{
        Toast.fail(data)
      }
    });
  }

  componentWillUnmount(){
    clearInterval();
  };

  render() {
    const button =
      this.state.is_ok === true ? (
        <div className={styles.sendCode} onClick={this.getCode}>发送验证码</div>
      ) : (
        <div className={styles.doneSend} onClick={this.getCode}>{this.state.wait}秒</div>
      );
    return (
      <div style={{ height: '100%', width: '100%', background:' #fff' }}>
      <WingBlank className={styles.wrap}>
        <Flex className={styles.inputWrap}>
          <input
           style={{ width: '100%' }}
           placeholder="请输入账号名"
           value={this.state.username}
           onChange={this.handleSetUser}
          />
        </Flex>
        <Flex className={styles.inputWrap}>
          <input
            style={{ width: '100%' }}
            placeholder="请输入手机号"
            type='number'
            value={this.state.phone}
            onChange={this.handlePhone}
          />
        </Flex>
        <Flex className={styles.inputWrap}>
          <input
            style={{ width: '100%' }}
            placeholder="请输入不少于6位的密码"
            value={this.state.password}
            onChange={this.handlePassword}
            type='password'
          />
        </Flex>
        <Flex className={styles.inputWrap}>
          <input
            style={{ width: '100%' }}
            placeholder="请输入验证码"
            value={this.state.code}
            onChange={this.handleCode}
          />
          {button}
        </Flex>
        <Flex className={styles.inputWrap}>
          <input
            style={{ width: '100%' }}
            placeholder="请输入邀请人手机号（非必填）"
            value={this.state.inviter_phone}
            onChange={this.handleInviter}
          />
        </Flex>
        <WingBlank size="sm">
          <Button type="primary" style={{ marginTop: 60 }} onClick={this.register}>
            注册账号
          </Button>
        </WingBlank>
        <Flex.Item className={styles.footer}>
        点击“注册”即同意<span style={{ color: '#21418A' }}>《团卖物联服务及隐私条款》</span>
        </Flex.Item>
      </WingBlank>
      </div>
    )
  }
}