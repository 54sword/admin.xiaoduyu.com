import React from 'react'
import CSSModules from 'react-css-modules'

import styles from './style.scss'

import Shell from '../shell'
import PeopleList from '../../components/people/list'
import Meta from '../../components/meta'

export class People extends React.Component {

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
  }

  // 根据生成查询sql
  produceQuery(params) {
    if (!params) params = this.props.location.params || {}

    if (!Reflect.has(params, 'sort_by')) params.sort_by = 'create_at'

    let newParams = {}

    let whiteList = {
      sort_by: (s)=>s,
      blocked: (s)=>true,
      page_number: (s)=>parseInt(s),
      page_size: (s)=>parseInt(s),
      start_create_at: (s)=>s,
      end_create_at: (s)=>s,
      _id: (s)=>s,
      banned_to_post: (s) => s
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
      if (params[i]) {
        arr.push(i+'='+params[i])
      }
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
    const { blocked, _id, start_create_at, end_create_at, sort_by, banned_to_post } = params

    return(<div>

      <Meta meta={{
        title: '用户'
        }} />

      <div>

        <h1 data-toggle="collapse" data-toggle="collapse" href="#collapseFrom">用户</h1>

        <form className="form collapse" onSubmit={this.submit} id="collapseFrom">

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">排序</label>
            <div className="col-sm-10">
              <select className="form-control" onChange={e=>this.valueOnChange(e, 'sort_by')} defaultValue={sort_by}>
                <option value="last_sign_at">最近登录日期</option>
                <option value="create_at">创建日期</option>
              </select>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">屏蔽</label>
            <div className="col-sm-10">
              <select className="form-control" onChange={e=>this.valueOnChange(e, 'blocked')} defaultValue={blocked}>
                <option value="">无</option>
                <option value="true">有</option>
              </select>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">禁言</label>
            <div className="col-sm-10">
              <select className="form-control" onChange={e=>this.valueOnChange(e, 'banned_to_post')} defaultValue={banned_to_post}>
                <option value="">无</option>
                <option value="true">有</option>
              </select>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">ID</label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                placeholder="请输入id"
                defaultValue={_id}
                onChange={e=>this.valueOnChange(e, '_id')}
                />
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">日期筛选</label>
            <div className="col-sm-10">
              <div className="form-row">
                <div className="col">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="创建日期小于该日期（如：2018/01/01）"
                    defaultValue={start_create_at}
                    onChange={e=>this.valueOnChange(e, 'start_create_at')}
                    />
                </div>
                <div className="col">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="创建日期大于该日期（如：2018/01/01）"
                    defaultValue={end_create_at}
                    onChange={e=>this.valueOnChange(e, 'end_create_at')}
                    />
                </div>
              </div>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label"></label>
            <div className="col-sm-10">
              <button type="submit" className="btn btn-primary">搜索</button>
            </div>
          </div>

        </form>

      </div>
      <PeopleList
        name={this.props.location.pathname + this.props.location.search}
        filters={{
          variables: params
        }}
        />
    </div>)
  }

}

People = CSSModules(People, styles)

export default Shell(People)
