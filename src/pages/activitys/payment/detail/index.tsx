/**title: 支付返券详情 */

import React, { Component } from 'react';
import request from '@/services/request';
import { Toast, Flex, WingBlank, Button } from 'antd-mobile';
import styles from './index.less';
import CouponCard from './coupon';
import moment from 'moment';
import router from 'umi/router';
import DeleteActivity from '@/components/deleteActivity'

export default class payReturnDetail extends Component<any> {
	state = {
		data: {},
		hasData: false,
		coupon:{}
	};
	componentDidMount = () => this.getData();
	getData = async () => {
		Toast.loading('');
		const res = await request({ url: 'v3/return_coupons/' + this.props.location.query.id });
		Toast.hide();
		if (res.code === 200) {
			this.setState({
				coupon: {
					length: res.data.coupon.length,
					activity_id: res.data.activity.id
				}
			})
			this.setState({ data: res.data, hasData: true });
		}
	};
	handleDelete = async () => {
		Toast.loading('');
		const res = await request({ url: 'v3/return_coupons/' + this.props.location.query.id, method: 'delete' });
		Toast.hide();
		if (res.code === 200) {
			Toast.success('删除成功');
			setTimeout(router.goBack, 1000);
		}
  };

	render() {
		const data: any = this.state.data;
		if (!this.state.hasData) return null;

		/**优惠列表 */
		const coupons = data.coupon.map((_: any, index: number) => (
			<div className="couponWrap">
				<CouponCard key={' '} {..._} coupon={this.state.coupon} coupon_id={_.id} query_id={this.props.location.query.id}/>
			</div>
		));

		return (
			// <div>

				<Flex className={styles.page} align="start" direction="column">

					<Flex.Item>
						<WingBlank>
							<Flex className="head">
								<div className="label">返</div>
								<Flex.Item className="name">{data.activity.name}</Flex.Item>
								<div className="time">
									{moment.unix(data.activity.activity_begin_time).format('YYYY/MM/DD')}-
								{moment.unix(data.activity.activity_end_time).format('YYYY/MM/DD')}
								</div>
							</Flex>
							{coupons}
						</WingBlank>
					</Flex.Item>
					<div className="buttonWrap">
						<WingBlank>
							<Button type="primary" className="deleteBtn" onClick={this.handleDelete}>
								删除活动
						</Button>
						</WingBlank>
				</div>

				</Flex>
			// </div>

		);
	}
}
