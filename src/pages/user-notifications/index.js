import React from 'react'
import { Link } from 'react-router-dom'
import CSSModules from 'react-css-modules'

import styles from './style.scss'

import Shell from '../shell'
import UserNotificationList from '../../components/user-notification/list'
import Meta from '../../components/meta'
import Modal from '../../components/bootstrap/modal'

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
    this.produceQuery = this.produceQuery.bind(this)
  }

  componentWillMount() {
    if (typeof window == 'undefined') return
    this.produceQuery()
  }

  componentWillReceiveProps(props) {
    if (props.location.search != this.props.location.search) {

      let { search }  = props.location

      search = search.split('?')[1] || '';

      let searchArr = {};
      search.split('&').map(item=>{
        let s = item.split('=');
        searchArr[s[0]] = s[1];
      })

      this.produceQuery(searchArr)
    }
  }

  // 根据生成查询sql
  produceQuery(params) {
    if (!params) params = this.props.location.params || {}

    if (!Reflect.has(params, 'sort_by')) params.sort_by = 'create_at'

    let newParams = {}

    let whiteList = {
      sort_by: s=>s,
      type: s=>s,
      deleted: s =>true,
      has_read: s => { return s == 'true' || s === true ? true : false },
      page_number: s=>parseInt(s),
      page_size: s=>parseInt(s),
      start_create_at: s=>s,
      end_create_at: s=>s,
      sender_id: s=>s,
      addressee_id: s=>s,
      posts_id: s=>s,
      comment_id: s=>s,
      _id: s=>s
    }

    for (let i in params) {
      if (whiteList[i]) newParams[i] = whiteList[i](params[i])
    }

    this.setState({ params: newParams })
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

    this.produceQuery(params)

    return arr.length > 0 ? pathname + '?' + arr.join('&') : pathname
  }

  valueOnChange(e, name) {
    let { params } = this.state

    if (e.target.value) {
      params[name] = e.target.value
    } else {
      delete params[name]
    }

    this.produceQuery(params)
  }

  submit(event) {
    if (event) event.preventDefault()
    this.props.history.push(this.produceUrl())
    return false
  }

  render() {

    const { params } = this.state
    const {
      deleted, topic_id, sender_id, addressee_id, has_read,
      posts_id, comment_id, type
    } = params
    const { location } = this.props

    return(<div>

      <Meta meta={{ title: '用户通知' }} />

      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mt-3 mb-2">
        <h2>用户通知</h2>
        <div className="btn-toolbar mb-2 mb-md-0">
          <button type="button" className="btn btn-primary btn-sm ml-2" data-toggle="modal" data-target="#UserNotificationsModal">筛选</button>
          {location.search ? <Link className="btn btn-primary btn-sm ml-2" to="/user-notifications">清空筛选条件</Link> : null}
        </div>
      </div>

      <Modal
        id="UserNotificationsModal"
        title="用户通知筛选"
        body={(

          <div className="form">

            <div className="form-group row">
              <label className="col-sm-2 col-form-label">类型</label>
              <div className="col-sm-10">
                <select className="form-control" onChange={e=>this.valueOnChange(e, 'type')} defaultValue={type}>
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

            <div className="form-group row">
              <label className="col-sm-2 col-form-label">状态</label>
              <div className="col-sm-10">
                <select className="form-control" onChange={e=>this.valueOnChange(e, 'deleted')} defaultValue={deleted}>
                  <option value="">所有</option>
                  <option value="deleted">删除</option>
                </select>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-2 col-form-label">是否已读</label>
              <div className="col-sm-10">
                <select className="form-control" onChange={e=>this.valueOnChange(e, 'has_read')} defaultValue={has_read}>
                  <option value="">所有</option>
                  <option value="true">已读</option>
                  <option value="false">未读</option>
                </select>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-2 col-form-label">日期筛选</label>
              <div className="col-sm-10">
                <div className="row">
                  <div className="col">
                    <input className="form-control" ref="start_date" type="text" placeholder="创建日期小于该日期（如：2018/01/01）" onChange={e=>this.valueOnChange(e, 'start_date')} />
                  </div>
                  <div className="col">
                    <input className="form-control" ref="end_date" type="text" placeholder="创建日期大于该日期（如：2018/01/01）" onChange={e=>this.valueOnChange(e, 'end_date')} />
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-2 col-form-label">发件用户ID</label>
              <div className="col-sm-10">
                <input className="form-control" type="text" placeholder="请输入发件用户的id" defaultValue={sender_id} onChange={e=>this.valueOnChange(e, 'sender_id')} />
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-2 col-form-label">收件用户ID</label>
              <div className="col-sm-10">
                <input className="form-control" type="text" placeholder="请输入收件用户的id" defaultValue={addressee_id} onChange={e=>this.valueOnChange(e, 'addressee_id')} />
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-2 col-form-label">评论ID</label>
              <div className="col-sm-10">
                <input className="form-control" type="text" placeholder="请输入评论的id" defaultValue={comment_id} onChange={e=>this.valueOnChange(e, 'comment_id')} />
              </div>
            </div>

            <div className="form-group row">
              <label className="col-sm-2 col-form-label">帖子ID</label>
              <div className="col-sm-10">
                <input className="form-control" type="text" placeholder="请输入评论的id" defaultValue={posts_id} onChange={e=>this.valueOnChange(e, 'posts_id')} />
              </div>
            </div>

        </div>

        )}
        footer={(
          <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={this.submit}>提交</button>
        )}
        />

      <UserNotificationList
        name={this.props.location.pathname + this.props.location.search}
        location={this.props.location}
        filters={{
          variables: params
        }}
        />
    </div>)
  }

}

Notification = CSSModules(Notification, styles)

export default Shell(Notification)
