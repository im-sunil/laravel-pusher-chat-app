import React ,{Component} from 'react';
import ReactDOM from 'react-dom';
 
import Infinite from "react-infinite";
class ListItem  extends Component{
   
    constructor(props) {
        super(props);
        this.state = {};
    }
    
    render() {
        return <div className="infinite-list-item" style={
            {
                height: this.props.height,
                lineHeight: this.props.lineHeight,
                overflow: 'scroll'
            }
        }>
            <div style={{height: 50}}>
            List Item {this.props.index}
            </div>
        </div>;
    }
}


 ListItem.defaultProps = {
  height: 50,
  lineHeight: "50px"
};
class InfiniteList extends Component {
    constructor(props) {
        super(props); 
        this.state = {
            elements: [],
            isInfiniteLoading: false
        };
    }
    

    componentDidMount() {
      
      setInterval( () => {
        var elemLength = this.state.elements.length,
            newElements = this.buildElements(elemLength, elemLength + 1);
        this.setState({
            elements: this.state.elements.concat(newElements)
        });
      }, 500);
    }

    buildElements (start, end) {
        var elements = [];
        for (var i = start; i < end; i++) {
            elements.push(<ListItem key={i} index={i}/>)
        }
        return elements;
    }

    handleInfiniteLoad() {
        var that = this;
        this.setState({
            isInfiniteLoading: true
        });
        setTimeout( () => {
            var elemLength = this.state.elements.length,
                newElements = this.buildElements(elemLength, elemLength + 20);
            this.setState({
                isInfiniteLoading: false,
                elements: newElements.concat(this.state.elements)
            });
        }, 2000);
    }

   
    render() {
        return <Infinite elementHeight={51}
                         containerHeight={window.innerHeight}
                         infiniteLoadBeginEdgeOffset={300}
                         onInfiniteLoad={ this.handleInfiniteLoad.bind(this)}
                         loadingSpinnerDelegate={<div className="loader">Loading ...</div>}
                         isInfiniteLoading={this.state.isInfiniteLoading}
                         timeScrollStateLastsForAfterUserScrolls={1000}
                         displayBottomUpwards
                         >
                    {this.state.elements}
                </Infinite>;
    }
} 

export default InfiniteList;
 