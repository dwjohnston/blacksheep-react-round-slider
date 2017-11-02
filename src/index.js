import React from 'react';

import "./style/baseStyle.scss";

var _ = require('lodash');


var PropTypes = React.PropTypes;

function getPageX(e) {
  return (e.pageX? e.pageX : e.changedTouches[0].pageX);
}

function getPageY(e) {
  return (e.pageY? e.pageY : e.changedTouches[0].pageY);
}



/**
The slider container is where we will wrap the raw slider, and apply:
:: range adjustment
:: log adjustment
:: step granularity
:: labels

*/
class RoundSlider extends React.Component {

  //From rawValue to actual
  adjustValue(v) {

    var scale = (this.props.max - this.props.min);

    var adjustedValue = this.props.min + v * scale;


    let step = 1/this.props.step;
    adjustedValue = _.round(adjustedValue * step)/step;



    return adjustedValue;
  }


  //From actual back to raw
  unadjustValue(av) {


    var scale = (this.props.max - this.props.min);
    var v = (av - this.props.min)/scale;

    return v;




  }

  handleChange = (x, y) => {

    let adjustedValue = this.adjustValue(y);
    this.setState({rawValue: y, adjustedValue: adjustedValue});
    this.props.onChange(adjustedValue);

  };

  componentWillMount() {


    this.setState({rawValue: this.unadjustValue(this.props.value), adjustedValue: this.props.value});
  }

  render() {
    return (
      <div
        className = "round-slider-container">
        <div className ="label">{this.props.label}</div>
        <Slider
          radius={200}
          border= {100}
          value={ this.unadjustValue(this.props.value)}
          onChange={ this.handleChange } />

        <div className ="value">{this.state.adjustedValue}</div>
      </div>
    )
  }
}


/***
This slider object contains a value between 0 and 1
*/
class Slider extends React.Component {
  state = { isPinching: false };

  componentDidMount() {
    this.x = 0
    this.y = 0
    document.addEventListener("touchmove", this.handleMouseMove)
    document.addEventListener("touchend", this.handleMouseUp)
    document.addEventListener('mousemove', this.handleMouseMove)
    document.addEventListener('mouseup', this.handleMouseUp)
  }

  componentWillUnmount() {

    document.removeEventListener("touchmove", this.handleMouseMove)
    document.removeEventListener("touchend", this.handleMouseUp)
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mouseup', this.handleMouseUp)
  }



  handleMouseUp = () => {
    this.setState({ isPinching: false })
  };

  handleMouseDown = (e) => {
    e.preventDefault()

    const { left, top, width, height } = this.potar.getBoundingClientRect()

    this.x =  getPageX(e)- (left + width / 2)
    this.y = (top + height / 2) - getPageY(e)

    this.setState({ isPinching: true })
  };




  handleMouseMove = (e) => {
    if (this.state.isPinching) {
      const { left, top, width, height } = this.potar.getBoundingClientRect()

      const x = getPageX(e) - (left + width / 2)
      const y = (top + height / 2) - getPageY(e);

      const dx = (x - this.x) / 100
      const dy = (y - this.y) / 100

      this.x = x
      this.y = y

      if (this.props.onChange) {
        let xValue = this.props.value + dx
        let yValue = this.props.value + dy

        if (xValue < 0) {
          xValue = 0
        }

        if (xValue > 1) {
          xValue = 1
        }

        if (yValue < 0) {
          yValue = 0
        }

        if (yValue > 1) {
          yValue = 1
        }

        this.props.onChange(xValue, yValue)
      }
    }
  };

  render() {
    const { radius, border, value } = this.props
    const p = 2 * Math.PI * (radius - border / 2)

    const strokeWidth = border
    const strokeDashoffset = p * (1 - value)
    const strokeDasharray = p

    return (

      <div>
        <svg
          className='Slider'
          ref={ (potar) => this.potar = potar }
          viewBox={ `0 0 ${ radius * 2 } ${ radius * 2 }` }
          onMouseDown={ this.handleMouseDown }
          onTouchStart= { this.handleMouseDown }>
          <circle
            className='Slider-circle'
            style={{ strokeWidth }}
            r={ radius - border / 2 }
            cx={ radius }
            cy={ radius } />

          <circle
            className='Slider-bar'
            style={{
              strokeWidth,
              strokeDashoffset,
              strokeDasharray
            }}
            r={ radius - border / 2 }
            cx={ radius }
            cy={ radius } />
        </svg>

      </div>
    )
  }
}

Slider.defaultProps = {
  radius: 100,
  border: 50,
  value: .5
}

Slider.propTypes = {
  onChange: PropTypes.func,
  radius: PropTypes.number,
  border: PropTypes.number,
  value: (props, propName) => {
    const value = parseInt(props[propName])

    if (isNaN(value)) {
      return new Error('The potar value must be a number.')
    }

    if (value < 0 || value > 1) {
      return new Error('The potar value must be between 0 and 1.')
    }
  }
}


Slider.defaultProps = {
  radius: 50,
  border: 30,
  value: .5,
}

Slider.propTypes = {
  onChange: React.PropTypes.func,
  radius: React.PropTypes.number,
  border: React.PropTypes.number,
  value: (props, propName) => {
    const value = parseInt(props[propName])

    if (isNaN(value)) {
      return new Error("The potar value must be a number.")
    }

    if (value < 0 || value > 1) {
      return new Error("The potar value must be between 0 and 1.")
    }
  },
}

export default RoundSlider;
