import React from 'react'

import Shell from '../shell'
import Meta from '../../components/meta'

// 纯组件
export class Home extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {

    return(<div>
        <Meta
          meta={{
            title: '122222'
          }}
        />
        <h1>首页</h1>
        <div>当前注册用户：</div>
        <div>帖子总数1111：</div>
        <div>评论总数222：</div>
        <div>恢复总数332：</div>
    </div>)
  }

}

export default Shell(Home)
