import React, {Component} from 'react';
import styles from './index.less';
import { Flex, WingBlank, Button } from 'antd-mobile';
import request from '@/services/request';
import router from 'umi/router';
import { connect } from 'dva';
export default connect(({ activity }: any) => activity)(
  class GiftDetails extends Component<any> {
  state = {
    data: {
      title: '',
      cover_image: '',
      postage: '',
      sales: '',
      image_details: [],
      price: '',
      distribution: {
        delivery_type: '',
        delivery_price: '',
        period: '',
        delivery_msg: ''
      }

    }
  };
  componentDidMount (){
    request({
      url: 'api/merchant/integral_detail/'+this.props.location.query.id,
      method: 'get'
    }).then(res => {
      let { data } = res;
      this.setState({data})
    })
  }
  chooseOne = () => {
    let type = this.props.location.query.type;
    const {id, pic, name} = this.props.location.query;
    if(type == '1'){
      console.log(1)
      this.props.dispatch ({
        type: 'activity/setGroup',
        payload: {
          gift_id: id,
          gift_name:name,
          gift_pic: pic
        }
      })
    }else if(type == '2'){
      this.props.dispatch ({
        type: 'activity/setAppreciation',
        payload: {
          gift_id: id,
          gift_name:name,
          gift_pic: pic
        }
      })
    }
    router.push({pathname: '/activitys/choosegift', query: { type: this.props.location.query.type }})
  }

  render (){
    const { data } = this.state;
    const img = data.image_details.map((item,idx)=> {
      return (
        <img src={item} key={idx}/>
      )
    })
    return (
      <div className={styles.details}>
        <img src={data.cover_image} />
        <WingBlank>
          <div>
            <p className={styles.gift_name}>{data.title}</p>
            <p className={styles.gift_price}>{data.price}元</p>
            <Flex justify='between' className={styles.sales}>
              <div>快递：{data.postage}元</div>
              <div>半年销量 {data.sales}</div>
            </Flex>
          </div>
          <Flex className={styles.title} align='end'>
            <div className={styles.gang}>{null}</div>
            商品详情
          </Flex>
          <div className={styles.details_img}>
            {img}
          </div>
          <Flex className={styles.title} align='end'>
            <div className={styles.gang}>{null}</div>
            配送方式
          </Flex>
          <ul>
            <li>快递信息：{data.distribution.delivery_msg}</li>
            <li>快递价格：{data.distribution.delivery_price}元</li>
            <li>发货周期：{data.distribution.delivery_type}</li>
            <li>特别提示：{data.distribution.period}</li>
          </ul>
          <Button type='primary' style={{marginBottom: 60, marginTop: 80}} onClick={this.chooseOne}>确认添加</Button>
        </WingBlank>

      </div>
    )
  }
})
