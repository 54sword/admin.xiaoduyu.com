import React, { Component } from 'react'
import PropTypes from 'prop-types'

// 依赖的外部功能
import connectReudx from '../../../common/connect-redux'

import { loadPostsList } from '../../../actions/posts'
import { getPostsListByName } from '../../../reducers/posts'

// 依赖组件
import PostsItem from '../../posts/posts-item'
import ListLoading from '../../list-loading'
import Pagination from '../../pagination'

export class PostsList extends Component {

  static propTypes = {
    // 列表名称
    name: PropTypes.string.isRequired,
    // 列表的筛选条件
    filters: PropTypes.object.isRequired,
    // 获取当前页的 pathname、search
    location: PropTypes.object.isRequired
  }

  static mapStateToProps = (state, props) => {
    const { name } = props
    return {
      postsList: getPostsListByName(state, name)
    }
  }

  static mapDispatchToProps = { loadPostsList }

  constructor(props) {
    super(props)
    this.loadDate = this.loadDate.bind(this)
  }

  componentDidMount() {
    const { postsList, loadPostsList, name } = this.props
    if (!postsList.data) this.loadDate()
    // ArriveFooter.add(name, this.loadDate)
  }

  componentWillUnmount() {
    const { name } = this.props
    // ArriveFooter.remove(name)
  }

  async loadDate() {
    const { name, filters, loadPostsList } = this.props
    await loadPostsList({ name, filters })
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      const { loadPostsList } = this.props
      loadPostsList({ name: props.name, filters: props.filters, restart: true })
    }
  }

  render () {

    const { postsList, location } = this.props
    const { data, loading, more, count, filters = {} } = postsList

    return (<div>

      <div className="list-group">
        {data && data.map(posts=>(<PostsItem key={posts._id} posts={posts} />))}
      </div>

      <ListLoading loading={loading} />

      <Pagination
        location={location}
        count={count || 0}
        pageSize={filters.page_size || 0}
        pageNumber={filters.page_number || 0}
        />

    </div>)
  }

}

export default connectReudx(PostsList)
