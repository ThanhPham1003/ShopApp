
import React, { useContext, useState, useEffect } from "react";
import {View, Text, StyleSheet, Image,TouchableOpacity, Alert, TextInput} from 'react-native';
import API from '../config/environmentVariables';
import axios from "axios";
import * as ImagePicker from 'expo-image-picker';
import { TokenContext, TokenProvider } from '../context/TokenContext';
import {FirebaseContext} from '../context/FirebaseContext'
export default function ProfileScreen(props){
    const {navigation} = props;
    const [product, setProduct] = useState({});
    const firebase = useContext(FirebaseContext);
    const [token, setToken] = useContext(TokenContext);
    const [image, setImage] = useState(null);
    const [imageEditing, setImageEditing] = useState(null);
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState('');
    useEffect(() => {
        fetchData();
    },[])
    useEffect(() => {
        (async () => {
          if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              alert('Sorry, we need camera roll permissions to make this work!');
            }
          }
        })();
      }, []);
    // useEffect(()=>{
    //     console.log("55555", image);
    // },[image])
    const fetchData = async() => {
        
        const uid = firebase.getCurrentUser().uid;
        const add = API.BASE_URL + "users/" + uid;
        const res = await axios.get(add, {
            headers: {
              authorization: "Bearer " + token.token,
            }
        });
        setProduct(res.data);
        const url = API.BASE_URL + res.data.url;
        //console.log("hihi", url);
        let path2 = url.replace(/\\/g, "/");
        //console.log("hoho", path2);

        setImageEditing(path2);
        setImage(path2);
        setName(res.data.name);
        setAge(res.data.age);
    }   
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
    
        if (!result.cancelled) {
            setImageEditing(result.uri);
        }
    };
    const updateData = async () => {
        
        const uid = firebase.getCurrentUser().uid;
        const add = API.BASE_URL + "users/" + uid;
        const addImage = API.BASE_URL + "users/photo" + uid;
        const userImage ={uri: imageEditing,
            type: 'image',
            name: imageEditing,}
        const data = new FormData();
        data.append('name', name);
        data.append('age', age);
        data.append('_method', 'PATCH');
        data.append('userImage', {
            uri: imageEditing,
            type: 'image',
            name: imageEditing,
          });


        // const res1 = await axios.patch(addImage, {userImage: userImage},{
        //         headers: {
        //             authorization: "Bearer " + token.token,
        //           }
        //     })
        // console.log("44444", res1);
        
        // const res2 = await axios.patch(add, {name: name, age: age},{
        //     headers: {
        //       authorization: "Bearer " + token.token,
        //     }
        // });

        const res = await axios.post(add,data,{
            headers: {
                authorization: "Bearer " + token.token,
            }
      
        });
        //Alert.alert(res.data);
        fetchData();
        setIsEditing(false);
    }
    const changePassword = async () => {
        await firebase.changePassword(currentPassword,newPassword);
        setIsChangingPassword(false);
    }
    const uploadImageEditing = async () => {
        await pickImage();
    }

    const logOut = async () =>{

        await firebase.logOut();
        setToken({
          token: "",
          isLoggedIn: false,
        });
      }

    return(
        <View style = {styles.Container}>
            {isEditing ? (
                    <>
                        <TouchableOpacity onPress={uploadImageEditing}>
                            <Image source={{uri: imageEditing}}
                                        style={styles.ImageEditStyle}
                            />
                        </TouchableOpacity>
                        <View style={styles.EditSpace}>
                            <Text style={styles.InformationText}>Name: </Text>
                            <TextInput style={styles.PasswordInput}
                            value= {name}
                            onChangeText={(text) => setName(text)} />
                        </View>
                        <View style={styles.EditSpace}>
                            <Text style={styles.InformationText}>Age:  </Text>
                            <TextInput style={styles.PasswordInput}
                            value= {age}
                            keyboardType={'decimal-pad'}
                            onChangeText={(text) => setAge(text)} />
                        </View>
                        <View style={styles.ButtonExtra}>
                            <TouchableOpacity style={styles.ButtonStyle} onPress={updateData}>
                                <Text> Save </Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.ButtonStyle}
                                    onPress={() => setIsEditing(false)}>
                                        <Text>ComeBack</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                ) : (
                <>
                    {isChangingPassword ? (
                        <>
                            <View style={styles.EditSpace}>
                            <Text style={styles.InformationText}>Current Password: </Text>
                            <TextInput style={styles.PasswordInput}
                            value= {currentPassword}
                            secureTextEntry={true}
                            onChangeText={(text) => setCurrentPassword(text)} />
                            </View>
                            <View style={styles.EditSpace}>
                                <Text style={styles.InformationText}>New Password:  </Text>
                                <TextInput style={styles.PasswordInput}
                                value= {newPassword}
                                secureTextEntry={true}
                                onChangeText={(text) => setNewPassword(text)} />
                            </View>
                            <View style={styles.ButtonExtra}>
                                <TouchableOpacity style={styles.ButtonStyle} onPress={changePassword}>
                                    <Text> Chage </Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ButtonStyle}
                                    onPress={() => setIsChangingPassword(false)}>
                                    <Text>ComeBack</Text>
                                </TouchableOpacity>
                            </View>    
                        </>
                    ):(
                        <>
                            <View style={styles.ImageAndUserSpace}>
                                <Image source={{uri: image}}
                                    style={styles.ImageStyle}
                                />
                                <Text style={styles.UserText}> {product.name}</Text>
                            </View>
                            <View style={styles.UserInformation}>
                            
                                        <Text style={styles.InformationText}> Email: {product.email}</Text>
                                        <Text style={styles.InformationText}> Age: {product.age}</Text>
                                        <Text style={styles.InformationText}> Join Date: 10/03/1999</Text>

                                
                            </View>
                            <View style={styles.ButtonSpace}>
                                <TouchableOpacity style={styles.ButtonStyle}
                                onPress={() => setIsEditing(true)}
                                >
                                    <Text>Edit Profile</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.ButtonStyle}
                                onPress={() => setIsChangingPassword(true)}>
                                    <Text>Chage Password</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.LogOutSpace}>
                            <TouchableOpacity style={styles.ButtonStyle}
                                onPress={logOut}
                                >
                                    <Text>LogOut</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
            </>
            )}
        </View>
    )
}
const styles = StyleSheet.create({
    Container: {
        flex:1,
        //justifyContent: 'center',
        
        backgroundColor: '#f9e3bd',
    },
    ExtraSpace:{
        alignItems: 'center',
        justifyContent:'center'
    },
    ImageAndUserSpace:{
        alignItems: 'center',
        flex: 4,
    },
    ImageStyle:{

        borderWidth: 5,
        height: '75%',
        width: '55%',
        borderRadius: 1000,
        // backgroundColor: '#e7eaed',
        // justifyContent: 'center',
        // alignItems: 'center',
        borderColor: '#efb65b',
        margin: 25,
    },
    ImageEditSpace:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    ImageEditStyle:{
        borderWidth: 5,
        height: '55%',
        width: '55%',
        borderRadius: 1000,
        // backgroundColor: '#e7eaed',
        // justifyContent: 'center',
        // alignItems: 'center',
        borderColor: '#efb65b',
        marginTop: 20,
        marginLeft: 100,
    },
    UserText:{
        fontSize: 25,
        fontWeight: '500',
    },
    UserInformation:{
        flex: 3,
    },
    EditSpace:{
        flexDirection: 'row'
    },
    InformationText:{
        fontSize:20,
        margin: 30,
    },
    ButtonSpace:{
        flex: 2,
        flexDirection:'row',
        alignItems:'center',
        justifyContent: 'center',
    },
    ButtonStyle:{
        borderColor: '#efb65c',
        borderWidth: 2,
        borderRadius: 10,
        height: 40,
        width:130,
        alignItems:'center',
        justifyContent: 'center',
        backgroundColor: '#efb65b',
        margin:30,
    },
    LogOutSpace:{
        flex: 1,
        alignItems:'center',
        justifyContent: 'center',
    },
    PasswordInput:{
        borderBottomWidth: 1,
        borderBottomColor: 'black',
        height: '50%',
        width: '40%',
        marginTop: 10
    },
    ButtonExtra:{
        flexDirection: 'row',
        alignItems:'center',
        justifyContent: 'center',

    }
})