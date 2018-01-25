import React, { Component } from 'react'
import CSSModules from 'react-css-modules'
import styles from './style.scss'

class ListLoading extends React.PureComponent {

  static defaultProps = {
    loading: false,
    more: false,
    handleLoad: ()=>{}
  }

  // constructor(props) {
  //   super(props)
  // }

  render () {

    const { loading, more, handleLoad } = this.props

    let dom

    if (loading && more) {
      dom = <div styleName="ball-pulse-sync"><div></div><div></div><div></div></div>
      // dom = <span styleName="loading">正在加载...</span>
    } else if (!loading && more) {
      dom = <a href="javascript:void(0)" styleName="more" onClick={handleLoad}>点击加载更多</a>
    } else if (!more) {
      return (<span></span>)
    }

    return (<div styleName="box">{dom}</div>)
  }

}

ListLoading = CSSModules(ListLoading, styles)

export default ListLoading
