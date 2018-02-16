import React from 'react'

import Shell from '../shell'
import Meta from '../../components/meta'

import { loadSummary } from '../../actions/analysis'
import { getAllAnalysis } from '../../reducers/analysis'

// 纯组件
export class Home extends React.Component {

  static mapStateToProps = (state, props) => {
    return {
      analysis: getAllAnalysis(state, 'all')
    }
  }

  static mapDispatchToProps = { loadSummary }

  constructor(props) {
    super(props)
  }

  componentDidMount() {

    this.props.loadSummary({
      name: 'all',
      filters: {}
    })

    let date = new Date()

    let year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate()

    if (month < 10) month = '0' + month
    if (day < 10) day = '0'+ day

    // this.props.loadSummary({
    //   name: 'today',
    //   filters: {
    //     start_create_at: new Date(year+'/'+month+'/'+day).getTime() + ""
    //   }
    // })

  }

  render() {

    let all = this.props.analysis['all'] || {}
    let today = this.props.analysis['today'] || {}

    return(<div>
        <Meta
          meta={{
            title: '首页'
          }}
          />
        <h1>首页</h1>

        {all ?
          <div>
            <div>注册用户：{all.user_count || ''}</div>
            <div>帖子总数：{all.posts_count || ''}</div>
            <div>评论总数：{all.comment_count || ''}</div>
            <div>广播通知：{all.notification_count || ''}</div>
            <div>用户通知：{all.userNotification_count || ''}</div>
          </div>
        : null}

        <h1>今天</h1>

        {today ?
          <div>
            <div>注册用户：{today.user_count || 0}</div>
            <div>帖子总数：{today.posts_count || 0}</div>
            <div>评论总数：{today.comment_count || 0}</div>
            <div>广播通知：{today.notification_count || 0}</div>
            <div>用户通知：{today.userNotification_count || 0}</div>
          </div>
        : null}
    </div>)
  }

}

export default Shell(Home)
