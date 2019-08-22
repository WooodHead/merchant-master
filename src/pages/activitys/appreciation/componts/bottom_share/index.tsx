import React, { Component } from 'react';
import styles from './index.less'
import request from '@/services/request';
import wx from "weixin-js-sdk";

interface Props {
  showPoster: (show: boolean) => void;
  closeShare: (close: boolean) => void;
  showShare: boolean;
  type?:Object
 }

export default class BottomShare extends Component<Props>{
  state = {
    showShare: false,
    shareButton: false,
    showBottom:true//控制底部用户操作部分
  }


  componentDidMount() {
    
  }

  // 点击取消
  closeShareData = () => {
    this.setState({ showShare: true }) // 控制关闭分享组件
    this.setState({ shareButton: true }) //取消按钮变色
    setTimeout(() => {
      this.props.closeShare(false)
      this.setState({ shareButton: false }) //取消按钮变色
    }, 100);
  }

  // 点击生成海报
  showPosterData = () => {
    this.props.showPoster(true)
  }

  //点击分享
  shareData = () => {
    // 点击分享的时候 遮挡层不能消失 只消失分享 海报 取消部分
    this.setState({ showBottom: false })
    let code :any = this.props.type
    let meta: any = {
      ['增值']: code.id
    }
    
    let userAgent = navigator.userAgent;
    let isIos = userAgent.indexOf('iPhone') > -1;
    let url: any;
    if (isIos) {
      url = sessionStorage.getItem('url');
    } else {
      url = location.href;
    }
    request({
      url: 'wechat/getShareSign',
      method: 'get',
      params: {
        url
      }
    }).then(res => {
      let _this = this;
      wx.config({
        debug: false,
        appId: res.appId,
        timestamp: res.timestamp,
        nonceStr: res.nonceStr,
        signature: res.signature,
        jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
      });
      wx.ready(() => {//需要后台提供文字，多个id 图片
        wx.updateAppMessageShareData({
          title: '伊哲要上天',
          link: 'http://test.mall.tdianyi.com/#/pages/activity/pages/detail/detail?id=3561&type=1&activity_id=1521&gift_id=0',
          imgUrl: '../../icon.png',
          success: function () {
           //成功后触发
          }
        })
      })
    })
  }

  //给一个全局点击的事件
  keep_outOnclick = () => {
    //如果是分享的遮挡层 用户点击遮挡层的时候，遮挡层消失
    if (!this.state.showBottom) {
      this.props.closeShare(false)
      this.setState({ showBottom:true})
    }
  }
  
  

  render() {
    return (
      <div style={{ display: this.props.showShare ? '' : 'none' }} className={styles.keep_out} onClick={this.keep_outOnclick.bind(this)}>
        <img style={{display:!this.state.showBottom? '':'none'}} className={styles.keep_out_img} src={require('../../../../../assets/jiantou.png')}></img>
        <div className={styles.share_box} style={{ display: this.state.showBottom ? '' : 'none' }}>
          <div className={styles.box}>
            <div className={styles.all_center} onClick={this.shareData}>
              <img src={require('../../../../../assets/share.png')} alt="" />
              <div className={styles.text_center}>分享</div>
            </div>
            <div className={styles.all_center} onClick={this.showPosterData}>
              <img src={require('../../../../../assets/posters.png')} alt="" />
              <div className={styles.text_center} >生成海报</div>
            </div>
          </div>
          <div className={styles.cancel} onClick={this.closeShareData} style={{ backgroundColor: this.state.shareButton ? 'rgba(0,0,0,0.05)':''}}>取消</div>
        </div>
      </div>
    )
  }
}
