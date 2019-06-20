/**
 * 提交资质
 */
import React, { Component } from 'react';
import styles from './index.less';
import { WingBlank, Flex, ImagePicker, List, InputItem, Icon, ActivityIndicator, Toast } from 'antd-mobile';
import router from 'umi/router';
import upload from '@/services/oss';
import request from '@/services/request';
import ChooseDate from './couponents/chooseDate/chooseDate';
import moment from 'moment';

export default class submitQua extends Component {
  state = {
    /**身份证识别中 */
    animating_id: false,
    /**身份证反面照 */
    id_back: [],
    /**身份证正面照 */
    id_front: [],
    /**手持身份证照 */
    id_hand: [],
    /**有效期 */
    date: '2019-09-22',
    /**银行卡正面照 */
    bank_front: [],
    /**银行卡反面照 */
    bank_back: [],
    /**营业执照 */
    license_img: [],
    /**法人身份证正面照 */
    legal_id_front_img: '',
    /**法人身份证反面照 */
    legal_id_back_img: '',
    /**营业执照 */
    three_certs_in_one_img: '',
    /**手持身份证照 */
    hand_hold_id_img: '',
    /**银行卡正面照 */
    bank_card_front_img: '',
    /**银行卡反面照 */
    bank_card_back_img: '',
    /**姓名 */
    contact_name: '',
    /**身份证号 */
    legal_id_no: '',
    /**银行卡号 */
    settle_bank_account_no: '',
    /**银行名 */
    settle_bank: '招商银行',
    /**银行支行 */
    bank_name: '',
    /**开户人 */
    settle_bank_account_name: '',
    /**营业执照号 */
    three_certs_in_one_no: '',
    /**执照名称 */
    corn_bus_name: '',
    /**法人 */
    legal_name: '',
    /**营业执照有效期 */
    three_certs_in_one_valid_date: '',
    /**选择有效期子组件判断是为身份证还是营业执照 */
    type: 1,
    /**控制子组件的显示和隐藏 */
    is_show: false,
    /**传入组件的日期 */
    choose_date: '',
    /**用于二次进入该页面判断之前是否有图片 */
    is_id_front: false,
    is_id_back: false,
    is_id_hand: false,
    is_bank_front: false,
    is_bank_back: false,
    is_license: false
  };

  componentDidMount(){
    function getCaption(str: string){
      return str.split('http://oss.tdianyi.com/')[1]
    }
    request({
      url: 'v3/payment_profiles',
      method: 'get'
    }).then(res => {
      let {data} = res;
      let {contact_name, legal_id_no, legal_id_valid_date, settle_bank_account_name, settle_bank_account_no, settle_bank, three_certs_in_one_no, corn_bus_name, legal_name, three_certs_in_one_valid_date, bank_name, legal_id_front_img, legal_id_back_img, hand_hold_id_img, bank_card_front_img, bank_card_back_img, three_certs_in_one_img} = data;
      if(three_certs_in_one_valid_date[0] == 0){
        three_certs_in_one_valid_date = '长期'
      }
      if(legal_id_front_img){
        this.setState({is_id_front: true})
      }
      if(legal_id_back_img){
        this.setState({is_id_back: true})
      }
      if(hand_hold_id_img){
        this.setState({is_id_hand: true})
      }
      if(bank_card_front_img){
        this.setState({is_bank_front: true})
      }
      if(bank_card_back_img){
        this.setState({is_bank_back: true})
      }
      if(three_certs_in_one_img){
        this.setState({is_license: true})
      }
      this.setState({
        contact_name,
        legal_id_no,
        date: legal_id_valid_date,
        settle_bank_account_name,
        settle_bank_account_no,
        settle_bank,
        three_certs_in_one_no,
        corn_bus_name,
        legal_name,
        three_certs_in_one_valid_date,
        bank_name,
        legal_id_front_img: getCaption(legal_id_front_img),
        legal_id_back_img: getCaption(legal_id_back_img),
        hand_hold_id_img: getCaption(hand_hold_id_img),
        bank_card_front_img: getCaption(bank_card_front_img),
        bank_card_back_img: getCaption(bank_card_back_img),
        three_certs_in_one_img: getCaption(three_certs_in_one_img)
      });

    })




  }



  /**查看身份证示例 */
  toIdCardExample = () => {
    router.push('/submitQua/example/idcard')
  }
  /**查看银行卡示例 */
  toBankExample = () => {
    router.push('/submitQua/example/bank')
  }
  /**查看营业执照示例 */
  toLicenseExample = () => {
    router.push('/submitQua/example/license')
  }

