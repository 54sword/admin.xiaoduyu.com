import React, { Component } from 'react'
import PropTypes from 'prop-types'

// import CSSModules from 'react-css-modules'
// import styles from './style.scss'

import { getCommentListByName } from '../../../reducers/comment'
import { loadCommentList } from '../../../actions/comment'

import ListLoading from '../../list-loading'
import CommentItem from '../list-item'

import connectReudx from '../../../common/connect-redux'

export class CommentList extends Component {

  static mapStateToProps = (state, props) => {
    const name = props.name
    return {
      list: getCommentListByName(state, name)
    }
  }

  static mapDispatchToProps = { loadCommentList }

  static propTypes = {
    // 在redux创建的名称
    name: PropTypes.string.isRequired,
    filters: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props)
    this.state = {}
    this.loadList = this.loadList.bind(this)
  }

  componentDidMount() {
    const { list } = this.props
    if (!list.data || list.data.length == 0) this.loadList()
    ArriveFooter.add(this.state.name, this.loadList)
  }

  componentWillUnmount() {
    ArriveFooter.remove(this.state.name)
  }

  loadList(callback) {
    const { name, filters, loadCommentList } = this.props
    loadCommentList({ name, filters: filters })
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      const { loadCommentList } = this.props
      loadCommentList({ name: props.name, filters: props.filters, restart: true })
    }
  }

  render () {

    let { list } = this.props

    if (!list.data) return null

    const { data, loading, more } = list

    return (
      <div>
        <div>
          {/* <div className={styles.comments}> */}
            {data.map((comment)=>{
              return (<div key={comment._id}><CommentItem comment={comment} /></div>)
            })}
            {/*commentList.data.length == 0 ?
              null
            : <ListLoading
                loading={commentList.loading}
                more={commentList.more}
                handleLoad={this.triggerLoad}
                />*/}
          {/*<div className={styles.nothing}>目前尚无回复</div>*/}

        {/* </div> */}
        </div>
        <ListLoading loading={loading} more={more} handleLoad={this.load} />
      </div>
    )
  }
}

// CommentList = CSSModules(CommentList, styles)

export default connectReudx(CommentList)
