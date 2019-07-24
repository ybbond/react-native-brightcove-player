import React, { Component } from 'react';
import { Button, StyleSheet, View, Text } from 'react-native';

export default class Overlay extends Component {

	render() {

		if (!this.props.visible) {
			return null;
		}

		return (
			<View style={styles.container}>
				<Text style={styles.text}>Overlay</Text>
				{this.props.children}
			</View>
		);
	}
}

/**
 * Component styles
 */
const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		top: 0,
		right: 0,
		width: 150,
		height: 100,
		backgroundColor: 'red',
		zIndex: 2147483647,
		elevation: 3,
		padding: 10
	},
	text: {
		color: 'white'
	},
	button: {
		marginTop: 15,
		backgroundColor: '#0000BB'
	}
});
