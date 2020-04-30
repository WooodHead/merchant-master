import React, {useState} from 'react'
import styles from './index.less'
import { Flex } from 'antd-mobile'
interface Props {
  item: object;
  onChange: (type:string, id:number)=>any;
}
export default function Item (props: Props){
  const [is_choose, setChoose] = useState(false)

  const choose = (item:any) => {
    if(is_choose){
      setChoose(false)
      props.onChange('delete',item)
    }else {
      setChoose(true)
      props.onChange('add',item)
    }
  }

  return (
    <Flex className={styles.item} justify='between' align='start' onClick={choose.bind(this,{name:22})}>
      <Flex className={styles.item_left}>
        <div className={styles.item_img_box}>
          <div className={styles.item_label}>商品券</div>
          <img src="http://img2.imgtn.bdimg.com/it/u=2725623363,3302302863&fm=26&gp=0.jpg" alt=""/>
        </div>
        <Flex className={styles.item_info} direction='column' align='start' justify='between'>
          <div className={styles.item_name}>很便宜的寿司</div>
          <div>已选249份，剩余51份</div>
          <Flex className={styles.item.name} align='baseline'>
            单价：
            <div className={styles.item_money}>2000</div>
          </Flex>
        </Flex>
      </Flex>
      {
        is_choose ? <img src={require('@/assets/checked.png')} alt='' className={styles.checkout_icon} />
        : <div className={styles.no_checkout_icon}></div>
      }

    </Flex>
  )
}
