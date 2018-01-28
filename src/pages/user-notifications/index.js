import React from 'react'
import CSSModules from 'react-css-modules'

import styles from './style.scss'

import Shell from '../shell'
import NotificationList from '../../components/notification/list'

import Meta from '../../components/meta'

export class Notification extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      filters: {},
      params: {}
    }
    this.valueOnChange = this.valueOnChange.bind(this)
    this.submit = this.submit.bind(this)
    this.produceUrl = this.produceUrl.bind(this)
    this.produceFilters = this.produceFilters.bind(this)
  }

  componentWillMount() {
    if (typeof window == 'undefined') return
    this.produceFilters()
  }

  // 根据生成查询sql
  produceFilters(params) {

    if (!params) params = this.props.location.params || {}
    if (!Reflect.has(params, 'sort_by')) params.sort_by = 'create_at'

    let filters = {
      query: {},
      select: {},
      options: {
        sort: {}
      }
    }

    for (let i in params) {
      switch (i) {
        case 'sort_by':
          filters.options.sort[params[i]] = -1;
          break
        case 'status':
          filters.query[params[i]] = true;
          break
        case 'start_date':
          if (!filters.query.create_at) filters.query.create_at = {}
          filters.query.create_at['$lte'] = params[i]
          break
        case 'end_date':
          if (!filters.query.create_at) filters.query.create_at = {}
          filters.query.create_at['$gte'] = params[i]
          break
        case 'type':
          filters.query.type = params[i]
          break
        default:
          filters.query[i] = params[i]
      }
    }

    this.setState({ filters, params })
  }

  // 生产url
  produceUrl() {
    let { params } = this.state
    const { pathname } = this.props.location
    let arr = []

    for (let i in params) {
      switch (i) {
        default: arr.push(i+'='+params[i])
      }
    }

    this.produceFilters(params)

    return arr.length > 0 ? pathname + '?' + arr.join('&') : pathname
  }

  valueOnChange(e, name) {
    if (e.target.value) {
      this.state.params[name] = e.target.value
    } else {
      delete this.state.params[name]
    }
  }

  submit(event) {
    if (event) event.preventDefault()
    this.props.history.push(this.produceUrl())
    return false
  }

  render() {

    const { filters, params } = this.state
    const {
      status, topic_id, sender_id, addressee_id, has_read,
      posts_id, comment_id, type
    } = params

    return(<div>

      <Meta
        meta={{
          title: '用户通知'
        }}
        />

      <h1>用户通知</h1>

        <form className="form" onSubmit={this.submit}>

          <div className="flex-left units-gap">
            <label className="unit-0 text-right" style={{width:'85px'}}>类型</label>
            <div className="unit">
              <select onChange={e=>this.valueOnChange(e, 'type')} defaultValue={type}>
                <option value="">所有</option>
                <option value="follow-posts">关注帖子</option>
                <option value="comment">评论帖子</option>
                <option value="reply">回复评论</option>
                <option value="follow-you">关注用户</option>
                <option value="like-comment">赞了评论</option>
                <option value="like-reply">赞了评论</option>
                <option value="new-comment">新的评论</option>
              </select>
            </div>
          </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>状态</label>
          <div className="unit">
            <select onChange={e=>this.valueOnChange(e, 'status')} defaultValue={status}>
              <option value="">所有</option>
              <option value="deleted">删除</option>
            </select>
          </div>
        </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>是否已读</label>
          <div className="unit">
            <select onChange={e=>this.valueOnChange(e, 'has_read')} defaultValue={has_read}>
              <option value="">所有</option>
              <option value="true">已读</option>
              <option value="false">未读</option>
            </select>
          </div>
        </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>日期筛选</label>
          <div className="unit">
            <input ref="start_date" type="text" placeholder="创建日期小于该日期（如：2018/01/01）" onChange={e=>this.valueOnChange(e, 'start_date')} />
            <input ref="end_date" type="text" placeholder="创建日期大于该日期（如：2018/01/01）" onChange={e=>this.valueOnChange(e, 'end_date')} />
          </div>
        </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>发件用户ID</label>
          <div className="unit">
            <input type="text" placeholder="请输入发件用户的id" defaultValue={sender_id} onChange={e=>this.valueOnChange(e, 'sender_id')} />
          </div>
        </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>收件用户ID</label>
          <div className="unit">
            <input type="text" placeholder="请输入收件用户的id" defaultValue={addressee_id} onChange={e=>this.valueOnChange(e, 'addressee_id')} />
          </div>
        </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>评论ID</label>
          <div className="unit">
            <input type="text" placeholder="请输入评论的id" defaultValue={comment_id} onChange={e=>this.valueOnChange(e, 'comment_id')} />
          </div>
        </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>帖子ID</label>
          <div className="unit">
            <input type="text" placeholder="请输入评论的id" defaultValue={posts_id} onChange={e=>this.valueOnChange(e, 'posts_id')} />
          </div>
        </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}></label>
          <div className="unit">
            <button type="submit" className="btn btn-primary">搜索</button>
          </div>
        </div>

      </form>

      <NotificationList
        name={this.props.location.pathname + this.props.location.search}
        filters={filters}
        />
    </div>)
  }

}

Notification = CSSModules(Notification, styles)

export default Shell(Notification)
