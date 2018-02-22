import React from 'react'
import { Link } from 'react-router-dom'

import Shell from '../shell'
import TopicList from '../../components/topic/list'
import Meta from '../../components/meta'
import Modal from '../../components/bootstrap/modal'

export class Topics extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
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

    const { params } = this.state
    const { type, sort_by, recommend } = params
    const { location } = this.props

    return (<div>
      <Meta meta={{ title: '话题' }} />

      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mt-3 mb-2">
        <h2>话题</h2>
        <div className="btn-toolbar mb-2 mb-md-0">
          <Link className="btn btn-primary btn-sm" to="/add-topic">添加</Link>
          <button type="button" className="btn btn-primary btn-sm ml-2" data-toggle="modal" data-target="#TopicModal">筛选</button>
          {location.search ? <Link className="btn btn-primary btn-sm ml-2" to="/topics">清空筛选条件</Link> : null}
        </div>
      </div>

      <Modal
        id="TopicModal"
        title="话题筛选"
        body={(

          <div className="form">

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

          </div>

        )}
        footer={(
          <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={this.submit}>提交</button>
        )}
        />

        <TopicList
          name={this.props.location.pathname + this.props.location.search}
          location={this.props.location}
          filters={{
            variables: params
          }}
          />

    </div>)
  }

}

export default Shell(Topics)
