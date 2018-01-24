import React from 'react'
import { Link } from 'react-router-dom'

import Shell from '../shell'
import TopicList from '../../components/topic/list'


export class Topics extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      filters: {},
      params: {}
    }
    this.submit = this.submit.bind(this)
    this.valueOnChange = this.valueOnChange.bind(this)
    this.produceFilters = this.produceFilters.bind(this)
    this.produceUrl = this.produceUrl.bind(this)
  }

  componentWillMount() {
    if (typeof window == 'undefined') return
    //初始化默认的 filters
    this.produceFilters()
  }

  // 根据生成查询sql
  produceFilters(params) {

    if (!params) params = this.props.location.params || {}
    if (!Reflect.has(params, 'sort_by')) params.sort_by = 'sort'

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
        case 'type':
          filters.query['parent_id'] = {}
          filters.query['parent_id']['$exists'] = params[i] == 'true' ? true : false;
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
        case 'type': arr.push('type='+params[i]); break
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

    const { filters } = this.state
    const { type, sort_by, recommend } = this.state.params

    return(<div>

      <div>
        <h1>话题</h1>
        <Link to="/add-topic">添加</Link>

        <form className="form" onSubmit={this.submit}>

          <div className="flex-left units-gap">
            <label className="unit-0 text-right" style={{width:'85px'}}>类型</label>
            <div className="unit">
              <select onChange={e=>this.valueOnChange(e, 'type')} defaultValue={type}>
                <option value="">全部</option>
                <option value="false">父分类</option>
                <option value="true">子分类</option>
              </select>
            </div>
          </div>

          <div className="flex-left units-gap">
            <label className="unit-0 text-right" style={{width:'85px'}}>排序</label>
            <div className="unit">
              <select onChange={e=>this.valueOnChange(e, 'sort_by')} defaultValue={sort_by}>
                <option value="sort">按排序字段排序</option>
                <option value="sort_by_date">按排序日期</option>
                <option value="create_at">按创建日期</option>
              </select>
            </div>
          </div>

          <div className="flex-left units-gap">
            <label className="unit-0 text-right" style={{width:'85px'}}>推荐</label>
            <div className="unit">
              <select onChange={e=>this.valueOnChange(e, 'recommend')} defaultValue={recommend}>
                <option value="">全部</option>
                <option value="true">推荐</option>
                <option value="false">未推荐</option>
              </select>
            </div>
          </div>

          <div className="flex-left units-gap">
            <label className="unit-0 text-right" style={{width:'85px'}}></label>
            <div className="unit">
              <button type="submit" className="btn btn-primary">搜索</button>
            </div>
          </div>

        </form>

        <TopicList
          name={this.props.location.pathname + this.props.location.search}
          filters={filters}
          />
      </div>
    </div>)
  }

}

export default Shell(Topics)
