import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import arriveFooter from '../../../common/arrive-footer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadTopics } from '../../../actions/topic'
import { getTopicListByName } from '../../../reducers/topic'

import TopicItem from '../list-item'
import ListLoading from '../../list-loading'

import connectReudx from '../../../common/connect-redux'

export class TopicList extends Component {

  static mapStateToProps = (state, props) => {
    return {
      topicList: getTopicListByName(state, props.name)
    }
  }
  static mapDispatchToProps = { loadTopics }

  constructor(props) {
    super(props)
    this.state = {}
    this.triggerLoad = this._triggerLoad.bind(this)
  }

  componentDidMount() {

    // console.log(this);

    const self = this

    const { name, topicList } = this.props

    // console.log(name);
    // console.log(topicList);

    if (!topicList.data) {
      self.triggerLoad()
    }

    arriveFooter.add(name, ()=>{
      self.triggerLoad()
    })

  }

  componentWillUnmount() {
    const { name } = this.props
    arriveFooter.remove(name)
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      this.props = props

      const { name, filters, loadTopics } = props

      loadTopics({
        name,
        filters,
        restart: true
      })

    }
  }

  _triggerLoad(callback = ()=>{}) {
    const { name, filters, loadTopics } = this.props

    loadTopics({
      name,
      filters,
      callback
    })

  }

  render () {
    const { topicList } = this.props

    if (!topicList.data) {
      return (<div></div>)
    }

    return (<div>
      <ul>
        {topicList.data.map((topic, index) => {
          return(<li key={topic._id}><TopicItem topic={topic} /></li>)
        })}
        <ListLoading
          loading={topicList.loading}
          more={topicList.more}
          handleLoad={this.triggerLoad}
          />
      </ul>
    </div>)
  }

}

export default connectReudx(TopicList)