  /**姓名输入 */
  handleName = (e : any) => {
    this.setState({
      contact_name: e
    })
  }
  /**身份证号输入 */
  handleID = (e : any) => {
    this.setState({
      legal_id_no: e
    })
  }
  /**开户人 */
  handleBankAccountName = (e : any) => {
    this.setState({
      settle_bank_account_name: e
    })
  }
  /**银行卡号 */
  handleBankNum = (e: any) => {
    this.setState({settle_bank_account_no: e})
  }
  /**开户银行 */
  handleSettleBank = (e: any) => {
    this.setState({settle_bank: e})
  }
  /**支行 */
  handleBankName = (e: any) => {
    this.setState({bank_name: e})
  }
  /**注册号 */
  handleLicenseNUm = (e: any) => {
    this.setState({three_certs_in_one_no: e})
  }
  /**执照名称 */
  handleLicenseName = (e: any) => {
    this.setState({corn_bus_name: e})
  }
  /**法人名称 */
  handleLegalName = (e: any) => {
    this.setState({legal_name: e})
  }



  /**身份证正面照选择 */
  changeIdFront = ( files: any ) => {
    this.setState({
      id_front: files,
    });
    if(files[0]){
      let img = files[0].url;
      upload(img).then(res => {
        let legal_id_front_img = res.data.path;
        this.setState({legal_id_front_img});
        const {legal_id_back_img, hand_hold_id_img} = this.state;
        if(legal_id_back_img&&legal_id_front_img&&hand_hold_id_img){
          this.setState({animating_id: !this.state.animating_id})
          request({
            url: 'v3/idcard',
            method: 'get',
            params: {
              idcard_back_img: legal_id_back_img,
              idcard_front_img: legal_id_front_img
            }
          }).then(res => {
            this.setState({animating_id: !this.state.animating_id})
            let {data} = res;
            let id = data.front.words_result['公民身份号码'].words
            let name = data.front.words_result['姓名'].words;
            let date = data.back.words_result['失效日期'].words;
            if(date != '长期'){
              date = moment(date).format("YYYY-MM-DD")
            }
            if(id && name){
              this.setState({
                contact_name: name,
                legal_id_no: id,
                date
              })
            }else{
              Toast.fail('识别失败', 1);
            }
          }).catch(err => {
            this.setState({animating_id: !this.state.animating_id})
            Toast.fail('识别失败',1)
          })
        }
      });
    }else {
      this.setState({legal_id_front_img: ''})
    }
  }
  /**身份证反面选择 */
  changeIdBack = ( files: any ) => {
    this.setState({
      id_back: files,
    });
    if(files[0]){
      let img = files[0].url;
      upload(img).then(res => {
        let legal_id_back_img = res.data.path;
        this.setState({legal_id_back_img});
        const {legal_id_front_img, hand_hold_id_img} = this.state;
        if(legal_id_back_img&&legal_id_front_img&&hand_hold_id_img){
          this.setState({animating_id: !this.state.animating_id})
          request({
            url: 'v3/idcard',
            method: 'get',
            params: {
              idcard_back_img: legal_id_back_img,
              idcard_front_img: legal_id_front_img
            }
          }).then(res => {
            this.setState({animating_id: !this.state.animating_id})
            let {data} = res;
            let id = data.front.words_result['公民身份号码'].words
            let name = data.front.words_result['姓名'].words;
            let date = data.back.words_result['失效日期'].words;
            if(date != '长期'){
              date = moment(date).format("YYYY-MM-DD")
            }
            if(id && name){
              this.setState({
                contact_name: name,
                legal_id_no: id,
                date
              })
            }else{
              Toast.fail('识别失败', 1);
            }
          }).catch(err => {
            this.setState({animating_id: !this.state.animating_id})
            Toast.fail('识别失败',1)
          })
        }
      });
    }else {
      this.setState({legal_id_back_img: ''})
    }
  }
  /**手持身份证照选择 */
  changeIdHand = ( files: any ) => {
    this.setState({
      id_hand: files,
    });
    if(files[0]){
      let img = files[0].url;
      upload(img).then(res => {
        let hand_hold_id_img = res.data.path;
        this.setState({hand_hold_id_img});
        const {legal_id_front_img, legal_id_back_img} = this.state;
        if(legal_id_back_img&&legal_id_front_img&&hand_hold_id_img){
          this.setState({animating_id: !this.state.animating_id})
          request({
            url: 'v3/idcard',
            method: 'get',
            params: {
              idcard_back_img: legal_id_back_img,
              idcard_front_img: legal_id_front_img
            }
          }).then(res => {
            this.setState({animating_id: !this.state.animating_id})
            let {data} = res;
            let id = data.front.words_result['公民身份号码'].words
            let name = data.front.words_result['姓名'].words;
            let date = data.back.words_result['失效日期'].words;
            if(date != '长期'){
              date = moment(date).format("YYYY-MM-DD")
            }
            if(id && name){
              this.setState({
                contact_name: name,
                legal_id_no: id,
                date
              })
            }else{
              Toast.fail('识别失败', 1);
            }
          }).catch(err => {
            this.setState({animating_id: !this.state.animating_id})
            Toast.fail('识别失败',1)
          })
        }
      });
    }else {
      this.setState({hand_hold_id_img: ''})
    }
  }
  /**银行卡正面选择 */
  changeBankFront = ( files: any ) => {
    this.setState({
      bank_front: files,
    });
    if(files[0]){
      let img = files[0].url;
      upload(img).then(res => {
        let bank_card_front_img = res.data.path;
        this.setState({bank_card_front_img});
        const { bank_card_back_img } = this.state;
        if(bank_card_back_img&&bank_card_front_img){
          this.setState({animating_id: !this.state.animating_id})
          request({
          url: 'v3/bankcard',
          method: 'get',
          params:{
            bank_card_front_img
          }
          }).then(res => {
            this.setState({animating_id: !this.state.animating_id})
            let {data, code} = res;
            if(code == 200){
              let str = data.bank_card_number;
              str = str.replace(/\s*/g,"");
              this.setState({
                settle_bank_account_no: str,
                settle_bank: data.bank_name
              })
            }else{
              Toast.fail('识别失败', 1);
            }

          }).catch(err => {
            this.setState({animating_id: !this.state.animating_id})
            Toast.fail('识别失败',1)
          })
        }

      });
    }else {
      this.setState({bank_card_front_img: ''})
    }
  }
  /**银行卡反面选择 */
  changeBankBack = ( files: any ) => {
    this.setState({
      bank_back: files,
    });
    if(files[0]){
      let img = files[0].url;
      upload(img).then(res => {
        let bank_card_back_img = res.data.path;
        this.setState({bank_card_back_img});
        const { bank_card_front_img } = this.state;
        if(bank_card_back_img&&bank_card_front_img){
          this.setState({animating_id: !this.state.animating_id})
          request({
          url: 'v3/bankcard',
          method: 'get',
          params:{
            bank_card_front_img
          }
          }).then(res => {
            this.setState({animating_id: !this.state.animating_id})
            let {data, code} = res;
            if(code == 200){
              let str = data.bank_card_number;
              str = str.replace(/\s*/g,"");
              this.setState({
                settle_bank_account_no: str,
                settle_bank: data.bank_name
              })
            }else{
              Toast.fail('识别失败', 1);
            }

          }).catch(err => {
            this.setState({animating_id: !this.state.animating_id})
            Toast.fail('识别失败',1)
          })
        }
      });
    }else {
      this.setState({bank_card_back_img: ''})
    }
  }
  /**营业执照选择 */
  changeLicense = ( files: any ) => {
    this.setState({
      license_img: files,
    });
    if(files[0]){
      let img = files[0].url;
      upload(img).then(res => {
        let three_certs_in_one_img = res.data.path;
        this.setState({three_certs_in_one_img});
        this.setState({animating_id: !this.state.animating_id})
        request({
          url: 'v3/business_license',
          method: 'get',
          params: {
            business_license_img: three_certs_in_one_img
          }
        }).then(res => {
          this.setState({animating_id: !this.state.animating_id});
          let {data} = res;
          let corn_bus_name = data['单位名称'].words;
          let three_certs_in_one_no = data['社会信用代码'].words;
          let legal_name = data['法人'].words;
          let three_certs_in_one_valid_date = data['有效期'].words;
          this.setState({
            corn_bus_name,
            three_certs_in_one_no,
            legal_name,
            three_certs_in_one_valid_date
          })

        }).catch(err => {
          this.setState({animating_id: !this.state.animating_id})
          Toast.fail('识别失败',1)
        })
      });
    }else {
      this.setState({three_certs_in_one_img: ''})
    }
  }


