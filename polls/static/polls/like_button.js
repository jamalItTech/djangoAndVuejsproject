'use strict';

const e = React.createElement;

class LikeButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = { liked: false, showDialog: false };
    this.handleClick = this.handleClick.bind(this);
    this.hideDialog = this.hideDialog.bind(this);
  }

  handleClick() {
    this.setState({ liked: true, showDialog: true });
  }

  hideDialog() {
    this.setState({ showDialog: false });
  }

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Like</button>
        {this.state.showDialog && (
          <div className="p-dialog p-component">
            <div className="p-dialog-content">Thank you for liking!</div>
            <div className="p-dialog-footer">
              <button className="p-button p-component p-button-text p-button-plain" onClick={this.hideDialog}>Close</button>
            </div>
          </div>
        )}
      </div>
    );
  }
}

const domContainer = document.querySelector('#like_button_container');
ReactDOM.render(<LikeButton />, domContainer);
