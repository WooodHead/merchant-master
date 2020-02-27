/**
 * 创建门店测试版
 */
import React, { Component } from 'react';
import { Flex, WingBlank, Button, Toast, Picker, List, Icon, ImagePicker } from 'antd-mobile';
import styles from './index.less';
import request from '@/services/request';
import router from 'umi/router';
import upload from '@/services/oss';
import { connect } from 'dva';
import Cookies from 'js-cookie';
import ExampleImg from '../../components/example/index'

export default class CreateStore extends Component {
    state = {
        //门头照例子
        exampleImgShow: false,
        //经营品类
        manage_list: [],
        value: [],
        //环境照
        files1: [],
        files2: [],
        data: {
            storeName: '',
            storeAddress: '',
            storeHouseNumber: '',
            phone: '',
            manage_type: '',
            selector: '',
            storesMails: '',
            storePhoto: '',
            environmentPhoto1: '',
            environmentPhoto2: ''
        }
    }
    componentDidMount() {
        this.getManageType();
        this.getStroage();
    }
    /**打开地图 */
    openMap = () => {
        router.push('/createTheStore/map')
    }
    /**获取经营品类 */
    getManageType = () => {
        request({
            url: 'v3/manage_type',
            method: 'get',
        }).then(res => {
            let { data } = res;
            this.setState({ manage_list: data });
        });
    }
    /**经营类型的选择 */
    Checkout = (v: any) => {
        let selectorIndex: number = 0, temp: any = this.state.manage_list;
        for (let i in temp) {
            if (temp[i].id == v[0]) {
                selectorIndex = Number(i);
            }
        }
        let data = { ...this.state.data, manage_type: v[0], selector: temp[selectorIndex].name };
        this.setStroage(data);
        this.setState({ data, value: v })
    }

