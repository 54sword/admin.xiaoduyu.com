import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

// import arriveFooter from '../../../common/arrive-footer'

import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { loadPeopleList } from '../../../actions/people'
import { getPeopleListByName } from '../../../reducers/people'

import PeopleItem from '../list-item'
import ListLoading from '../../list-loading'

export class PeopleList extends Component{

  constructor(props) {
    super(props)

    const { name, filters, type } = this.props

    this.state = {
      name: name,
      filters: filters,
      type: type // 关注 follow-people 或 粉丝 fans
    }

    this.triggerLoad = this._triggerLoad.bind(this)
  }

  componentDidMount() {

    const self = this
    const { peopleList } = this.props
    const { name, type } = this.state

    if (!peopleList.data) {
      self.triggerLoad()
    }

    ArriveFooter.add(name, ()=>{
      self.triggerLoad()
    })

  }

  componentWillUnmount() {
    const { name, type } = this.state
    ArriveFooter.remove(name)
  }

  componentWillReceiveProps(props) {
    if (props.name != this.props.name) {
      this.props = props
      const { name, filters, loadPeopleList } = props
      loadPeopleList({ name, filters, restart: true })
    }
  }

  _triggerLoad(callback) {
    const { loadPeopleList } = this.props
    const { name, filters } = this.state

    // const handle = type == 'follow-people' ? loadPeopleList : loadFans

    loadPeopleList({
      name: name,
      filters: filters,
      callback: (err, callback) => {
      }
    })

  }

  render () {

    let { peopleList, type } = this.props

    if (!peopleList.data) {
      return (<div></div>)
    }

    const { data, loading, more } = peopleList

    return (<div>
      {data.map(people=>{
        return (<div key={people._id}>
            <PeopleItem people={people} />
          </div>)
      })}

      <ListLoading loading={loading} more={more} handleLoad={this.triggerLoad} />
    </div>)

  }

}

PeopleList.propTypes = {
  loadPeopleList: PropTypes.func.isRequired,
  peopleList: PropTypes.object.isRequired
}

const mapStateToProps = (state, props) => {
  return {
    peopleList: getPeopleListByName(state, props.name)
  }
}

const mapDispatchToProps = (dispatch, props) => {
  return {
    loadPeopleList: bindActionCreators(loadPeopleList, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PeopleList)
