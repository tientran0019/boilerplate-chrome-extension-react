import React, { Component } from 'react';
// import icon from 'src/assets/images/img.jpg';

class GreetingComponent extends Component {
	state = {
		name: 'dev',
	};

	render() {
		return (
			<div>
				<p>Hello, {this.state.name}!</p>
				<img src="images/img.jpg" alt="extension icon" />
			</div>
		);
	}
}

export default GreetingComponent;
