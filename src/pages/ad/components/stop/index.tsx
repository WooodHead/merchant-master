import React, { Component } from 'react';
import Modal from '@/components/modal';

import styles from './index.less';

interface Props {
	onConfirm: () => any;
	show: boolean;
	onClose: () => any;
}

export default class StopAd extends Component<Props> {
	render() {
		return (
			<Modal
				show={this.props.show}
				onCancel={this.props.onClose}
				onClose={this.props.onClose}
				onConfirm={this.props.onConfirm}
				okBtn="暂停"
				cancelBtn="取消"
			>
				<img src={require('./img.png')} className={styles.tipImage} />
				<div className={styles.tipText}>暂停后广告将不会被展示，是否要暂停？</div>
			</Modal>
		);
	}
}
