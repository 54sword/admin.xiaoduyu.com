import React from 'react'
import { Link } from 'react-router-dom'

import Shell from '../shell'
import TopicList from '../../components/topic/list'
import Meta from '../../components/meta'

export class Topics extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      filters: {},
      params: {}
    }
    this.submit = this.submit.bind(this)
    this.valueOnChange = this.valueOnChange.bind(this)
    this.produceQuery = this.produceQuery.bind(this)
    this.produceUrl = this.produceUrl.bind(this)
  }

  componentWillMount() {
    if (typeof window == 'undefined') return
    //初始化默认的 filters
    this.produceQuery()
  }

  produceQuery(params) {
    if (!params) params = this.props.location.params || {}

    if (!Reflect.has(params, 'sort_by')) params.sort_by = 'sort'

    let newParams = {}

    let whiteList = {
      sort_by: s => s,
      recommend: s => true,
      type: s => s,
      page_number: s => parseInt(s),
      page_size: s => parseInt(s)
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
    for (let i in params) arr.push(i+'='+params[i])
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

    const { filters, params } = this.state
    const { type, sort_by, recommend } = params

    return(<div>

      <Meta meta={{
        title: '话题'
        }} />

      <div>
        <div className="row">
          <h1 className="col-10" data-toggle="collapse" href="#collapseFrom">话题</h1>
          <div className="col-2">
            <Link className="btn btn-primary" to="/add-topic">添加</Link>
          </div>
        </div>

        <form className="form collapse" onSubmit={this.submit} id="collapseFrom">

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">类型</label>
            <div className="col-sm-10">
              <select className="form-control" onChange={e=>this.valueOnChange(e, 'type')} defaultValue={type}>
                <option value="">全部</option>
                <option value="parent">父分类</option>
                <option value="child">子分类</option>
              </select>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">排序</label>
            <div className="col-sm-10">
              <select className="form-control" onChange={e=>this.valueOnChange(e, 'sort_by')} defaultValue={sort_by}>
                <option value="sort">按排序字段排序</option>
                <option value="sort_by_date">按排序日期</option>
                <option value="create_at">按创建日期</option>
              </select>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label">推荐</label>
            <div className="col-sm-10">
              <select className="form-control" onChange={e=>this.valueOnChange(e, 'recommend')} defaultValue={recommend}>
                <option value="">全部</option>
                <option value="true">推荐</option>
                <option value="false">未推荐</option>
              </select>
            </div>
          </div>

          <div className="form-group row">
            <label className="col-sm-2 col-form-label"></label>
            <div className="col-sm-10">
              <button type="submit" className="btn btn-primary">搜索</button>
            </div>
          </div>

        </form>

        <TopicList
          name={this.props.location.pathname + this.props.location.search}
          filters={{
            variables: params
          }}
          />
      </div>

    </div>)
  }

}

export default Shell(Topics)
