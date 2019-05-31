import React from 'react';
import { Flex } from 'antd-mobile';
import styles from './index.less';

export default function GroupItem() {
  return (
    <Flex className={styles.groupItem} align="end">
      <Flex.Item className="content">
        <div className="title">
          <span>券的名称</span>
        </div>
        <div className="time">2019.01.04-2019.05.06</div>
        <div className="detail">
          <span>已参与122</span>
          <span>最高可增值100</span>
        </div>
      </Flex.Item>
      <Flex className="btn" justify="center">
        <img src={require('./icon.png')} />
        分享
      </Flex>
    </Flex>
  );
}