  /**选择有效期 */
  chooseDate = (type: number, date: string) => () => {
    this.setState({
      type,
      is_show: true,
      choose_date: date
    })
  }

  /**选择日期的回调 */
  timeChange = (type: number, date: string) => {
    if(type == 1){
      this.setState({
        date,
        is_show: false
      })
    }else{
      this.setState({
        three_certs_in_one_valid_date: date,
        is_show: false
      })
    }
  }
  /**初始化渲染图片的时候取消选择图片 */
  closeIDFront = () => {
    this.setState({
      is_id_front: false,
      legal_id_front_img: ''
    });
  }
  closeIDBack = () => {
    this.setState({
      is_id_back: false,
      legal_id_back_img: ''
    });
  }
  closeIDHand = () => {
    this.setState({
      is_id_hand: false,
      hand_hold_id_img: ''
    });
  }
  closeBankFront = () => {
    this.setState({
      is_bank_front: false,
      bank_card_front_img: ''
    });
  }
  closeBankBack = () => {
    this.setState({
      is_bank_back: false,
      bank_card_back_img: ''
    });
  }
  closeLicense = () => {
    this.setState({
      is_license: false,
      three_certs_in_one_img: ''
    });
  }

  /**保存或者提交 */
  submit = (type: number) => () => {
    const {legal_id_front_img, legal_id_back_img, hand_hold_id_img, contact_name, legal_id_no, date, bank_card_front_img, bank_card_back_img, three_certs_in_one_img, settle_bank_account_no, settle_bank_account_name, three_certs_in_one_valid_date, three_certs_in_one_no, corn_bus_name, legal_name, bank_name, settle_bank } = this.state;
    let data = {
      legal_id_back_img,
      legal_id_front_img,
      three_certs_in_one_img,
      hand_hold_id_img,
      bank_card_front_img,
      bank_card_back_img,
      contact_name,
      legal_id_valid_date: date,
      legal_id_no,
      settle_bank_account_no,
      settle_bank_account_name,
      three_certs_in_one_valid_date,
      three_certs_in_one_no,
      corn_bus_name,
      legal_name,
      bank_name,
      settle_bank,
      confirm_step: type
    }

    request({
      url: 'v3/payment_profiles',
      method: 'post',
      data
    }).then(res => {
      let { code } = res;
      if(code == 200){
        if(type == 1){
          Toast.success('保存成功', 2, ()=> {
            router.push('/')
          })
        }else if(type == 2){
          Toast.success('提交成功', 2, ()=> {
            router.push('/')
          })
        }
      }
    })

  }




