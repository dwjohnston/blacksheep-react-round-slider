# blacksheep-react-round-slider

This is totally just taken from here: https://codepen.io/anthonydugois/pen/jqEMPZ




## Installation

```
npm install --save blacksheep-react-round-slider
```

## Usage

```
import Slider from "blacksheep-react-round-slider"

class Root extends Component {
  state = { value: .6 };

  handleChange = (x, y) => {
    this.setState({ value: y })
  };

  render() {
    return (
      <div>
        <Slider
          radius={ 140 }
          border={ 70 }
          value={ this.state.value }
          onChange={ this.handleChange } />

        <p>{ this.state.value.toFixed(2) }</p>
      </div>
    )
  }
}

```
