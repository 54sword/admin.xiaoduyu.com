import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// 连接redux
const connectReudx = (Component) => {

  if (Component.mapStateToProps && Component.actions ) {

    Component = connect(Component.mapStateToProps,
      (dispatch)=>{

        let actions = {}

        for (let i in Component.actions) {
          actions[i] = bindActionCreators(Component.actions[i], dispatch)
        }

        return actions

      })(Component)
  }

  return Component
}

export default connectReudx
