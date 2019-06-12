import React, { Component } from 'react';
import styles from './index.less';
import { Flex, WingBlank, DatePicker, List, InputItem, Icon, Toast, ImagePicker } from 'antd-mobile';
import upload from '@/services/oss';
import ChooseGift from '../../components/choosegift/';
import Notice from '../../components/notice/';
import PayMent from '../../components/payment'
import moment from 'moment'
import request from '@/services/request'

const nowTimeStamp = Date.now();
const now = new Date(nowTimeStamp);

export default class createGroup extends Component {
  state = {
    start_date: now,
    end_date: now,
    is_gift: false,
    is_show: false,
    is_notice: false,
    is_pay:false,
    /**支付方式 */
    mail_mode: '1',
    /**活动名字 */
    activity_name: '',
    /**原价 */
    old_price: '',
    /**拼团价 */
    participation_money: '',
    /**拼团人数 */
    group_number: '',
    /**团数 */
    group_sum: '',
    /**有效期 */
    validity: '',
    /**图片base64 */
    cover_img: [],
    describe_img1: [],
    describe_img2: [],
    /**图片路径 */
    image: '',
    image_url1: '',
    image_url2: '',
    /**礼品id */
    gift_id: '',
    /**礼品图片 */
    gift_pic: '',
    /**使用须知组件计数用 */
    keys: '100',
    /**使用须知列表 */
    notice_list: [],
    /**跳转支付 */
    pay_list:[]
  };
  startChange = (value: any) => {
    this.setState({start_date: value})
  }
  endChange = (value: any) => {
    this.setState({end_date: value})
  }
  /**选择支付方式 */
  chooseMailMode = (type: string) =>{
  this.setState({mail_mode: type})
  }
  /**改变值 */
  handleName = (e: any) => {
    this.setState({activity_name: e})
  }
  handleOldPrice = (e: any) => {
    this.setState({old_price: e})
  }
  handleNewPrice = (e: any) => {
    this.setState({participation_money: e})
  }
  handleNum = (e: any) => {
    this.setState({group_number: e})
  }
  handleSum = (e: any) => {
    this.setState({group_sum: e})
  }
  handleValidity = (e: any) => {
    this.setState({validity: e})
  }
  /**选择图片 */
  changeCover = ( files: any ) => {
    this.setState({
      cover_img: files
    });
    if(files[0]){
      let img = files[0].url;
      upload(img).then(res => {
        let { data } = res;
        this.setState({image: data.path})
      });
    }else {
      this.setState({image: ''})
    }
  }
  changeDescribe1 = ( files: any ) => {
    this.setState({
      describe_img1: files
    });
    if(files[0]){
      let img = files[0].url;
      upload(img).then(res => {
        let { data } = res;
        this.setState({image_url1: data.path});
      });
    }else {
      this.setState({image_url1: ''})
    }
  }
  changeDescribe2 = ( files: any ) => {
    this.setState({
      describe_img2: files
    });
    if(files[0]){
      let img = files[0].url;
      upload(img).then(res => {
        let { data } = res;
        this.setState({image_url2: data.path});
      });
    }else {
      this.setState({image_url2: ''})
    }
  }

  /**选择礼品的回调 */
  changeGift = (id: string, is_show: boolean, gift_pic: string) =>{
    if(id){
      this.setState({is_gift: true})
    }else{
      this.setState({is_gift: false})
    }
    this.setState({
      gift_id: id,
      is_show,
      gift_pic
    })
  }
  toGift = () => {
    this.setState({
      is_show: true
    })
  }
  toNotice = () => {
    this.setState({
      is_notice: true
    });
  }

  /**使用须知的回调 */
  changeNotice = (notice_list: any, keys: string) => {
    this.setState({
      notice_list,
      keys,
      is_notice: false
    })
  }


  /**确认发布 */
  confirm = () => {
    let { activity_name, start_date, end_date, old_price, participation_money, group_number, group_sum, validity, image, image_url1, image_url2, gift_id, gift_pic, notice_list, mail_mode } = this.state;
    let activity_begin_time = moment(start_date).format('X');
    let activity_end_tine = moment(end_date).format('X');
    let image_url = [];
    image_url.push(image_url1);
    image_url.push(image_url2);
    let description = [];
    if(notice_list){
      for (let i = 0; i < notice_list.length; i ++){
        description.push(notice_list[i].content);
      }
    }

    request({
      url: 'api/merchant/youhui/addYouhuiGroup',
      method: 'post',
      data: {
        name: activity_name,
        activity_begin_time,
        activity_end_tine,
        validity,
        participation_money,
        image_url,
        image,
        group_number,
        group_sum,
        pay_money: old_price,
        description,
        mail_mode,
        gift_id,
        gift_pic
      }
    }).then(res => {

      let {data} = res;
      Toast.success(res.message);
      if (data.order_sn){
        this.setState ({
          pay_list: data,
          is_pay: true
        })
      }
    })

  }


