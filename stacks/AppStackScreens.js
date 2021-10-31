import React, { useContext, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { TokenContext, TokenProvider } from '../context/TokenContext';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackScreens from './AuthStackScreens';
import TabStackScreens from './TabStackScreens';

export default AppStackScreens = () => {
    const AppStack = createStackNavigator();
    const [token, _ ] = useContext(TokenContext);
    console.log("33333", token);
    return (
            <AppStack.Navigator>
                {token.isLoggedIn ? (
                    <AppStack.Screen name="Tab" component={TabStackScreens} />
                ):(
                    <AppStack.Screen name="Auth" component={AuthStackScreens} />
                )}
               
            </AppStack.Navigator>
    )
}