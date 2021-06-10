import React from "react";
import ReactDOM from 'react-dom';

interface MyProps {
    children: any,
    callback: () => any
}

interface MyState {
}

class Dropdown extends React.Component<MyProps, MyState> {

    componentDidMount() {
        document.addEventListener('click', this.handleClickOutside, true);
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, true);
    }

    handleClickOutside = (event: any) => {
        const domNode = ReactDOM.findDOMNode(this);
        if (!domNode || !domNode.contains(event.target)) {
            this.props.callback()
        }
    }

    render() {
        return <>{this.props.children}</>
    }
}

export default Dropdown