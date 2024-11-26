import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

//Screens
import Home from "./screens/Home";
import Login from "./screens/Login";
import Registro from "./screens/Register";
import Impresiones from "./screens/Impresiones";
import Personalizacion from "./screens/Personalizacion";
import Lonas from "./screens/Lonas";
import Reportes from "./screens/Reportes";
import Lonasmod from "./screens/Lonasmod";
import HomeUser from "./screens/HomeUser";




const Stack = createNativeStackNavigator();
function MyStack() {
    return(
        <Stack.Navigator
            initialRouteName="Login"
        >
            <Stack.Screen
                name="Login"
                component={Login}
                options={{
                    headerShown: true
                }}

            />

            <Stack.Screen
                name="Impresiones"
                component={Impresiones}
                options={{
                    headerShown: true
                }}

            />

            <Stack.Screen
             name="Home"
             component={Home}
             options={{
                 headerShown: true
             }}
            />

            <Stack.Screen
                name="Personalizacion"
                component={Personalizacion}
                options={{
                    headerShown: true
                }}

            />

           <Stack.Screen
                name="Lonas"
                component={Lonas}
                options={{
                    headerShown: true
                }}

            />

            <Stack.Screen
                name="LonasMod"
                component={Lonasmod}
                options={{
                    headerShown: false
                }}

            />


            <Stack.Screen
                name='UserHome'
                    component={HomeUser}
                    options={{
                        headerShown: true
                            }}
            />


            <Stack.Screen
                name="Reportes"
                component={Reportes}
                options={{
                    headerShown: true
                }}
            />

            <Stack.Screen
                name="Registro"
                component={Registro}
                options={{
                    headerShown: true
                }}
            />
            

        </Stack.Navigator>
    )
}


export default function Navigation() {
    return(
        <NavigationContainer>
            <MyStack/>
        </NavigationContainer>
    );
}