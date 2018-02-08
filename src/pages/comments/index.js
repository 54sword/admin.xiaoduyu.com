import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './style.scss'

import Shell from '../shell'
import CommentList from '../../components/comment/list'

import Meta from '../../components/meta'

export class Comment extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      timestamp: 0,
      filters: {},
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

  produceUrl() {
    let { params } = this.state
    const { pathname } = this.props.location
    let arr = []

    for (let i in params) {
      arr.push(i+'='+params[i])
    }

    return arr.length > 0 ? pathname + '?' + arr.join('&') : pathname
  }

  submit(event) {
    if (event) event.preventDefault()
    this.props.history.push(this.produceUrl())
    return false
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

  render() {

    const { filters, params } = this.state
    const { status, topic_id, _id, start_date, end_date, user_id, posts_id,
      weaken, deleted, recommend
    } = params

    return(<div>
      <Meta
        meta={{
          title: '评论'
        }}
        />

      <h1 data-toggle="collapse" href="#collapseFrom">评论</h1>

      <form className="form collapse" onSubmit={this.submit} id="collapseFrom">

        <div className="form-group row">

          <div className="col-sm-2 col-form-label">状态</div>
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

            {/*
            <select className="form-control" onChange={e=>this.valueOnChange(e, 'status')} defaultValue={status}>
              <option value="">所有</option>
              <option value="weaken">弱化</option>
              <option value="deleted">删除</option>
              <option value="recommend">推荐</option>
            </select>
            */}
          </div>

          <div className="col-sm-2 col-form-label">ID</div>
          <div className="col-sm-10">
            <input
              className="form-control"
              type="text"
              placeholder="请输入id"
              defaultValue={_id}
              onChange={e=>this.valueOnChange(e, '_id')}
              />
          </div>

          <div className="col-sm-2 col-form-label">日期筛选</div>
          <div className="col-sm-10">
            <div className="row">
              <div className="col">
                <input
                  className="form-control"
                  ref="start_date"
                  type="text"
                  placeholder="创建日期小于该日期（如：2018/01/01）"
                  defaultValue={start_date}
                  onChange={e=>this.valueOnChange(e, 'start_date')}
                  />
              </div>
              <div className="col">
                <input
                  className="form-control"
                  ref="end_date"
                  type="text"
                  placeholder="创建日期大于该日期（如：2018/01/01）"
                  defaultValue={end_date}
                  onChange={e=>this.valueOnChange(e, 'end_date')}
                  />
              </div>
            </div>
          </div>

          <div className="col-sm-2 col-form-label">用户ID</div>
          <div className="col-sm-10">
            <input
              className="form-control"
              type="text"
              placeholder="请输入用户的id"
              defaultValue={user_id}
              onChange={e=>this.valueOnChange(e, 'user_id')}
              />
          </div>

          <div className="col-sm-2 col-form-label">帖子ID</div>
          <div className="col-sm-10">
            <input
              className="form-control"
              type="text"
              placeholder="请输入帖子的id"
              defaultValue={posts_id}
              onChange={e=>this.valueOnChange(e, 'posts_id')}
              />
          </div>

          <div className="col-sm-2 col-form-label"></div>
          <div className="col-sm-10">
            <button type="submit" className="btn btn-primary">搜索</button>
          </div>

        </div>


        {/*
        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>状态</label>
          <div className="unit">
            <select onChange={e=>this.valueOnChange(e, 'status')} defaultValue={status}>
              <option value="">所有</option>
              <option value="weaken">弱化</option>
              <option value="deleted">删除</option>
              <option value="recommend">推荐</option>
            </select>
          </div>
        </div>


        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>ID</label>
          <div className="unit">
            <input
              type="text"
              placeholder="请输入id"
              defaultValue={_id}
              onChange={e=>this.valueOnChange(e, '_id')}
              />
          </div>
        </div>


        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>日期筛选</label>
          <div className="unit">
            <input
              ref="start_date"
              type="text"
              placeholder="创建日期小于该日期（如：2018/01/01）"
              defaultValue={start_date}
              onChange={e=>this.valueOnChange(e, 'start_date')}
              />
            <input
              ref="end_date"
              type="text"
              placeholder="创建日期大于该日期（如：2018/01/01）"
              defaultValue={end_date}
              onChange={e=>this.valueOnChange(e, 'end_date')}
              />
          </div>
        </div>


        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>用户ID</label>
          <div className="unit">
            <input
              type="text"
              placeholder="请输入用户的id"
              defaultValue={user_id}
              onChange={e=>this.valueOnChange(e, 'user_id')}
              />
          </div>
        </div>



        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}>帖子ID</label>
          <div className="unit">
            <input
              type="text"
              placeholder="请输入帖子的id"
              defaultValue={posts_id}
              onChange={e=>this.valueOnChange(e, 'posts_id')}
              />
          </div>
        </div>

        <div className="flex-left units-gap">
          <label className="unit-0 text-right" style={{width:'85px'}}></label>
          <div className="unit">
            <button type="submit" className="btn btn-primary">搜索</button>
          </div>
        </div>

        */}

      </form>
      
      <CommentList
        name={this.props.location.pathname + this.props.location.search}
        filters={{
          variables: params
        }}
        />
    </div>)
  }

}

Comment = CSSModules(Comment, styles)

export default Shell(Comment)
