import React, { Component, PureComponent } from 'react'
import PropTypes from 'prop-types'
import { browserHistory } from 'react-router'
import { Link } from 'react-router-dom'

// import { DateDiff } from '../../common/date'
import { updatePosts } from '../../actions/posts'
import connectReudx from '../../common/connect-redux'

// sass
import CSSModules from 'react-css-modules'
import styles from './style.scss'

// import FollowPosts from '../follow-posts'
// import CommentItem from '../comment-item'

import Keydown from '../../common/keydown'

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

    return (<div style={{backgroundColor:background}}>
      <table styleName="item">
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
                  {displayDate ? <span>{posts.sort_by_date}</span> : null}
                </div>
              </div>
              : null}
          </div>

          <div styleName="title">
            <Link ref="title" to={`/posts/${posts._id}`} onClick={this.stopPropagation}>{posts.title}</Link>
          </div>

          <div styleName="content">{posts.content_summary}</div>
        </td>
        {/* posts end */}

        {/* action */}
        <td style={{width:'20%'}}>
          <ul>
            <li>
              <a href="javascript:void(0)" onClick={(e)=>this.updatePosts(e, { weaken:posts.weaken ? false : true })}>
                {posts.weaken ? '已被弱化' : '弱化'}
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" onClick={(e)=>this.updatePosts(e, { recommend:posts.recommend ? false : true })}>
                {posts.recommend ? '已被推荐' : '推荐'}
              </a>
            </li>
            <li>
              <a href="javascript:void(0)" onClick={(e)=>this.updatePosts(e, { deleted:posts.deleted ? false : true })}>
                {posts.deleted ? '已被删除' : '删除'}
              </a>
            </li>
            <li>
              <a href="javascript:void(0)"
                onClick={(e)=>this.updatePosts(e, { sort_by_date: new Date().getTime() })}>排前
              </a>
            </li>
            <li>
              <a href="javascript:void(0)"
                onClick={(e)=>this.updatePosts(e, { sort_by_date: new Date(new Date(posts.sort_by_date).getTime() - 1000*60*60*24*3).getTime() }) }>排后
              </a>
            </li>
          </ul>
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