  render (){
    const { cover_img, describe_img1, describe_img2 } = this.state;
    const chooseGift = this.state.is_show == true ? (
      <ChooseGift onChange={this.changeGift} id={this.state.gift_id}/>
    ) : (
      ''
    )
    const chooseMail = this.state.mail_mode == '1' ? (
      <Flex className={styles.choose}>
        <div style={{marginRight: 17}} onClick={this.chooseMailMode.bind(this,'1')}><img src={require('./image/choose.png')}/>联盟店支付</div>
        <div onClick={this.chooseMailMode.bind(this,'2')}><img src={require('./image/no_choose.png')}/>用户支付</div>
      </Flex>
    ) : (
      <Flex className={styles.choose}>
        <div style={{marginRight: 17}} onClick={this.chooseMailMode.bind(this,'1')}><img src={require('./image/no_choose.png')}/>联盟店支付</div>
        <div onClick={this.chooseMailMode.bind(this,'2')}><img src={require('./image/choose.png')}/>用户支付</div>
      </Flex>
    )

    const Gift = this.state.is_gift == true ? (
      <div>
        <Flex className={styles.giftBox}>
          <div>配送方式</div>
          <Flex className={styles.choose}>
            <div style={{marginRight: 17}}><img src={require('./image/choose.png')}/>到店自取</div>
            <div><img src={require('./image/choose.png')}/>邮寄</div>
          </Flex>
        </Flex>
        <Flex className={styles.giftBox}>
          <div>自选地址</div>
          <Flex className={styles.choose}>
            <div style={{marginRight: 17}}><img src={require('./image/choose.png')}/>使用店铺地址</div>
            <div className={styles.address}>自定义</div>
          </Flex>
        </Flex>
        <Flex className={styles.giftBox}>
          <div>选择邮费</div>
          {chooseMail}
        </Flex>
      </div>
    ) : (
      ''
    );
    const notice = this.state.is_notice == true ? (
      <Notice onChange={this.changeNotice} keys={this.state.keys} notice_list={this.state.notice_list}/>
    ) : (
      ''
    )
    const payment = this.state.is_pay == true ? (
      <PayMent  list={this.state.pay_list}/>
    ) : (
      ''
    )

    return (
      <div style={{width: '100%', height: 'auto', minHeight: '100%', background: '#fff'}}>
        <WingBlank>
          <Flex className={styles.title}><div>活动设置</div></Flex>
          <List className={styles.input_Box}>
            <Flex className={styles.pickerDate}>
              <DatePicker
                mode="date"
                title="起始日期"
                extra="Optional"
                value={this.state.start_date}
                onChange={this.startChange}
              >
                <List.Item arrow="horizontal">起始日期</List.Item>
              </DatePicker>
            </Flex>
            <Flex className={styles.pickerDate}>
              <DatePicker
                mode="date"
                title="结束日期"
                extra="Optional"
                value={this.state.end_date}
                onChange={this.endChange}
              >
                <List.Item arrow="horizontal">结束日期</List.Item>
              </DatePicker>
            </Flex>
            <InputItem className={styles.activity_name} placeholder="请输入活动名称" value={this.state.activity_name} onChange={this.handleName}>
              活动名称
            </InputItem>

            <div className={styles.cover_box}>
              <div>活动封面图</div>
              <div className={styles.cover_img}>
                <ImagePicker
                  className={styles.upload_img}
                  files={cover_img}
                  multiple={false}
                  length={1}
                  selectable={cover_img.length < 1}
                  onChange={this.changeCover}
                />
              </div>
            </div>

            <InputItem type={'digit'} className={styles.textShort} value={this.state.old_price} onChange={this.handleOldPrice}>
              原价<span className={styles.right_text}>元</span>
            </InputItem>
            <InputItem type={'digit'} className={styles.textShort} value={this.state.participation_money} onChange={this.handleNewPrice}>
              拼团价<span className={styles.right_text}>元</span>
            </InputItem>
            <InputItem type={'digit'} className={styles.textShort} value={this.state.group_number} onChange={this.handleNum}>
              拼团人数<span className={styles.right_text}>人</span>
            </InputItem>
            <InputItem className={styles.activity_name} placeholder="请输入团数" value={this.state.group_sum} onChange={this.handleSum} type={'digit'}>
              团数
            </InputItem>
            <InputItem type={'digit'} className={styles.textLong} placeholder="发起券日起  " value={this.state.validity} onChange={this.handleValidity}>
              有效期<span className={styles.right_text}>天可用</span>
            </InputItem>
          </List>
          <Flex className={styles.notice} onClick={this.toNotice}><div>使用须知</div><div><Icon type="right"  color='#999' className={styles.icon_right}/></div>
          </Flex>
          <Flex className={styles.img_title}>
            <div>图片详情</div>
          </Flex>

          <Flex className={styles.img_box}>
            <div className={styles.image}>
              <div>
                <ImagePicker
                  className={styles.upload_img}
                  files={describe_img1}
                  multiple={false}
                  length={1}
                  selectable={describe_img1.length < 1}
                  onChange={this.changeDescribe1}
                />
                </div>
              <div className={styles.describe}>图片描述</div>
            </div>
            <div className={styles.image}>
              <div>
                <ImagePicker
                  className={styles.upload_img}
                  files={describe_img2}
                  multiple={false}
                  length={1}
                  selectable={describe_img2.length < 1}
                  onChange={this.changeDescribe2}
                />
              </div>
              <div className={styles.describe}>图片描述</div>
            </div>
          </Flex>

          <div className={styles.gift}>
            <Flex className={styles.title}><div>礼品设置</div></Flex>
            <div className={styles.gift_Box}>
              <Flex className={styles.giftBox}  onClick={this.toGift}><div>选择礼品</div><div><Icon type="right"  color='#999' className={styles.icon_right}/></div>
              </Flex>
              {Gift}
            </div>
          </div>
          <Flex className={styles.read}><img src={require('./image/tip.png')}/>创建必读</Flex>
        </WingBlank>
        <Flex>
          <div className={styles.button} onClick={this.confirm}>确认发布</div>
        </Flex>
        {chooseGift}
        {notice}
        {payment}
      </div>
    )
  }
}