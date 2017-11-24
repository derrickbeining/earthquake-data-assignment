import React, {Component} from 'react';
import Popover from 'react-popover';
import Button from './Button';
import Icon from './Icon';

// --------------------- HELPER(S) -----------------------
// allows Popover's props to specify what the trigger element should be
const createTriggerMap = (props, triggerOwner) => {
  const commonProps = {
    className: props.triggerClassName,
    onClick: triggerOwner.togglePopover,
    style: props.style,
  };

  const iconProps = {
    icon: props.icon,
    height: props.height,
    width: props.width,
  };

  return ({
    button: (<Button {...commonProps}>
              {props.btnText}
            </Button>),

    icon:   (<Icon {...commonProps} {...iconProps} />),
  });
}

// --------------------- CUSTOM POPOVER -----------------------

class CustomPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverIsOpen: false,
      preferPlace: null,
      place: null
    };

    this.togglePopover = this.togglePopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
    // methods need to be bound before map is created
    this.triggerMap = createTriggerMap(props, this);
  }

  togglePopover() {
    this.setState(prevState => ({
      popoverIsOpen: !prevState.popoverIsOpen
    }));
  }

  closePopover() {
    this.setState({
      popoverIsOpen: false
    })
  }

  render() {
    const popoverProps = {
      isOpen: this.state.popoverIsOpen,
      preferPlace: this.props.preferPlace || 'column',
      place: this.props.place || null,
      onOuterAction: this.closePopover,
      body: this.props.children
    }

    return (
      <Popover {...popoverProps}>
        {this.triggerMap[this.props.triggerType]}
      </Popover>
    );
  }
}

export default CustomPopover;
