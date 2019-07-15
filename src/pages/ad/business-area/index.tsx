/**title: 商圈广告 */

import React, { Component } from 'react';
import AdLayout from '../components/ad-layout';
import From from './form';
import ExpenseCalendar from '../components/expense-calendar';
import Chart from './chart';
import request from '@/services/request';
import { Toast } from 'antd-mobile';

export default class BusinessArea extends Component {
	state = {
		data: {},
		log: []
	};
	componentDidMount() {
		this.getDetail();
	}
	getDetail = async () => {
    Toast.loading('');
		const res = await request({ url: 'v3/ads/by_type', params: { ad_type: 2, position_id: 4 } });
		Toast.hide();
		/**判断当前是否有广告 */
		if (res.code === 200 && res.data.coupon_id) {
			this.setState({
				data: res.data
			});
			this.setLog();
		}
	};
	setLog = async () => {
    const res = await request({ url: 'v3/ad_logs' });
		if (res.code === 200) {
      if(res.data){
        this.setState({ log: res.data.data });
      }else{
        this.setState({ log: [] })
      }
		}
	};
	handleFormChange = () => this.getDetail();
	render() {
		const form = <From editForm={this.state.data} onChange={this.handleFormChange} />;
		const expenseCalendar = <ExpenseCalendar log={this.state.log} />;
		const chart = <Chart />;
		return <AdLayout children={[form, expenseCalendar, chart]} />;
	}
}
