import React from 'react';
import {View,Text,TextInput,StyleSheet,TouchableOpacity,Image,KeyboardAvoidingView,Platform,ScrollView,ToastAndroid,Alert, ActivityIndicator,} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../../config/firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function LoginForm() {
    const validationSchema = yup.object().shape({
        email: yup.string().email('Digite um email válido').required('O email é obrigatório'),
        password: yup.string().required('A senha é obrigatória').min(6, 'A senha precisa ter no mínimo 6 caracteres'),
    });

    const handleLogin = async (values: { email: string; password: string }) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, values.email, values.password);
            const user = userCredential.user;

            const snapshot = await getDoc(doc(db, 'usuarios', user.uid));
            const userData = snapshot.data();

            if (userData && userData.status === 'admin') {
                router.replace('/auth/admin/aprovar');
            } else {
                router.replace('/auth/usuario');
            }

            ToastAndroid.show('Logado com sucesso', ToastAndroid.LONG);
        } catch (error) {
            Alert.alert('Erro', 'Email ou senha incorretos, tente novamente');
        }
    };

    const handleCadastro = () => {
        router.push('/cadastro');
    };

    return (
        <LinearGradient colors={['#e6f8e0', '#f0fff4']} style={styles.container}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                        paddingHorizontal: 20,
                    }}>
                    <View style={styles.innerContainer}>
                        <Image
                            source={require('./../../../assets/images/LOGO FINAL (3).png')}
                            style={{ width: 200, height: 200 }}
                            resizeMode="cover"
                        />
                        <Image
                            source={require('./../../../assets/images/LOGO FINAL (4).png')}
                            style={{ width: 280, height: 70 }}
                            resizeMode="cover"
                        />
                        <Formik
                            initialValues={{ email: '', password: '' }}
                            validationSchema={validationSchema}
                            onSubmit={handleLogin}>
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
                                <View style={styles.form}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Usuário</Text>
                                        <TextInput
                                            onChangeText={handleChange('email')}
                                            onBlur={handleBlur('email')}
                                            value={values.email}
                                            placeholder="Digite seu email"
                                            keyboardType="email-address"
                                            style={styles.input}
                                            placeholderTextColor="#6c6c6c"
                                        />
                                        {touched.email && errors.email && (
                                            <Text style={styles.error}>{errors.email}</Text>
                                        )}
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
                                            placeholderTextColor="#6c6c6c"
                                        />
                                        {touched.password && errors.password && (
                                            <Text style={styles.error}>{errors.password}</Text>
                                        )}
                                    </View>
                                    {!isSubmitting && <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                                        <Text style={styles.buttonText}>Entrar</Text>
                                    </TouchableOpacity>}
                                    {isSubmitting && <ActivityIndicator size={20} /> }
                                    <Text style={styles.orText}>ou</Text>
                                    <TouchableOpacity onPress={() => handleCadastro()}>
                                        <Text style={styles.registerText}>Cadastre-se</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </LinearGradient>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 500,
        height: 200,
        backgroundColor: 'red',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1f7a1f',
    },
    subtitle: {
        fontSize: 12,
        color: '#666',
        marginBottom: 30,
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    inputGroup: {
        marginBottom: 15,
    },
    label: {
        fontSize: 14,
        color: '#1f7a1f',
        marginBottom: 5,
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#f2f2f2',
        fontSize: 14,
        color: '#333',
    },
    error: {
        color: 'red',
        fontSize: 12,
        marginTop: 5,
    },
    button: {
        backgroundColor: '#007ACC',
        paddingVertical: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    orText: {
        textAlign: 'center',
        marginVertical: 10,
        color: '#666',
    },
    registerText: {
        color: '#1f7a1f',
        fontSize: 14,
        textAlign: 'center',
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});
