import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'

// 连接redux
const connectReudx = (Component) => {

  if (!Component.mapStateToProps && !Component.mapDispatchToProps) return Component


  const mapStateToProps = Component.mapStateToProps || function(){return{}}
  const mapDispatchToProps = Component.mapDispatchToProps || {}

  // if (Component.mapStateToProps && Component.actions ) {

    Component = connect(mapStateToProps,
      (dispatch)=>{

        let actions = {}

        for (let i in mapDispatchToProps) {
          actions[i] = bindActionCreators(mapDispatchToProps[i], dispatch)
        }

        return actions

      })(Component)
  // }

  return Component
}

export default connectReudx
