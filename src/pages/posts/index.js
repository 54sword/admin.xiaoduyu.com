import React from 'react'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router-dom'

import styles from './style.scss'

import Shell from '../shell'
import PostsList from '../../components/posts/list'
import Meta from '../../components/meta'
import Modal from '../../components/bootstrap/modal'

import { loadTopics } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'

export class Posts extends React.Component {

  static mapStateToProps = (state, props) => {
    return {
      topicList: getTopicListByName(state, 'posts')
    }
  }

  static mapDispatchToProps = { loadTopics }

  constructor(props) {
    super(props)

    this.state = {
      params: {}
    }

    this.submit = this.submit.bind(this)
    this.valueOnChange = this.valueOnChange.bind(this)
    this.produceUrl = this.produceUrl.bind(this)
    this.produceQuery = this.produceQuery.bind(this)
  }

  componentWillMount() {

    if (typeof window == 'undefined') return

    this.produceQuery()

    this.props.loadTopics({
      name: 'posts',
      filters:{
        variables: {  type: 'parent', page_number: 1, page_size: 1000 },
        select: `
          _id
          name
        `
      }
    })

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
      sort_by: (s)=>s,
      recommend: (s)=>true,
      deleted: (s)=>true,
      weaken: (s)=>true,
      page_number: (s)=>parseInt(s),
      page_size: (s)=>parseInt(s),
      start_create_at: (s)=>s,
      end_create_at: (s)=>s,
      topic_id: (s)=>s,
      user_id: (s)=>s,
      _id: (s)=>s
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
      arr.push(i+'='+params[i])
    }

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
      sort_by, status, topic_id, user_id, weaken, deleted, recommend,
      end_create_at, start_create_at
    } = params
    const { topicList, location } = this.props

    return(<div>

      <Meta meta={{ title: '帖子' }} />

      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mt-3 mb-2">
        <h2>帖子</h2>
        <div className="btn-toolbar mb-2 mb-md-0">
          <button type="button" className="btn btn-primary btn-sm ml-2" data-toggle="modal" data-target="#exampleModalCenter">筛选</button>
          {location.search ? <Link className="btn btn-primary btn-sm ml-2" to="/posts">清空筛选条件</Link> : null}
        </div>
      </div>

      <Modal
        id="exampleModalCenter"
        title="帖子筛选"
        body={(
          <div className="form">

          <div className="form-group row">
            <label className="col-sm-3 col-form-label">排序</label>
            <div className="col-sm-9">
              <select className="form-control" onChange={e=>this.valueOnChange(e, 'sort_by')} defaultValue={sort_by}>
                <option value="sort_by_date">按排序日期</option>
                <option value="create_at">按创建日期</option>
              </select>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-3 col-form-label">状态</label>
            <div className="col-sm-9">

              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="weaken" checked={weaken ? true : false} defaultValue={weaken ? '' : 'true'} onChange={e=>this.valueOnChange(e, 'weaken')} />
                <label className="form-check-label" htmlFor="weaken">弱化</label>
              </div>

              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="deleted" checked={deleted ? true : false} defaultValue={deleted ? '' : 'true'} onChange={e=>this.valueOnChange(e, 'deleted')} />
                <label className="form-check-label" htmlFor="deleted">删除</label>
              </div>

              <div className="form-check form-check-inline">
                <input className="form-check-input" type="checkbox" id="recommend" checked={recommend ? true : false} defaultValue={recommend ? '' : 'true'} onChange={e=>this.valueOnChange(e, 'recommend')} />
                <label className="form-check-label" htmlFor="recommend">推荐</label>
              </div>

            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-3 col-form-label">ID</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" placeholder="请输入id" onChange={e=>this.valueOnChange(e, '_id')} />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-3 col-form-label">创建日期</label>
            <div className="col-sm-9">
              <div className="form-row">
                <div className="col">
                  <input className="form-control" ref="end_create_at" type="text" placeholder="小于该日期（如：2018/01/01）" onChange={e=>this.valueOnChange(e, 'end_create_at')} />
                </div>
                <div className="col">
                  <input className="form-control" ref="start_create_at" type="text" placeholder="大于该日期（如：2018/01/01）" onChange={e=>this.valueOnChange(e, 'start_create_at')} />
                </div>
              </div>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-3 col-form-label">话题</label>
            <div className="col-sm-9">
              {topicList.data && topicList.data.length > 0 ?
                <select className="form-control" onChange={e=>this.valueOnChange(e, 'topic_id')} defaultValue={topic_id}>
                  <option value="">所有</option>
                  {topicList.data.map(item=>{
                    return (<option value={item._id} key={item._id}>{item.name}</option>)
                  })}
                </select>
              : null}
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-3 col-form-label">用户ID</label>
            <div className="col-sm-9">
              <input className="form-control" type="text" placeholder="请输入用户的id" defaultValue={user_id} onChange={e=>this.valueOnChange(e, 'user_id')} />
            </div>
          </div>

          </div>
        )}
        footer={(
          <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={this.submit}>搜索</button>
        )}
        />

      <PostsList
        name={this.props.location.pathname + this.props.location.search}
        location={this.props.location}
        filters={{
          variables: params
        }}
        />
    </div>)
  }

}

Posts = CSSModules(Posts, styles)

export default Shell(Posts)
