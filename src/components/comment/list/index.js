import React, { Component } from 'react'
import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
// import { Link } from 'react-router-dom'

import styles from './style.scss'

// import arriveFooter from '../../../common/arrive-footer'

// import { bindActionCreators } from 'redux'
// import { connect } from 'react-redux'

import { getCommentListByName } from '../../../reducers/comment'
import { loadCommentList } from '../../../actions/comment'

// import ListLoading from '../list-loading'
import CommentItem from '../list-item'

import connectReudx from '../../../common/connect-redux'

export class CommentList extends Component {

  static mapStateToProps = (state, props) => {
    const name = props.name
    return {
      commentList: getCommentListByName(state, name)
    }
  }

  static mapDispatchToProps = { loadCommentList }

  constructor(props) {
    super(props)

    const { name, filters } = this.props

    this.state = {
      name: name,
      filters: filters
    }
    this.triggerLoad = this.triggerLoad.bind(this)
  }

  componentDidMount() {

    // console.log('21333');

    const self = this
    const { loadCommentList, commentList } = this.props

    if (!commentList.data || commentList.data.length == 0) {
      self.triggerLoad()
    }

    // arriveFooter.add(this.state.name, ()=>{
    //   self.triggerLoad()
    // })

  }

  componentWillUnmount() {
    // arriveFooter.remove(this.state.name)
  }

  triggerLoad(callback) {
    const { loadCommentList } = this.props
    const { name, filters } = this.state
    loadCommentList({ name, filters })
  }

  render () {

    let { commentList } = this.props

    console.log(commentList);

    if (!commentList.data) return (<div></div>)

    // if (!commentList.data) {
      // return (<div className={styles.loading}>加载中...</div>)
    // }

    return (
      <div>
        <div className="container">
          <div className={styles.comments}>
            {commentList.data.map((comment)=>{
              return (<div key={comment._id}><CommentItem comment={comment} /></div>)
            })}
            {/*commentList.data.length == 0 ?
              null
            : <ListLoading
                loading={commentList.loading}
                more={commentList.more}
                handleLoad={this.triggerLoad}
                />*/}
          </div>
          {/*<div className={styles.nothing}>目前尚无回复</div>*/}

        </div>
      </div>
    )
  }
}

CommentList.defaultProps = {
  name: PropTypes.string.isRequired,
  filters: PropTypes.object.isRequired
}

/*
CommentList.propTypes = {
  commentList: PropTypes.object.isRequired,
  loadCommentList: PropTypes.func.isRequired
}

function mapStateToProps(state, props) {
  const name = props.name
  return {
    commentList: getCommentListByName(state, name)
  }
}

function mapDispatchToProps(dispatch, props) {
  return {
    loadCommentList: bindActionCreators(loadCommentList, dispatch)
  }
}
*/

export default connectReudx(CommentList)
