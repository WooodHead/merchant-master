import React, { Component } from 'react'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode';
import styles from './general.less'


interface Props {
  show: boolean,
  close: () => void,
  details: any
}
// 拼团海报
export default class Poster extends Component<any> {
  state = {
    imgurl: '',
    show: false,
    gift: ''
  }

  shouldComponentUpdate(nextProps: Props, nextState: Props) {
    if (nextProps.show !== nextState.show) {
      if (!this.state.show) {
        this.setState({ show: true })
        this.state.imgurl.length < 1 && this.showMyPoster()
      }
    }
    return true
  }
  // total_fee 使用门槛
  // pay_money 购买劵的价格
  // poster_pay_money 活动价
  // poster_max_money 增值最大金额
  showMyPoster = () => {
    let dom = document.getElementById('poster')
    QRCode.toDataURL(this.props.list.link)                  // 网络链接转化为二维码
      .then((url: any) => {
        this.setState({ gift: url }, () => {
          html2canvas(dom, {                                //canvas截图生成图片
            height: dom.offsetHeight,
            width: dom.offsetWidth,
            allowTaint: false,
            useCORS: true,
          }).then((res: any) => {
            let imgurl = res.toDataURL('image/jpeg');
            this.setState({ imgurl })
          })
        })
      })
      .catch((err: any) => { })
  }

  //关闭海报
  closePoster = () => {
    this.props.close()
    this.setState({
      show: false
    })
  }

  noAllow = (e: any) => {
    e.stopPropagation();
  }

  render() {
    const { list } = this.props
    const { gift } = this.state
    const dom = <div className={styles.poster_box} id="poster" onClick={this.closePoster}>
      <img className={styles.title_img} src={require('../../../../../../assets/poster_head2.png')} alt="" />
      <div className={styles.main}>
        <div className={styles.gift_img}>
          {/* <img src={list.shop_door_header_img} alt="" />
           */}
          <img src={list.big_pic} alt=""/>
          {
            list.gift_id ?
              <ul>
                <li>下单即送礼品</li>
                <li >
                  <img src={list.git_img} alt="" />
                  <img className={styles.test} src={require('../../../../../../assets/box_shadow.png')} alt="" />
                  <span className={styles.giving}>赠</span>
                  <span className={styles.price} style={{ color: '#fff' }}>￥
                  {/* {list.pay_money} */}
                    {list.gif_integral}
                  </span>
                </li>
              </ul> : null
          }
        </div>

        <div className={styles.project_info}>
          <ul className={styles.info_left}>
            <li>活动价 ￥<span>{list.active_money}</span></li>
            <li className={styles.group_number}>
              <span >最高可抵{list.max_money}元</span>
            </li>
            <li>
              <div>
                {
                  list.activity_name && list.activity_name.length > 20 ? list.activity_name.slice(0, 24) + '...' : list.activity_name
                }
              </div>
            </li>
            <li>
              <div className={styles.text}>适用店铺：
              {list.name && list.name.length > 11 ? list.name.slice(0, 11) + '...' : list.name}
              </div>
            </li>
            <li>
              <div className={styles.text}> 店铺地址：{list.address && list.address.length > 11 ? list.address.slice(0, 11) + '...' : list.address}
              </div>
            </li>
          </ul>
          <div className={styles.info_right}>
            <img src={gift} alt="" />
            <div>长按查看活动详情</div>
          </div>
        </div>
      </div>
    </div>
    return <main className={styles.poster_main} style={{ display: this.state.show ? '' : 'none' }} onClick={this.closePoster}>
      <div className={styles.hidden_page}>{dom}</div>
      <img
        onClick={this.noAllow.bind(this)} className={styles.my_img} src={this.state.imgurl} alt="" />
      <div className={styles.user_button}>长按保存图片到相册</div>
    </main>
  }
}
