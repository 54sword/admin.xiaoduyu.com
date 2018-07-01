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

    let date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate();

    date = new Date(year+'/'+month+'/'+day);

    const load = (name, start, end) => {

      let _startDate = new Date(start);

      let startDate = {
        year: _startDate.getFullYear(),
        month: _startDate.getMonth() + 1,
        day: _startDate.getDate()
      }

      let _endDate = new Date(end);

      let endDate = {
        year: _endDate.getFullYear(),
        month: _endDate.getMonth() + 1,
        day: _endDate.getDate()
      }

      this.props.loadSummary({
        name: name,
        filters: {
          start_create_at: startDate.year+'/'+startDate.month+'/'+startDate.day,
          end_create_at: endDate.year+'/'+endDate.month+'/'+endDate.day
        }
      })

    }

    load('today', date, new Date(date.getTime()+1000*60*60*24))
    load('yesterday', new Date(date.getTime()-1000*60*60*24), date)
    load('week', new Date(date.getTime()-1000*60*60*24*7), date)
    load('month', new Date(date.getTime()-1000*60*60*24*30), date)
  }

  render() {

    let all = this.props.analysis['all'] || {}
    let today = this.props.analysis['today'] || {}
    let yesterday = this.props.analysis['yesterday'] || {}
    let week = this.props.analysis['week'] || {}
    let month = this.props.analysis['month'] || {}

    return(<div>
      <Meta meta={{ title: '首页' }} />

      <table className="table">
        <thead>
          <tr>
            <th>日期</th>
            <th scope="col">注册用户</th>
            <th scope="col">帖子总数</th>
            <th scope="col">评论总数</th>
            <th scope="col">广播通知</th>
            <th scope="col">用户通知</th>
          </tr>
        </thead>
        <tbody>

          <tr>
            <th>今日</th>
            <th scope="row">{today.countUsers ? today.countUsers.count : ''}</th>
            <td>{today.countPosts ? today.countPosts.count : ''}</td>
            <td>{today.countComments ? today.countComments.count : ''}</td>
            <td>{today.countNotifications ? today.countNotifications.count : ''}</td>
            <td>{today.countUserNotifications ? today.countUserNotifications.count : ''}</td>
          </tr>
          <tr>
            <th>昨天</th>
            <th scope="row">{yesterday.countUsers ? yesterday.countUsers.count : ''}</th>
            <td>{yesterday.countPosts ? yesterday.countPosts.count : ''}</td>
            <td>{yesterday.countComments ? yesterday.countComments.count : ''}</td>
            <td>{yesterday.countNotifications ? yesterday.countNotifications.count : ''}</td>
            <td>{yesterday.countUserNotifications ? yesterday.countUserNotifications.count : ''}</td>
          </tr>
          <tr>
            <th>过去7天</th>
            <th scope="row">{week.countUsers ? week.countUsers.count : ''}</th>
            <td>{week.countPosts ? week.countPosts.count : ''}</td>
            <td>{week.countComments ? week.countComments.count : ''}</td>
            <td>{week.countNotifications ? week.countNotifications.count : ''}</td>
            <td>{week.countUserNotifications ? week.countUserNotifications.count : ''}</td>
          </tr>
          <tr>
            <th>过去30天</th>
            <th scope="row">{month.countUsers ? month.countUsers.count : ''}</th>
            <td>{month.countPosts ? month.countPosts.count : ''}</td>
            <td>{month.countComments ? month.countComments.count : ''}</td>
            <td>{month.countNotifications ? month.countNotifications.count : ''}</td>
            <td>{month.countUserNotifications ? month.countUserNotifications.count : ''}</td>
          </tr>
          <tr>
            <th>全部</th>
            <th scope="row">{all.countUsers ? all.countUsers.count : ''}</th>
            <td>{all.countPosts ? all.countPosts.count : ''}</td>
            <td>{all.countComments ? all.countComments.count : ''}</td>
            <td>{all.countNotifications ? all.countNotifications.count : ''}</td>
            <td>{all.countUserNotifications ? all.countUserNotifications.count : ''}</td>
          </tr>
        </tbody>
      </table>

    </div>)
  }

}

export default Shell(Home)
