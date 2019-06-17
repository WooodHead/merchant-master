/**title: 我的收益 */
import React, { Component } from 'react';
import styles from './index.less';
import FiltrateLayout from '@/components/layout';
import BenefitItem, { Item } from './item';
import request from '@/services/request';
import { Toast, Flex } from 'antd-mobile';

export default class Benefit extends Component {
	/** 支付类型 1 微信 2 支付宝 */
	undetermined = [
		{
			id: 0,
			label: '所有类型'
		},
		{
			id: 1,
			label: '微信'
		},
		{ id: 2, label: '支付宝' }
	];
	state = { data: [], type: 'today', payType: undefined, date: undefined, showNoData: false };
	componentDidMount = () => this.getData();
	getData = async () => {
		Toast.loading('');
		const res = await request({
			url: 'v3/finance/offline_order',
			params: {
				type: this.state.type,
				pay_type: this.state.payType,
				date: this.state.date
			}
		});
		Toast.hide();
		if (res.code === 200) {
			this.setState({ data: res.data });
			if (!res.data.length) {
				this.setState({ showNoData: true });
			}
		}
	};
	render() {
		const list = this.state.data.map((_: Item) => <BenefitItem key={_.id} {..._} />);
		const noData = (
			<Flex className="noData" justify="center" direction="column">
				<img src={require('./icon.png')} alt="" />
				<span>暂无交易信息</span>
			</Flex>
		);
		return (
			<div className={styles.page}>
				<FiltrateLayout undetermined={this.undetermined}>
					{this.state.showNoData ? noData : list}
				</FiltrateLayout>
			</div>
		);
	}
}