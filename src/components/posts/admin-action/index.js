import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
// import { browserHistory } from 'react-router'
import { Link } from 'react-router-dom'

import { updatePosts } from '../../../actions/posts'
import connectReudx from '../../../common/connect-redux'

export class PostsAdminAction extends Component {

  static mapDispatchToProps = { updatePosts }

  constructor(props) {
    super(props)
    this.updatePosts = this.updatePosts.bind(this)
  }

  // stopPropagation(e) {
  //   e.stopPropagation()
  // }

  updatePosts(e, data) {
    const { posts, updatePosts } = this.props
    data._id = posts._id


    console.log(data);

    updatePosts(data)
  }

  render () {
    const { posts } = this.props
    const updatePosts = (data) => e => this.updatePosts(e, data)

    return [
      <a
        key="1"
        href="javascript:void(0)"
        onClick={updatePosts({ weaken: posts.weaken ? false : true })}>
        {posts.weaken ? '已被弱化' : '弱化'}
      </a>,
      <a
        key="2"
        href="javascript:void(0)"
        onClick={updatePosts({ recommend: posts.recommend ? false : true })}>
        {posts.recommend ? '已被推荐' : '推荐'}
      </a>,
      <a
        key="3"
        href="javascript:void(0)"
        onClick={updatePosts({ deleted: posts.deleted ? false : true })}>
        {posts.deleted ? '已被删除' : '删除'}
      </a>,
      <a
        key="4"
        href="javascript:void(0)"
        onClick={updatePosts({ sort_by_date: new Date().getTime() })}>
        排前{posts._sort_by_date ? ` (${posts._sort_by_date})` : ''}
      </a>,
      <a
        key="5"
        href="javascript:void(0)"
        onClick={updatePosts({
          sort_by_date: new Date(new Date(posts.sort_by_date).getTime() - 1000*60*60*24*1).getTime() })
        }>
        排后{posts._sort_by_date ? ` (${posts._sort_by_date})` : ''}
      </a>
    ]
  }

}

PostsAdminAction.defaultProps = {
  posts: PropTypes.object.isRequired
}

PostsAdminAction = connectReudx(PostsAdminAction)

export default PostsAdminAction
