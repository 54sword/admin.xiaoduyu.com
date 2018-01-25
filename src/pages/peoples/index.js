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
      filters: {},
      params: {}
    }
    this.submit = this.submit.bind(this)
    this.valueOnChange = this.valueOnChange.bind(this)
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
        case 'people_id':
          filters.query.user_id = params[i]
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
        case 'sort_by': arr.push('sort_by='+params[i]); break
        case 'status': arr.push('status='+params[i]); break
        case 'start_date': arr.push('start_date='+params[i]); break
        case 'end_date': arr.push('end_date='+params[i]); break
        case 'people_id': arr.push('people_id='+params[i]); break
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
    const { status, _id, start_date, end_date, sort_by } = params

    return(<div>

      <Meta meta={{
        title: '用户'
        }} />

      <div>
        <h1>用户</h1>

        <form className="form" onSubmit={this.submit}>

          <div className="flex-left units-gap">
            <label className="unit-0 text-right" style={{width:'85px'}}>排序</label>
            <div className="unit">

              <select onChange={e=>this.valueOnChange(e, 'sort_by')} defaultValue={sort_by}>
                <option value="last_sign_at">最近登录日期</option>
                <option value="create_at">创建日期</option>
              </select>
            </div>
          </div>

          <div className="flex-left units-gap">
            <label className="unit-0 text-right" style={{width:'85px'}}>状态</label>
            <div className="unit">
              <select onChange={e=>this.valueOnChange(e, 'status')} defaultValue={status}>
                <option value="">所有</option>
                <option value="blocked">拉黑</option>
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
            <label className="unit-0 text-right" style={{width:'85px'}}></label>
            <div className="unit">
              <button type="submit" className="btn btn-primary">搜索</button>
            </div>
          </div>

        </form>

      </div>
      <PeopleList
        name={this.props.location.pathname + this.props.location.search}
        filters={filters}
        />
    </div>)
  }

}

People = CSSModules(People, styles)

export default Shell(People)
