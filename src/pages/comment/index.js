import React from 'react'
import CSSModules from 'react-css-modules'

import styles from './style.scss'

import Shell from '../shell'
import CommentList from '../../components/comment/list'


// 纯组件
export class Comment extends React.Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentWillMount() {
  }

  render() {
    return(<div>
      <h1>评论</h1>
      <CommentList name="home" filters={{}} />
    </div>)
  }

}

Comment = CSSModules(Comment, styles)

export default Shell(Comment)
