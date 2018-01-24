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
      sql: {},
      params: {}
    }
    this.submit = this.submit.bind(this)
    this.createSQL = this.createSQL.bind(this)

    this.createSQL()
  }

  createSQL() {

    // sql 默认值
    let sql = {
      query: {},
      select: {
        user_id:1,
        posts_id:1,
        parent_id:1,
        reply_id:1,
        _id:1,
        weaken:1,
        verify:1,
        deleted:1,
        blocked:1,
        ip:1,
        device:1,
        like_count:1,
        reply_count:1,
        create_at:1,
        content_html:1,
        recommend: 1
      },
      options: {
        sort: { create_at: -1 }
      }
    }

    let { params } = this.state

    for (let i in params) {
      switch (i) {
        // case 'sortBy': sql.options.sort[params[i]] = -1; break
        case 'status': sql.query[params[i]] = true; break
        case 'startDate':
          if (!sql.query.create_at) sql.query.create_at = {}
          sql.query.create_at['$lte'] = params[i]
          break
        case 'endDate':
          if (!sql.query.create_at) sql.query.create_at = {}
          sql.query.create_at['$gte'] = params[i]
          // sql.query.gte_create_at = params[i];
          break
        default: sql.query[i] = params[i]
      }
    }

    this.state.sql = sql

    // this.setState({ sql, timestamp: new Date().getTime() })
  }

  submit(event) {
    if (event) event.preventDefault()

    this.createSQL()
    this.setState({ timestamp: new Date().getTime() })
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
    
    const { sql, timestamp, params } = this.state
    const { status, topic_id } = params

    // console.log(sql);

    return(<div>
      <h1>评论</h1>

      <form className="form" onSubmit={this.submit}>

      {/*
      <div className="flex-left units-gap">
        <label className="unit-0 text-right" style={{width:'85px'}}>排序</label>
        <div className="unit">
          <select onChange={e=>this.valueOnChange(e, 'sortBy')} defaultValue={sortBy}>
            <option value="sort_by_date">按排序日期</option>
            <option value="create_at">按创建日期</option>
          </select>
        </div>
      </div>
      */}

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
          <input type="text" placeholder="请输入id" onChange={e=>this.valueOnChange(e, '_id')} />
        </div>
      </div>

      <div className="flex-left units-gap">
        <label className="unit-0 text-right" style={{width:'85px'}}>日期筛选</label>
        <div className="unit">
          <input ref="startDate" type="text" placeholder="创建日期小于该日期（如：2018/01/01）" onChange={e=>this.valueOnChange(e, 'startDate')} />
          <input ref="endDate" type="text" placeholder="创建日期大于该日期（如：2018/01/01）" onChange={e=>this.valueOnChange(e, 'endDate')} />
        </div>
      </div>

      <div className="flex-left units-gap">
        <label className="unit-0 text-right" style={{width:'85px'}}>用户ID</label>
        <div className="unit">
          <input type="text" placeholder="请输入用户的id" onChange={e=>this.valueOnChange(e, 'user_id')} />
        </div>
      </div>

      <div className="flex-left units-gap">
        <label className="unit-0 text-right" style={{width:'85px'}}>帖子ID</label>
        <div className="unit">
          <input type="text" placeholder="请输入帖子的id" onChange={e=>this.valueOnChange(e, 'posts_id')} />
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
        name="home"
        timestamp={timestamp}
        sql={sql}
        />
    </div>)
  }

}

Comment = CSSModules(Comment, styles)

export default Shell(Comment)
