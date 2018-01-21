import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Link, browserHistory } from 'react-router-dom'
import CSSModules from 'react-css-modules'
import styles from './style.scss'

import HTMLText from '../../html-text'

class Item extends PureComponent {

  static propTypes = {
    comment: PropTypes.object.isRequired,
    showSign: PropTypes.func.isRequired,
    me: PropTypes.object.isRequired
  }

  static defaultProps = {
    summary: false,
    displayLike: true,
    displayReply: true,
    displayDate: true,
    displayEdit: true,
  }

  stopPropagation(e) {
    e.stopPropagation();
  }

  render() {

    let { me, showSign,
      comment, summary, displayLike, displayReply, displayDate, displayEdit
    } = this.props

    return (<div styleName="box">
      {/*me && !me.phone ? <BindingPhone show={(s)=>{ this.show = s; }} /> : null*/}
      {/* <CommentEditorModal show={(s)=>{ this.show = s; }} /> */}
      <div
        styleName={summary ? "click-item" : "item"}
        onClick={summary ? ()=>{ browserHistory.push(`/comment/${comment._id}`) } : null}
        >

          <div styleName="footer-action">
            {displayEdit && me._id == comment.user_id._id ? <span><Link to={`/edit-comment/${comment._id}`} onClick={this.stopPropagation}>编辑</Link></span> : null}
            {/*displayLike ? <span><LikeButton comment={!comment.parent_id ? comment : null} reply={comment.parent_id ? comment : null} /></span> : null*/}
            {displayReply ?
                (me._id ?
                  <span>
                    <a
                      href="javascript:void(0)"
                      onClick={()=>{
                        this.show({
                          posts_id: comment.posts_id && comment.posts_id._id ? comment.posts_id._id : comment.posts_id,
                          parent_id: comment.parent_id ? comment.parent_id : comment._id,
                          reply_id: comment._id,
                          reply: comment
                        })
                      }}>
                      回复
                    </a>
                      {/*
                      <Link
                        to={`/write-comment?posts_id=${comment.posts_id && comment.posts_id._id ? comment.posts_id._id : comment.posts_id}&parent_id=${comment.parent_id ? comment.parent_id : comment._id}&reply_id=${comment._id}`}
                        onClick={this.stopPropagation}>
                        回复</Link>
                      */}
                    </span>
                  : <span><a href="javascript:void(0)" onClick={showSign}>回复</a></span>)
              : null}
          </div>

          <div styleName="head">
            <span>
              <Link to={`/people/${comment.user_id._id}`} onClick={this.stopPropagation}>
                <i styleName="avatar" className="load-demand" data-load-demand={`<img src="${comment.user_id.avatar_url}" />`}></i>
                <b>{comment.user_id.nickname}</b>
              </Link>
              {comment.reply_id ? ` 回复了${comment.reply_id.user_id._id == comment.user_id._id ? '自己' : ' '}` : null}
              {comment.reply_id && comment.reply_id.user_id._id != comment.user_id._id ? <Link to={`/people/${comment.reply_id.user_id._id}`} onClick={this.stopPropagation}><b>{comment.reply_id.user_id.nickname}</b></Link> : null}
            </span>
            {displayDate ? <span>{comment._create_at}</span> : null}
            {comment.reply_count ? <span>{comment.reply_count}个回复</span> : null}
            {comment.like_count ? <span>{comment.like_count}个赞</span> : null}
          </div>

        <div styleName="detail">
          {summary ?
            <Link to={`/comment/${comment._id}`} onClick={this.stopPropagation}>
              {comment.content_summary}
              {/*comment.images && comment.images.length ?
                <div styleName="abstract-image">
                  {comment.images.map(image=>{
                    return (<div key={image} className="load-demand" data-load-demand={`<div style="background-image:url(${image}?imageMogr2/thumbnail/!200)"></div>`}></div>)
                  })}
                </div>
                : null*/}
            </Link> :
            <HTMLText content={comment.content_html} />}
        </div>

      </div>

      {comment.reply && comment.reply.length > 0 ?
        <div styleName="comment-list">
          {comment.reply && comment.reply.map(comment=>{
            let reply = that.renderItem({ comment, summary, me, displayLike, displayReply, displayDate, displayEdit })
            return (<div key={comment._id}>{reply}</div>)
          })}
          {comment.reply_count && comment.reply && comment.reply.length < comment.reply_count ?
            <div styleName="view-more-comment">
              <Link to={`/comment/${comment._id}`} onClick={this.stopPropagation}>还有 {comment.reply_count - comment.reply.length} 条回复，查看全部</Link>
            </div> : null}
        </div>
        : null}

    </div>)

    // console.log('1111');
    // return <div>123</div>
  }
}

Item = CSSModules(Item, styles)

export default Item
