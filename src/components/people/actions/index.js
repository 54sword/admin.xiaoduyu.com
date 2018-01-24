import React, { Component } from 'react'
// import { Link } from 'react-router-dom'

// import CSSModules from 'react-css-modules'
// import styles from './style.scss'

import { updatePeople } from '../../../actions/people'
import connectRedux from '../../../common/connect-redux'

class PeopleActions extends Component {

  static mapDispatchToProps = { updatePeople }

  constructor(props) {
    super(props)
    this.updatePeople = this.updatePeople.bind(this)
  }

  updatePeople(e, data) {

    // this.stopPropagation(e)
    const { people, updatePeople } = this.props
    updatePeople({
      query: {
        _id: people._id
      },
      update: data
    })
  }

  render () {

    const { people } = this.props
    const updatePeople = (data) => e => this.updatePeople(e, data)

    let time = new Date(people.banned_to_post).getTime() - new Date().getTime()
    if (time > 0) {
      time = parseInt(time / (1000 * 60))
    } else if (time < 0) {
      time = 0
    }

    return (<div>
      <div>
        <a href="javascript:void(0)"
          onClick={updatePeople({
            banned_to_post: time ? new Date().getTime() : new Date().getTime() + 1000*60*60*24*3
          })}>
           {time ? '已禁言 ' + time + '分钟' : '禁言'}
        </a>
      </div>
      <div>
        <a href="javascript:void(0)" onClick={updatePeople({ blocked: people.blocked ? false : true })}>{people.blocked ? '已拉黑' : '拉黑'}</a>
      </div>
    </div>)


  }

}

// PeopleActions = CSSModules(PeopleActions, styles)

export default connectRedux(PeopleActions)
