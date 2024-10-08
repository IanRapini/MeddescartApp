import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, ToastAndroid, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../config/firebaseConfig'; 
import 'react-native-gesture-handler';
import { Link, router } from 'expo-router';

export default function LoginForm() {

    const validationSchema = yup.object().shape({
        email: yup.string().email('Digite um email válido').required('O email é obrigatório'),
        password: yup.string().required('A senha é obrigatória').min(6, 'A senha precisa ter no mínimo 6 caracteres'),
    });

    const handleLogin = async (values: { email: string; password: string; }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            ToastAndroid.show('Logado com sucesso', ToastAndroid.LONG);
            router.replace('/auth/aprovar');
        } catch (error) {
            Alert.alert('Erro', 'Email ou senha incorretos, tente novamente');
        }
    };

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView style={{ flex: 1, padding: 10 }}>
                <View style={styles.container}>
                    <Image
                        source={require('./../../../assets/images/ajaCorTP.png')}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <View style={styles.formContainer}>
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={validationSchema}
                            onSubmit={handleLogin}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <View style={styles.form}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Email</Text>
                                        <TextInput
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                            value={values.email}
                                            placeholder="Digite seu email"
                                            keyboardType="email-address"
                                            style={styles.input}
                                        />
                                        {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Senha</Text>
                                        <TextInput
                                            onChangeText={handleChange('password')}
                                            onBlur={handleBlur('password')}
                                            value={values.password}
                                            placeholder="Digite sua senha"
                                            secureTextEntry
                                            style={styles.input}
                                        />
                                        {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}
                                    </View>
                                    <View style={styles.line} />
                                    <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                                        <Text style={styles.buttonEntrar}>Entrar</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#004400', 
        paddingTop: 50,
    },
    formContainer: {
        justifyContent: 'flex-start',
        backgroundColor: '#f0f0f0',
        flex: 0.7,
        borderRadius: 10,
        marginTop: 50,
        marginHorizontal: 10,
        padding: 35,
    },
    form: {
        width: '100%',
    },
    image: {
        width: '70%',
        height: 230,
        alignSelf: 'center',
    },
    inputGroup: {
        marginBottom: 20,
    },
    input: {
        height: 40,
        borderColor: '#004400',
        borderWidth: 1,
        paddingHorizontal: 10,
        color: '#c29458',
    },
    label: {
        color: '#c29458', 
    },
    error: {
        color: 'red',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#c29458',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 10,
        marginBottom: 20,
        width: '100%',
    },
    buttonEntrar: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    line: {
        borderBottomColor: '#c29458', 
        borderBottomWidth: 1,
        width: '100%',
        marginBottom: 20,
    },
    cadastrar: {
        color: '#c29458',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