  render (){
    const { id_hand, id_back, id_front, bank_front, bank_back, license_img, date, three_certs_in_one_valid_date } = this.state;
    const idFront = this.state.is_id_front == true ? (
      <div className={styles.idcard}><img src={"http://oss.tdianyi.com/"+ this.state.legal_id_front_img}/><div className={styles.close} onClick={this.closeIDFront}>{''}</div></div>
    ) : (
      <ImagePicker
        className={styles.front_img}
        files={id_front}
        multiple={false}
        length={1}
        selectable={id_front.length < 1}
        onChange={this.changeIdFront}
      />
    );
    const idBack = this.state.is_id_back == true ? (
      <div className={styles.idcard}><img src={"http://oss.tdianyi.com/"+ this.state.legal_id_back_img}/><div className={styles.close} onClick={this.closeIDBack}>{''}</div></div>
    ) : (
      <ImagePicker
        className={styles.back_img}
        files={id_back}
        multiple={false}
        length={1}
        selectable={id_back.length < 1}
        onChange={this.changeIdBack}
      />
    )
    const idHand = this.state.is_id_hand == true ? (
      <div className={styles.idcard}><img src={"http://oss.tdianyi.com/"+ this.state.hand_hold_id_img}/><div className={styles.close} onClick={this.closeIDHand}>{''}</div></div>
    ) : (
      <ImagePicker
        className={styles.hand_img}
        files={id_hand}
        multiple={false}
        length={1}
        selectable={id_hand.length < 1}
        onChange={this.changeIdHand}
      />
    )
    const bankFront = this.state.is_bank_front == true ? (
      <div className={styles.bankcard}><img src={"http://oss.tdianyi.com/"+ this.state.bank_card_front_img}/><div className={styles.close} onClick={this.closeBankFront}>{''}</div></div>
    ) : (
      <ImagePicker
        className={styles.bank_front}
        files={bank_front}
        multiple={false}
        length={1}
        selectable={bank_front.length < 1}
        onChange={this.changeBankFront}
      />
    )
    const bankBack = this.state.is_bank_back == true ? (
      <div className={styles.bankcard}><img src={"http://oss.tdianyi.com/"+ this.state.bank_card_back_img}/><div className={styles.close} onClick={this.closeBankBack}>{''}</div></div>
    ) : (
      <ImagePicker
        className={styles.bank_back}
        files={bank_back}
        multiple={false}
        length={1}
        selectable={bank_back.length < 1}
        onChange={this.changeBankBack}
      />
    )
    const License = this.state.is_license == true ? (
      <div className={styles.licenseImg}><img src={"http://oss.tdianyi.com/"+ this.state.three_certs_in_one_img}/><div className={styles.close} onClick={this.closeLicense}>{''}</div></div>
    ) : (
      <ImagePicker
        className={styles.license}
        files={license_img}
        multiple={false}
        length={1}
        selectable={license_img.length < 1}
        onChange={this.changeLicense}
      />
    )

    const chooseTime = this.state.is_show == true ? (<ChooseDate type={this.state.type} choose_date={this.state.choose_date} onChange={this.timeChange}/>) : ('');




    return (
      <div style={{ width: '100%', height: 'auto', background: '#fff' }} className={styles.submitQua}>
        <WingBlank>
          <Flex className={styles.sfz_title}>
            <div className={styles.sfz_left}>身份证</div>
            <div className={styles.sfz_right} onClick={this.toIdCardExample}>查看示例</div>
          </Flex>
          <Flex style={{ marginTop: '23px'}}>请上传经营者身份证</Flex>
          <Flex className={styles.sfz_img}>
            {idFront}
            {idBack}
            {idHand}
          </Flex>
          <List>
            <InputItem placeholder='请输入姓名' value={this.state.contact_name} onChange={this.handleName}>姓名</InputItem>
            <InputItem placeholder='请输入身份证号' onChange={this.handleID} value={this.state.legal_id_no}>身份证号</InputItem>
            <InputItem
              placeholder='请选择身份证有效期'
              editable={false}
              value={this.state.date}
              onClick={this.chooseDate(1,date)}
            >
                有效期
                <Icon
                  type='right'
                  className={styles.youxiao}
                />
            </InputItem>
          </List>
          <Flex className={styles.bank_title}>
            <div className={styles.sfz_left}>银行卡认证</div>
            <div className={styles.sfz_right} onClick={this.toBankExample}>查看示例</div>
          </Flex>
          <Flex className={styles.bank_img}>
            {bankFront}
            {bankBack}

          </Flex>
          <List>
            <InputItem placeholder='请输入开户人姓名' onChange={this.handleBankAccountName} value={this.state.settle_bank_account_name}>开户人</InputItem>
            <InputItem placeholder='经营者银行卡（仅限储蓄卡）' value={this.state.settle_bank_account_no} onChange={this.handleBankNum}>银行卡号</InputItem>
            <InputItem placeholder='选择开户银行' value={this.state.settle_bank} onChange={this.handleSettleBank}>开户行<Icon type='right' className={styles.youxiao}/></InputItem>
            <InputItem placeholder='请输入支行' value={this.state.bank_name} onChange={this.handleBankName}>支行</InputItem>
          </List>
          <Flex className={styles.bank_title}>
            <div className={styles.sfz_left}>营业执照</div>
            <div className={styles.sfz_right} onClick={this.toLicenseExample}>查看示例</div>
          </Flex>
          <Flex className={styles.license_img}>
            {License}
          </Flex>
          <InputItem placeholder='同统一社会信用代码' value={this.state.three_certs_in_one_no} onChange={this.handleLicenseNUm}>注册号</InputItem>
          <InputItem placeholder='无执照名称可填写经营者名称' value={this.state.corn_bus_name} onChange={this.handleLicenseName}>执照名称</InputItem>
          <InputItem placeholder='请输入法人姓名' value={this.state.legal_name} onChange={this.handleLegalName}>法人姓名</InputItem>
          <InputItem placeholder='有效期' editable={false} value={this.state.three_certs_in_one_valid_date} onClick={this.chooseDate(2,three_certs_in_one_valid_date)}>有效期<Icon type='right' className={styles.youxiao}/></InputItem>
        </WingBlank>
        <ActivityIndicator toast={true} text='识别中...' animating={this.state.animating_id}/>
        <Flex className={styles.buttons}>
          <div className={styles.save} onClick={this.submit(1)}>保存</div>
          <div className={styles.submit} onClick={this.submit(2)}>提交审核</div>
        </Flex>
        {chooseTime}
      </div>
    )
  }
}
