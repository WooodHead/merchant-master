/**title: 团卖物联 */
import React, { Component } from 'react';
import { Flex, WingBlank, Button, Toast, InputItem } from 'antd-mobile';
import styles from './index.less';
import request from '@/services/request';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import router from 'umi/router';

export default connect()(
	class Login extends Component<any> {
		state = {
			/**0 验证码登录 1 账号密码登录 */
			tab: 1,
			/**手机号 */
			mobile: '',
			/**验证码 */
			code: '',
			/**账号 */
			account_name: '',
			/**密码 */
			password: ''
    };
    componentDidMount (){
       /**获取oss */
       request({
        url: 'api/v2/up',
        method: 'get'
      }).then( res => {
        let { data } = res;
        let oss_data = {
          policy: data.policy,
          OSSAccessKeyId: data.accessid,
          success_action_status: 200, //让服务端返回200,不然，默认会返回204
          signature: data.signature,
          callback: data.callback,
          host: data.host,
          key: data.dir
        }

        window.localStorage.setItem( 'oss_data' , JSON.stringify(oss_data) );
      });
    }
		/**设置手机号 */
		handleSetMobile = (value: any) => {
			this.setState({ mobile: value.split(' ').join('') });
		};
		/**设置验证码 */
		handleSetCode = (e: any) => {
			this.setState({ code: e.target.value });
		};
		/**设置账号 */
		handleSetAccount = (e: any) => {
			this.setState({ account_name: e.target.value });
		};
		/**设置密码 */
		handleSetPassword = (e: any) => {
			this.setState({ password: e.target.value });
		};
		/**判断当前是否可以登录 */
		fixLogin = (): boolean => {
			let value = false;
			if (this.state.tab === 1) {
				value = this.state.account_name !== '' && this.state.password !== '';
				if (!value) {
					Toast.fail('请填写用户名和密码', 1);
				}
			} else {
				value = this.state.mobile !== '' && this.state.code !== '';
				if (!value) {
					Toast.fail('请填写手机和验证码', 1);
				}
			}
			return value;
		};
		/**登录 */
		submit = () => {
			const api = this.state.tab === 1 ? 'v3/login' : 'v3/captcha_login';
			const { mobile, code, account_name, password, tab } = this.state;
			if (this.fixLogin()) {
				Toast.loading('登录中', 20);
				request({
					url: api,
					method: 'post',
					data: {
						phone: tab === 0 ? mobile : undefined,
						code: tab === 0 ? code : undefined,
						account_name: tab === 1 ? account_name : undefined,
						password: tab === 1 ? password : undefined
					}
				})
					.then((res: any) => {
						Toast.hide();
						if (res.code === 200) {
							localStorage.setItem('token', 'Bearer ' + res.data.token);
							this.props.dispatch(routerRedux.push({ pathname: '/' }));
						} else {
							Toast.fail(res.data, 1.5);
						}
					})
					.catch(() => Toast.hide());
			}
		};
		/**
		 * 设置tab高亮
		 * @param active 索引值
		 */
		handleChangeTab = (active: number) => () => this.setState({ tab: active });
		/**发送验证码 */
		sendCode = () => {
			if (this.state.mobile) {
				request({
					url: 'v3/verify_code',
					params: { phone: this.state.mobile }
				});
			}
    };

    /**跳转到页面 */
    pushPage = (pathname: string) => () => this.props.dispatch(routerRedux.push({ pathname }));

		render() {
			const content =
				this.state.tab === 1 ? (
					<div>
						<Flex className={styles.inputWrap}>
							<input
								value={this.state.account_name}
								style={{ width: '100%' }}
								placeholder="请填写账号"
								onChange={this.handleSetAccount}
							/>
						</Flex>
						<Flex className={styles.inputWrap}>
							<input
								value={this.state.password}
								style={{ width: '100%' }}
								placeholder="请填写密码"
								onChange={this.handleSetPassword}
								type="password"
							/>
						</Flex>
						<Flex justify="end">
							<span className={styles.warring} onClick={this.pushPage('/login/forgetpassword')}>忘记密码？</span>
						</Flex>
					</div>
				) : (
					<div>
						<Flex className={styles.inputWrap}>
							<div className="phone-prefix">+86</div>
							<Flex.Item>
								<InputItem
									type="phone"
									style={{ width: '100%' }}
									placeholder="请填写手机号"
									onChange={this.handleSetMobile}
								/>
							</Flex.Item>
						</Flex>
						<Flex className={styles.inputWrap}>
							<Flex.Item>
								<input
									value={this.state.code}
									style={{ width: '100%' }}
									placeholder="请填写短信验证码"
									onChange={this.handleSetCode}
								/>
							</Flex.Item>
							<div className="send-code" onClick={this.sendCode}>
								发送验证码
							</div>
						</Flex>
					</div>
				);
			return (
				<div className={styles.page}>
					<WingBlank>
						<Flex>
							<Flex.Item>
								<span className={styles.title}>商家登录</span>
							</Flex.Item>
							<a onClick={this.pushPage('/login/register')}>注册</a>
						</Flex>
						<div className="tab">
							<Flex>
								<div
									className={this.state.tab === 0 ? 'tab-item active' : 'tab-item'}
									onClick={this.handleChangeTab(0)}
								>
									短信验证码登录
								</div>
								<div
									className={this.state.tab === 1 ? 'tab-item active' : 'tab-item'}
									onClick={this.handleChangeTab(1)}
								>
									账号密码登录
								</div>
							</Flex>
						</div>
						{content}
						<WingBlank size="sm">
							<Button type="primary" style={{ marginTop: 86 }} onClick={this.submit}>
								登录
							</Button>
						</WingBlank>
					</WingBlank>
				</div>
			);
		}
	}
);
