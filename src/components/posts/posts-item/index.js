import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import { Link } from 'react-router-dom'

// import { DateDiff } from '../../common/date'
import { updatePosts } from '../../../actions/posts'
import connectReudx from '../../../common/connect-redux'

// sass
import CSSModules from 'react-css-modules'
import styles from './style.scss'

// import FollowPosts from '../follow-posts'
// import CommentItem from '../comment-item'
import PostsAdminAction from '../../posts/admin-action'

import Keydown from '../../../common/keydown'

export class PostsItem extends PureComponent {

  static mapDispatchToProps = { updatePosts }

  constructor(props) {
    super(props)
    this.clickPostsItem = this.clickPostsItem.bind(this)
    this.updatePosts = this.updatePosts.bind(this)
  }

  stopPropagation(e) {
    e.stopPropagation()
  }

  updatePosts(e, data) {
    this.stopPropagation(e)
    const { posts, updatePosts } = this.props
    updatePosts({ id: posts._id, data })
  }

  clickPostsItem(e) {

    const { posts } = this.props

    let keyList = Keydown.getKeyList()

    if (keyList.indexOf(91) != -1) {
      window.open(`/posts/${posts._id}`)
    } else {
      this.refs.title.handleClick(e)
    }
  }

  render () {

    const { posts, displayFollow, displayDate, displayTopic, commentOption } = this.props

    let background = '#fff'

    if (posts.recommend) background = 'rgb(212, 255, 224)'
    if (posts.weaken) background = '#efefef'
    if (posts.deleted) background = '#ffe3e3'

    return (<div>
      <table styleName="item" className="table" style={{backgroundColor:background}}>
      <tbody>

      <tr>
        {/* posts */}
        <td style={{width:'80%'}} onClick={this.clickPostsItem}>
          <div styleName="head">
            {typeof posts.user_id == 'object' ?
              <div styleName="info">
                <span>
                  <Link to={`/people/${posts.user_id._id}`} onClick={this.stopPropagation}>
                    <i
                      styleName="avatar"
                      className="load-demand"
                      data-load-demand={`<img src="${posts.user_id.avatar_url}" />`}>
                      </i>
                    <b>{posts.user_id.nickname}</b>
                  </Link>
                </span>
                <div>
                  {displayTopic ? <span><Link to={`/topics/${posts.topic_id._id}`} onClick={this.stopPropagation}>{posts.topic_id.name}</Link></span> : null}
                  {posts.view_count ? <span>{posts.view_count}次浏览</span> : null}
                  {posts.like_count ? <span>{posts.like_count} 个赞</span> : null}
                  {posts.follow_count ? <span>{posts.follow_count}人关注</span> : null}
                  {displayDate ? <span>{posts._create_at}</span> : null}
                </div>
              </div>
              : null}
          </div>

          <div styleName="title">
            <Link ref="title" to={`/posts/${posts._id}`} onClick={this.stopPropagation}>{posts.title}</Link>
          </div>

          <div styleName="content">{posts.content_summary}</div>

          <div>{posts.ip}</div>
        </td>
        {/* posts end */}

        {/* action */}
        <td style={{width:'20%'}} styleName="actions">
          <PostsAdminAction posts={posts} />
        </td>
        {/* action end */}

      </tr>

      </tbody>

    </table></div>)
  }

}

PostsItem.defaultProps = {
  posts: PropTypes.object.isRequired,
  displayFollow: false,
  displayDate: true,
  displayTopic: true,
  commentOption: {}
}

PostsItem = CSSModules(PostsItem, styles)

PostsItem = connectReudx(PostsItem)

export default PostsItem