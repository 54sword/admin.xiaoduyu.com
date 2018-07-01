import React from 'react'
import { Link } from 'react-router-dom'

import Shell from '../shell'
import PeopleList from '../../components/people/list'
import Meta from '../../components/meta'
import Modal from '../../components/bootstrap/modal'

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
    const { location } = this.props

    return(<div>

      <Meta meta={{ title: '用户' }} />

      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center mt-3 mb-2">
        <h2>用户</h2>
        <div className="btn-toolbar mb-2 mb-md-0">
          <button type="button" className="btn btn-primary btn-sm ml-2" data-toggle="modal" data-target="#PeopleModal">筛选</button>
          {location.search ? <Link className="btn btn-primary btn-sm ml-2" to="/peoples">清空筛选条件</Link> : null}
        </div>
      </div>

      <Modal
        id="PeopleModal"
        title="用户筛选"
        body={(
          <div className="form">

            <div className="form-group row">
              <label className="col-sm-2 col-form-label">排序</label>
              <div className="col-sm-10">
                <select className="form-control" onChange={e=>this.valueOnChange(e, 'sort_by')} defaultValue={sort_by}>
                  <option value="last_sign_at">最近登录日期</option>
                  <option value="create_at">创建日期</option>
                  <option value="last_sign_at">最近登录</option>
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

          </div>
        )}
        footer={(
          <button type="submit" className="btn btn-primary" data-dismiss="modal" onClick={this.submit}>提交</button>
        )}
        />

      <PeopleList
        name={this.props.location.pathname + this.props.location.search}
        location={location}
        filters={{
          variables: params
        }}
        />
    </div>)
  }

}

export default Shell(People)