    onChange1 = (files1: any, type: any, index: any) => {
        Toast.loading('');
        if (files1[0]) {
            let img = files1[0].url;
            upload(img).then(res => {
                Toast.hide()
                let environmentPhoto1 = res.data.path || '';
                let data = { ...this.state.data, environmentPhoto1: environmentPhoto1 };
                this.setStroage(data);
                this.setState({ files1, data });
            })
        } else {
            Toast.hide();
            let data = { ...this.state.data, environmentPhoto1: '' };
            this.setStroage(data);
            this.setState({ files1, data });
        }
    }
    onChange2 = (files2: any, type: any, index: any) => {
        Toast.loading('');
        if (files2[0]) {
            let img = files2[0].url;
            upload(img).then(res => {
                Toast.hide()
                let environmentPhoto2 = res.data.path || '';
                let data = { ...this.state.data, environmentPhoto2: environmentPhoto2 };
                this.setStroage(data);
                this.setState({ files2, data });
            })
        } else {
            Toast.hide()
            let data = { ...this.state.data, environmentPhoto2: '' };
            this.setStroage(data);
            this.setState({ files2, data });
        }
    }
    exampleShow = () => {
        this.setState({ exampleImgShow: true })
    }
    onUpload = (query: any) => {
        let data = { ...this.state.data, storePhoto: query.returnImgUrl };
        this.setStroage(data);
        this.setState({ data });
    }
    closeDoorPhoto = (e: any) => {
        let data = { ...this.state.data, storePhoto: '' };
        this.setStroage(data);
        this.setState({ data });
        e.stopPropagation();
    }
    closeEnvPhoto1 = (e: any) => {
        let data = { ...this.state.data, environmentPhoto1: '' };
        this.setStroage(data);
        this.setState({ files1: [], data });
        e.stopPropagation();
    }
    closeEnvPhoto2 = (e: any) => {
        let data = { ...this.state.data, environmentPhoto2: '' };
        this.setStroage(data);
        this.setState({ files2: [], data });
        e.stopPropagation();
    }
    onCancle = () => {
        this.setState({ exampleImgShow: false })
    }
    // 设置缓存
    setStroage = (data: object) => {
        console.log(data);
        localStorage.setItem('creatStoreData', JSON.stringify(data))
    }
    //获取缓存
    getStroage = () => {
        let stroage: any = JSON.parse(localStorage.getItem('creatStoreData'));
        let tempData = {
            storeName: '',
            storeAddress: '',
            storeHouseNumber: '',
            phone: '',
            manage_type: '',
            selector: '',
            storesMails: '',
            storePhoto: '',
            environmentPhoto1: '',
            environmentPhoto2: ''
        }
        let temp = { ...tempData, ...stroage };
        console.log(temp);
        this.setState({ data: temp });
    }
    handlechange = (type: any, e: any) => {
        let data = this.state.data;
        data[type] = e.target.value;
        this.setStroage(data);
        this.setState({ data })
    }
    render() {
        return (
            <div className={styles.creatStorePage}>
                <div className={styles.inputItem}>
                    <div className={styles.inputTitle}>门店名称</div>
                    <input className={styles.inputBox} placeholder="请输入门店名称" onChange={this.handlechange.bind(this, 'storeName')} value={this.state.data.storeName} />
                </div>
                <div className={styles.selectItem} onClick={this.openMap}>
                    <div className={styles.selectTitle}>门店地址</div>
                    {
                        this.state.data.storeAddress ?
                            <div className={styles.unSelectBox} >{this.state.data.storeAddress}</div>
                            :
                            <div className={styles.selectBox} >请选择地址</div>
                    }
                    <img className={styles.selectIcon} src="http://oss.tdianyi.com/front/eMbkt8GMNGYCpfFNe8Bycmb5QDRMTXkP.png" />
                </div>
                <div className={styles.inputItem}>
                    <div className={styles.inputTitle}>门牌号</div>
                    <input className={styles.inputBox} placeholder="请输入详细地址" onChange={this.handlechange.bind(this, 'storeHouseNumber')} value={this.state.data.storeHouseNumber} />
                </div>
                <div className={styles.inputItem}>
                    <div className={styles.inputTitle}>门店电话</div>
                    <input className={styles.inputBox} placeholder="请输入电话号码" onChange={this.handlechange.bind(this, 'phone')} value={this.state.data.phone} />
                </div>
                <Picker
                    className={styles.picker}
                    style={{ width: '100%', fontSize: '28px' }}
                    data={this.state.manage_list}
                    cols={1}
                    onOk={this.Checkout}
                    value={this.state.value}
                >
                    <div className={styles.selectItem}>
                        <div className={styles.selectTitle}>经营品类</div>
                        {
                            this.state.data.selector ?
                                <div className={styles.unSelectBox} >{this.state.data.selector}</div>
                                :
                                <div className={styles.selectBox} >请选择品类</div>
                        }
                        <img className={styles.selectIcon} src="http://oss.tdianyi.com/front/eMbkt8GMNGYCpfFNe8Bycmb5QDRMTXkP.png" />
                    </div>
                </Picker>
                <div className={styles.inputItem}>
                    <div className={styles.inputTitle}>邮箱</div>
                    <input className={styles.inputBox} placeholder="请输入邮箱地址" onChange={this.handlechange.bind(this, 'storesMails')} value={this.state.data.storesMails} />
                </div>
                <div className={styles.doorPhotoContent}>
                    <div className={styles.doorPhotoTitle}>上传门头照</div>
                    <div className={styles.doorPhotoPickerBox} >
                        {
                            this.state.data.storePhoto ?
                                <div className={styles.closeBox} >
                                    <img className={styles.close} src="http://oss.tdianyi.com/front/3CAEXRtyBexfyP352P3rENcQ7eYwmb8F.png" onClick={this.closeDoorPhoto.bind(this)} />
                                    <img className={styles.doorPhotoPickerImg} src={"http://oss.tdianyi.com/" + this.state.data.storePhoto} />
                                </div>
                                :
                                <div className={styles.closeBox} onClick={this.exampleShow.bind(this)}>
                                    <img className={styles.doorPhotoPickerImg} src="http://oss.tdianyi.com/front/dDmWyeYPbjaQzMHnFNwJEPPEhrkfiAbs.png" />
                                </div>
                        }
                    </div>
                </div>
                <div className={styles.environmentContent}>
                    <div className={styles.doorPhotoTitle}>上传环境照</div>
                    <div className={styles.doorPhotoList}>
                        {
                            this.state.data.environmentPhoto1 ?
                                <div className={styles.doorPhotoItem}>
                                    <img className={styles.close} src="http://oss.tdianyi.com/front/3CAEXRtyBexfyP352P3rENcQ7eYwmb8F.png" onClick={this.closeEnvPhoto1.bind(this)} />
                                    <img className={styles.doorPhotoPickerImg} src={"http://oss.tdianyi.com/" + this.state.data.environmentPhoto1} />
                                </div>
                                :
                                <div className={styles.doorPhotoItem}>
                                    <ImagePicker
                                        className={styles.PickerBtn}
                                        files={this.state.files1}
                                        multiple={false}
                                        length={1}
                                        selectable={this.state.files1.length < 1}
                                        onChange={this.onChange1}
                                    />
                                </div>
                        }
                        {
                            this.state.data.environmentPhoto2 ?
                                <div className={styles.doorPhotoItem}>
                                    <img className={styles.close} src="http://oss.tdianyi.com/front/3CAEXRtyBexfyP352P3rENcQ7eYwmb8F.png" onClick={this.closeEnvPhoto2.bind(this)} />
                                    <img className={styles.doorPhotoPickerImg} src={"http://oss.tdianyi.com/" + this.state.data.environmentPhoto2} />
                                </div>
                                :
                                <div className={styles.doorPhotoItem}>
                                    <ImagePicker
                                        className={styles.PickerBtn}
                                        files={this.state.files2}
                                        multiple={false}
                                        length={1}
                                        selectable={this.state.files2.length < 1}
                                        onChange={this.onChange2}
                                    />
                                </div>
                        }

                    </div>
                </div>
                <div className={styles.sumbitCreatStore}>提交</div>
                {
                    this.state.exampleImgShow ? <ExampleImg
                        exampleImg={'http://oss.tdianyi.com/front/KcrsrfW8mzAtC2b8fDw5JAWxHWZKhnAz.png'}
                        onUpload={this.onUpload}
                        onCancle={this.onCancle}
                    /> : null
                }

            </div>
        )
    }
}



