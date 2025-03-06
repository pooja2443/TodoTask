import React, { useState, useEffect } from "react";
import {View, Text, TextInput, TouchableOpacity, StyleSheet, Image,useColorScheme } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Toast from 'react-native-toast-message';
import { ToastConfigParams } from 'react-native-toast-message';
import { useRouter } from "expo-router";
import { NativeStackNavigationConfig, NativeStackNavigationProp } from "@react-navigation/native-stack/lib/typescript/commonjs/src/types";

type Props = {
    navigation : NativeStackNavigationProp<any>;
}

const FirstScreen = ({navigation} : Props) => {
  const [email, setEmail] = useState<string>("");
  const [password,  setPassword] =  useState<string>("");
  const [cheked, setChecked] = useState<boolean>(false);
  const [isPasswordVisibile, setIsPasswordVisible] = useState<boolean>(false);
 
  const systemColorScheme = useColorScheme(); //get system theme
  const [isDarkMode, setIsDarkMode] = useState<boolean>(systemColorScheme === 'dark');

  useEffect(() => {
    setIsDarkMode(systemColorScheme === 'dark');
  }, [systemColorScheme]);

  
const theme = {
  backgroundColor: isDarkMode ? '#1a1a1a' : '#fff',
    textColor: isDarkMode ? '#fff' : '#000',
    borderColor: isDarkMode ? '#444' : '#ddd',
    inputBackground: isDarkMode ? '#333' : '#fff',
    secondaryText: isDarkMode ? '#aaa' : '#666',
    buttonBackground:'#ff7733',
    toastBackground : isDarkMode ? 'rgba(255, 255, 255, 0.7)' : 'rgba(0, 0, 0, 0.7)'  ,
    toastText : isDarkMode ? '#1a1a1a' : '#fff' ,
    buttonText: '#fff',
    linkColor: isDarkMode ? '#66a3ff' : '#3366ff'
}

const toastConfig = {
  customToast: ({ text1 }: ToastConfigParams<any>) => (
    <View style={{
      padding: 16,
      backgroundColor: theme.toastBackground,
      borderRadius: 8,
      marginBottom: 40,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
      <Text style={{
        color: theme.toastText,
        fontSize: 14,
        textAlign: 'center',
      }}>{text1}</Text>
    </View> 
  )
} as const;//it makes toastConfig and its value readonly and fixed


  const emailValidation = (email : string):boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
    return emailRegex.test(email);
  }

  const passValidation = (password:string):boolean => (password.length >= 6);

  const showToast = (message: string) => {
    Toast.show({
      type: 'customToast',
      text1: message,
      position: "bottom",
      visibilityTime: 2000,
    })
  }

  const handleSignIn = () => {
    if(!email && !password) {
    showToast('Please fill all fields');
    }
    else if (!email){
      showToast("Please enter email")
    }
    else if(!emailValidation(email)){
      showToast("Invalid Email");
    }
    else if(!password){
      showToast("Please enter password")
    }
    else if(!passValidation(password)){
      showToast("Invalid Password");
    }
    else{
      showToast("sign in successfull")
      
    setEmail('');
    setPassword('');

    //pass the username to SecondScreen
    navigation.navigate("About", {
      userEmail : email,
      isDarkMode : isDarkMode
    })
    }   
  }
  
  return(
    <>
       <View style={[styles.container, { backgroundColor: theme.backgroundColor }]}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, {color : theme.textColor}]}>Welcome To SaleSwift</Text>
          <TouchableOpacity
            style={styles.themeToggle}
            onPress={() => setIsDarkMode(!isDarkMode)}>
            <FontAwesome name= {isDarkMode ? "sun-o" : "moon-o"} size={24} color={theme.textColor}/>
          </TouchableOpacity>
        </View>
        <View style={styles.subTitle}>
          <Text style={{color : theme.secondaryText}}>Create an account and discover</Text>
          <Text style={{color : theme.secondaryText}}>products anywhere you go</Text>
          </View>
        <View style={styles.inputContainer}>
          <Text style={[styles.label, {color : theme.textColor}]}>Email</Text>
          <TextInput
            style={[styles.input, {borderColor : theme.borderColor, backgroundColor: theme.inputBackground,
              color: theme.textColor}]}
            value={email} 
            placeholder="Email"
            placeholderTextColor={theme.secondaryText}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none">
          </TextInput>
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={[styles.label,{color : theme.textColor}]}>Password</Text>
          <View style={[styles.passwordContainer,{borderColor : theme.borderColor, backgroundColor: theme.inputBackground}]}>
            <TextInput 
              style={[styles.passwordInput,  {borderColor : theme.borderColor, backgroundColor: theme.inputBackground, color: theme.textColor}]} 
              value={password} 
              placeholder="Password" 
              placeholderTextColor={theme.secondaryText}
              onChangeText={setPassword} 
              //for doted password
              secureTextEntry={!isPasswordVisibile}> 
            </TextInput>
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisibile)}>
              <FontAwesome name={isPasswordVisibile ? "eye" : "eye-slash"} size={18} color={theme.textColor}></FontAwesome>
            </TouchableOpacity>
          </View> 
        </View>

        <View style={styles.rememberContainer}>
          <TouchableOpacity
            style={styles.checkBoxContainer}
            onPress={() => setChecked(!cheked)}
          >
            <View style={[styles.checkBox,{borderColor : theme.borderColor, backgroundColor : theme.inputBackground}, cheked && styles.checked]}>
              {cheked && <Text><FontAwesome name="check" size={18} color="#fff"></FontAwesome></Text>}
            </View>
            <Text style={{color : theme.textColor}}>Remember me</Text>
            </TouchableOpacity>
            
          <TouchableOpacity>
            <Text style={[styles.forgot, {color : theme.linkColor}]}>Forgot Password</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
         style={[styles.button, {backgroundColor : theme.buttonBackground}]}
         onPress={handleSignIn}>
          <Text style={[styles.buttonText, {color : theme.buttonText}]}>Sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity>
          <Text style={[styles.orText, {color:theme.secondaryText}]}>or sign up with</Text>
        </TouchableOpacity>
        
        <View style={styles.socialContainer }>
        <TouchableOpacity style={[styles.socialButton, {borderColor : theme.borderColor}]}>
            <Image
              source={{ uri: 'https://i.postimg.cc/DyYxPx0j/googl-icon1.jpg' }}
              style={[styles.socialIcon, ]}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, {borderColor : theme.borderColor}]}>
            <Image
              source={{ uri: 'https://i.postimg.cc/mkMvW70W/facebook.png' }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton,{borderColor : theme.borderColor}]}>
            <Image
              source={{ uri: 'https://i.postimg.cc/VsnZ1q75/apple1.png' }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.socialButton, {borderColor : theme.borderColor}]}>
            <Image
              source={{ uri: 'https://i.postimg.cc/KjQR1dnb/logo1.png' }}
              style={styles.socialIcon}
            />
          </TouchableOpacity>
        </View>

        <View>
          <Text style={[styles.termsText, {color: theme.secondaryText }]}>By signing up you can acknowledge and agree to event.com
            <TouchableOpacity><Text style={[styles.link, {color: theme.linkColor}]}> General Terms of use </Text></TouchableOpacity>
            <Text style={{color : theme.secondaryText}}>and </Text> 
            <TouchableOpacity><Text style={[styles.link, {color: theme.linkColor}]}>Privacy Policy</Text></TouchableOpacity>
          </Text>
        </View>
    </View>
    <Toast config={toastConfig} />
    </>
   
  )
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor : "#fff",
    padding : 20,
    marginTop : 0
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 15
  },
  themeToggle: {
    padding: 8,
  },
  title : {
    fontSize : 24,
    fontWeight : "bold",
    marginBottom : 8,
    marginTop : 15
  },
  subTitle : {
    fontSize : 16,
    marginBottom : 30,
    color : "#666"
  },
 inputContainer : {
    marginBottom : 20
  },
  label : {
    fontSize : 16,
    marginBottom : 8
  },
  input : {
    borderWidth : 1,
    borderColor : "#ddd",
    borderRadius : 8,
    padding : 12,
    fontSize : 16
  },
   passwordContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16
  },
  passwordInput: {
    flex: 1,
    paddingVertical : 12,
    paddingRight : 40
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
  },
  forgot : {
    color : "#3366ff"
  },
  rememberContainer : {
    flexDirection : "row",
    justifyContent : "space-between",
    alignItems : "center",
    marginBottom : 20
  },
  checkBoxContainer : {
    flexDirection : "row",
    alignItems : "center",
    padding : 2
  },
  checkBox : {
    width : 20,
    height : 20,
    borderRadius : 4,
    borderWidth : 1,
    borderColor : "#ddd",
    marginRight : 8,
    justifyContent : "center",
    alignItems : "center"
  },
  checked: {
    backgroundColor: '#ff7733',
    borderColor: '#ff7733',
  },
  button : {
    backgroundColor : "#ff7733",
    borderRadius : 25,
    padding : 16,
    alignItems : "center",
    marginBottom : 20
  },
  buttonText : {
    color : "#fff",
    fontSize : 16,
    fontWeight : "bold"
  },
  orText : {
    textAlign : "center",
    color : "#666",
    marginBottom : 20
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow : 'hidden',
  },
    socialIcon: {
    width: 40,
    height: 40,
  },
  termsText : {
    textAlign : "center",
    fontSize : 12,
    color :  "#666",
    lineHeight : 18,
    flexDirection : "row",
    flexWrap : "wrap",
    justifyContent : "center"
  },
  link :{
    color : "#3366ff",
    fontSize : 12,
    marginTop : 20,
    lineHeight : 18
  },
 
})

export default FirstScreen;