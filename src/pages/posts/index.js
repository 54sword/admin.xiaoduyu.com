import React from 'react'
import CSSModules from 'react-css-modules'
import { Link } from 'react-router'

import styles from './style.scss'

import Shell from '../shell'
import PostsList from '../../components/posts/list'

import { loadTopics } from '../../actions/topic'
import { getTopicListByName } from '../../reducers/topic'

import Meta from '../../components/meta'

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
        query: {
          parent_id: { $exists: true }
        },
        select: {
          _id: 1, name: 1
        },
        options: {
          limit: 1000
        }
      }
    })

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
    const { topicList } = this.props

    // console.log('123123');

    // return (<div>Test</div>)

    return(<div>

        <Meta
          meta={{ title: '帖子' }}
          />

        <h1 data-toggle="collapse" href="#collapseFrom">帖子</h1>

        <form className="form collapse" onSubmit={this.submit} id="collapseFrom">

        <div className="form-group row">

          <label className="col-sm-2 col-form-label">排序</label>
          <div className="col-sm-10">
            <select className="form-control" onChange={e=>this.valueOnChange(e, 'sort_by')} defaultValue={sort_by}>
              <option value="sort_by_date">按排序日期</option>
              <option value="create_at">按创建日期</option>
            </select>
          </div>
          {/*
          <label className="unit-0 text-right" style={{width:'85px'}}>排序</label>
          <div className="unit">
            <select onChange={e=>this.valueOnChange(e, 'sort_by')} defaultValue={sort_by}>
              <option value="sort_by_date">按排序日期</option>
              <option value="create_at">按创建日期</option>
            </select>
          </div>
          */}
        </div>

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">状态</label>
          <div className="col-sm-10">

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

        {/*
        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>状态</label>
          <div className="unit">
            <label><input type="checkbox" checked={weaken ? true : false} defaultValue={weaken ? '' : 'true'} onChange={e=>this.valueOnChange(e, 'weaken')} /> 弱化</label>
            <label><input type="checkbox" checked={deleted ? true : false} defaultValue={deleted ? '' : 'true'} onChange={e=>this.valueOnChange(e, 'deleted')} /> 删除</label>
            <label><input type="checkbox" checked={recommend ? true : false} defaultValue={recommend ? '' : 'true'} onChange={e=>this.valueOnChange(e, 'recommend')} /> 推荐</label>
          </div>
        </div>
        */}

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">ID</label>
          <div className="col-sm-10">
            <input type="text" className="form-control" placeholder="请输入id" onChange={e=>this.valueOnChange(e, '_id')} />
          </div>
        </div>

        {/*
        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>ID</label>
          <div className="unit">
            <input type="text" placeholder="请输入id" onChange={e=>this.valueOnChange(e, '_id')} />
          </div>
        </div>
        */}

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">日期筛选</label>
          <div className="col-sm-10">
            <div className="form-row">
              <div className="col">
                <input className="form-control" ref="end_create_at" type="text" placeholder="创建日期小于该日期（如：2018/01/01）" onChange={e=>this.valueOnChange(e, 'end_create_at')} />
              </div>
              <div className="col">
                <input className="form-control" ref="start_create_at" type="text" placeholder="创建日期大于该日期（如：2018/01/01）" onChange={e=>this.valueOnChange(e, 'start_create_at')} />
              </div>
            </div>
          </div>
        </div>

        {/*
        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>日期筛选</label>
          <div className="unit">
            <input ref="end_create_at" type="text" placeholder="创建日期小于该日期（如：2018/01/01）" onChange={e=>this.valueOnChange(e, 'end_create_at')} />
            <input ref="start_create_at" type="text" placeholder="创建日期大于该日期（如：2018/01/01）" onChange={e=>this.valueOnChange(e, 'start_create_at')} />
          </div>
        </div>
        */}

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">话题</label>
          <div className="col-sm-10">
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

        {/*
        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>话题</label>
          <div className="unit">

            {topicList.data && topicList.data.length > 0 ?
              <select onChange={e=>this.valueOnChange(e, 'topic_id')} defaultValue={topic_id}>
                <option value="">所有</option>
                {topicList.data.map(item=>{
                  return (<option value={item._id} key={item._id}>{item.name}</option>)
                })}
              </select>
            : null}

          </div>
        </div>
        */}

        <div className="form-group row">
          <label className="col-sm-2 col-form-label">用户ID</label>
          <div className="col-sm-10">
            <input className="form-control" type="text" placeholder="请输入用户的id" defaultValue={user_id} onChange={e=>this.valueOnChange(e, 'user_id')} />
          </div>
        </div>

        {/*
        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>用户ID</label>
          <div className="unit">
            <input type="text" placeholder="请输入用户的id" defaultValue={user_id} onChange={e=>this.valueOnChange(e, 'user_id')} />
          </div>
        </div>
        */}

        <div className="form-group row">
          <label className="col-sm-2 col-form-label"></label>
          <div className="col-sm-10">
            <button type="submit" className="btn btn-primary">搜索</button>
          </div>
        </div>

      </form>

      <PostsList
        name={this.props.location.pathname + this.props.location.search}
        filters={{
          variables: params
        }}
        />
    </div>)
  }

}

Posts = CSSModules(Posts, styles)

export default Shell(Posts)
