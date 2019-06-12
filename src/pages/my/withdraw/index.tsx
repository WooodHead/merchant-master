import React, { Component } from 'react';
import styles from './index.less';
import { Flex, WingBlank, InputItem, Button, Toast } from 'antd-mobile';
import request from '@/services/request';
import Succeed from './succeed';

export default class WithDraw extends Component {
  state = {
    money: '',
    info: {},
    num: '',
    is_ok: false,
    data: {}
  };

  componentWillMount (){
    request({
      url: 'api/merchant/staff/userBankList',
      method: 'post',
    }).then(res => {
      let { data } = res;
      let str = data[0].bank_info;
      let num = str.substring(str.length-4);
      this.setState({ info: data[0], num });
    })
  }

  /**全部提现 */
  allWithDraw = () =>{
    let { info } = this.state;
    let money = info.money;
    this.setState({money})
  }


  handleInputChange = (value: any) =>{
    if(value == ''){
      this.setState({
        money: 0
      })
    }else{
      this.setState({ money: parseFloat(value) })
    }
  };

  /**提现成功的回调 */
  succeedBack = () => {
    this.setState({is_ok: false})
  }

  /**提现 */
  WithDraw = () => {
    let { money } = this.state;
    if (money){
      request({
        url: 'api/merchant/supplier/withdraw',
        method: 'post',
        data: {
          money
        }
      }).then(res => {
        let { message, code } = res;
        if(code == 200){
          Toast.success(message,2);
          let { info, num } = this.state;
          let data = {
            money,
            num,
            bank_name: info.bank_name,
            img: info.bank_img
          }
          this.setState({is_ok: true, data});
        }else(
          Toast.fail(message,2)
        )
      })
    }
  }



  render (){
    const { info, num } = this.state;
    const succeed = this.state.is_ok == true ? (
      <Succeed onChange={this.succeedBack} list={this.state.data}/>
    ) : (
      ''
    )
    return (
      <div style={{width: '100%', height: '100%', background: '#fff'}}>
        <Flex className={styles.top}>{info.withdraw_info}</Flex>
        <WingBlank>
          <Flex className={styles.header}><img src=""/>{info.bank_name}<span>（{num}）</span></Flex>
          <Flex className={styles.title}>提现余额</Flex>
          <Flex className={styles.input_wrap}>
						<span className={styles.symbol}>￥</span>
						<Flex.Item>
							<InputItem type="money" placeholder="" onChange={this.handleInputChange} value={this.state.money}/>
						</Flex.Item>
					</Flex>
          <Flex className={styles.withdraw_sum}>
            可提现金额{info.money}
            <span className={styles.withdraw_all} onClick={this.allWithDraw}>全部提现</span>
          </Flex>
          <Button type="primary" style={{marginTop: 60}} onClick={this.WithDraw}>
						提现
					</Button>
          <Button type="primary" style={{marginTop: 46, background: '#fff', color: '#21418A', fontSize: '26px'}}>
						提现记录
					</Button>
        </WingBlank>
        {succeed}
      </div>
    )
  }
}