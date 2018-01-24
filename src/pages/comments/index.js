import React from 'react'
import CSSModules from 'react-css-modules'
import styles from './style.scss'

import Shell from '../shell'
import CommentList from '../../components/comment/list'
// import CommentItem from '../../components/comment/list-item-admin'

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
      select: {
        user_id:1, posts_id:1, parent_id:1, reply_id:1, _id:1, weaken:1, verify:1,
        deleted:1, blocked:1, ip:1, device:1, like_count:1, reply_count:1,
        create_at:1, content_html:1, recommend: 1
      },
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

  submit(event) {
    if (event) event.preventDefault()
    this.props.history.push(this.produceUrl())
    return false
  }

  valueOnChange(e, name) {
    if (e.target.value) {
      this.state.params[name] = e.target.value
    } else {
      delete this.state.params[name]
    }
  }

  render() {

    const { filters, params } = this.state
    const { status, topic_id, _id, start_date, end_date, people_id, posts_id } = params

    return(<div>
      <h1>评论</h1>

      <form className="form" onSubmit={this.submit}>
        
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
              defaultValue={people_id}
              onChange={e=>this.valueOnChange(e, 'people_id')}
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

      </form>

      <br /><br />

      <CommentList
        name={this.props.location.pathname + this.props.location.search}
        filters={filters}
        />
    </div>)
  }

}

Comment = CSSModules(Comment, styles)

export default Shell(Comment)
