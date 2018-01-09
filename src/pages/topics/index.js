import React from 'react'
import { Link } from 'react-router-dom'

// import PropTypes from 'prop-types'
// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'
// import { update } from '../../actions/account'

import Shell from '../shell'
import TopicList from '../../components/topic/list'


// 纯组件
export class Topics extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      timestamp: new Date().getTime(),
      filters: {
        options: {
          sort: { sort: - 1 }
        }
      },
      params: {
        sortBy: 'sort'
      }
    }
    this.submit = this.submit.bind(this)
    this.valueOnChange = this.valueOnChange.bind(this)
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

    let filters = {
      query: {},
      select: {},
      options: {
        sort: {}
      }
    }

    let { params } = this.state

    for (let i in params) {
      switch (i) {
        case 'sortBy':
          filters.options.sort[params[i]] = -1;
          break
        case 'type':
          filters.query['parent_id'] = {}
          filters.query['parent_id']['$exists'] = params[i] == 'true' ? true : false;
          break
        // case 'status': filters.query[params[i]] = true; break
        // case 'startDate': filters.query.lte_create_at = params[i]; break
        // case 'endDate': filters.query.gte_create_at = params[i]; break
        default: filters.query[i] = params[i]
      }
    }

    // console.log(filters);

    this.setState({ filters, timestamp: new Date().getTime() })

    return false
  }

  render() {

    const { filters, timestamp  } = this.state
    const { type, sortBy } = this.state.params

    console.log(filters);

    return(<div>

      <div>
        <h1>话题</h1>
        <Link to="/edit-topic">添加</Link>

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
              <select onChange={e=>this.valueOnChange(e, 'sortBy')} defaultValue={sortBy}>
                <option value="sort">按排序字段排序</option>
                <option value="sort_by_date">按排序日期</option>
                <option value="create_at">按创建日期</option>
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
          name="topics"
          filters={filters}
          timestamp={timestamp}
          />
      </div>
    </div>)
  }

}

// Topics = CSSModules(Topics, styles)
//
// Topics.propTypes = {
//   update: PropTypes.func.isRequired
// }
//
// const mapStateToProps = (state, props) => {
//   return {
//   }
// }
//
// const mapDispatchToProps = (dispatch) => {
//   return {
//     update: bindActionCreators(update, dispatch)
//   }
// }
//
// Topics = connect(mapStateToProps,mapDispatchToProps)(Topics)


export default Shell(Topics)
