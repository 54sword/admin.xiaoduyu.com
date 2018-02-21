import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
// import { browserHistory } from 'react-router'
import { Link } from 'react-router-dom'

import PostsAdminAction from '../../posts/admin-action'

import CSSModules from 'react-css-modules'
import styles from './style.scss'

export class PostsItem extends PureComponent {

  static propTypes = {
    posts: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
  }

  render () {

    const { posts, key } = this.props

    let background = ''

    if (posts.recommend) background = 'list-group-item-success'
    if (posts.weaken) background = 'list-group-item-secondary'
    if (posts.deleted) background = 'list-group-item-danger'
    
    return (<div key={key} className={`list-group-item ${background}`}>
      <div className="row">
        <div className="col-sm-6">

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
                  <span><Link to={`/posts?topic_id=${posts.topic_id._id}`} onClick={this.stopPropagation}>{posts.topic_id.name}</Link></span>
                  {posts.view_count ? <span>{posts.view_count}次浏览</span> : null}
                  {posts.like_count ? <span>{posts.like_count} 个赞</span> : null}
                  {posts.follow_count ? <span>{posts.follow_count}人关注</span> : null}
                  <span>{posts._create_at}</span>
                </div>
              </div>
              : null}
          </div>

          <div styleName="title">
            <Link ref="title" to={`/posts/${posts._id}`} onClick={this.stopPropagation}>{posts.title}</Link>
          </div>

          <div styleName="content">{posts.content_summary}</div>


        </div>

        <div className="col-sm-3">{posts.ip}</div>

        <div className="col-sm-3 mt-2">
          <PostsAdminAction posts={posts} />
        </div>

      </div>
    </div>)

  }

}

PostsItem = CSSModules(PostsItem, styles)

export default PostsItem
