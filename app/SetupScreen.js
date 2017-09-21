import React from 'react';

class SetupScreen extends React.Component {
    static navigationOptions = {
        tabBarLabel: 'Setup',
    };
    render() {
        const { goBack } = this.props.navigation;
        return (
            <Button
                title="Go back to home tabs"
                onPress={() => goBack()}
            />
        );
    }
}
