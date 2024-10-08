import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, ToastAndroid, Alert } from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigation } from "@react-navigation/native";
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { setDoc, doc } from '@firebase/firestore';
import 'react-native-gesture-handler';
import { auth, db } from '@/src/config/firebaseConfig';

export default function CadastroScreen() {
    const navigation = useNavigation();

    const handleCadastro = async ({ email, senha, confirmSenha, nome, idade }: any) => {
        if (senha !== confirmSenha) {
            Alert.alert('Erro', 'As senhas não coincidem');
            return;
        }

        await createUserWithEmailAndPassword(auth, email, senha)
            .then((usuario) => {
                setDoc(doc(db, 'usuarios', usuario.user.uid), {
                    email, nome, idade
                });
                ToastAndroid.show('Cadastro realizado com sucesso!', ToastAndroid.LONG);
                navigation.goBack();
            })
            .catch(erro => {
                console.log(erro)
                Alert.alert('Erro', 'Não foi possível criar o usuário, tente novamente')
            });
    };

    const validationSchema = yup.object().shape({
        email: yup.string().email('Digite um email válido').required('O email é obrigatório'),
        nome: yup.string().required('O campo nome é obrigatório'),
        idade: yup.number().required('O campo idade é obrigatório').positive('O valor precisa ser um número positivo').integer('O valor precisa ser um número inteiro'),
        senha: yup.string().required('A senha é obrigatória').min(6, 'A senha precisa ter no mínimo 6 caracteres'),
        confirmSenha: yup.string().oneOf([yup.ref('senha'), undefined], 'As senhas devem coincidir').required('A confirmação de senha é obrigatória'),
    });

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
            <ScrollView style={{ flex: 1, padding: 10 }}>
                <View style={styles.container}>
                    <Text style={styles.title}>Crie sua conta</Text>
                    <Image
                        source={require('./../../../../assets/images/ajaCorTP.png')}
                        style={styles.image}
                        resizeMode="cover"
                    />
                    <View style={styles.formContainer}>
                        <Formik
                            initialValues={{ email: '', senha: '', confirmSenha: '', nome: '', idade: '' }}
                            validationSchema={validationSchema}
                            onSubmit={handleCadastro}
                        >
                            {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                                <View style={styles.form}>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Nome</Text>
                                        <TextInput
                                            onChangeText={handleChange('nome')}
                                            onBlur={handleBlur('nome')}
                                            value={values.nome}
                                            placeholder="Digite seu nome"
                                            style={styles.input}
                                        />
                                        {touched.nome && errors.nome && <Text style={styles.error}>{errors.nome}</Text>}
                                    </View>
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
                                        <Text style={styles.label}>Idade</Text>
                                        <TextInput
                                            onChangeText={handleChange('idade')}
                                            onBlur={handleBlur('idade')}
                                            value={values.idade}
                                            placeholder="Digite sua idade"
                                            keyboardType="decimal-pad"
                                            style={styles.input}
                                        />
                                        {touched.idade && errors.idade && <Text style={styles.error}>{errors.idade}</Text>}
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Senha</Text>
                                        <TextInput
                                            onChangeText={handleChange('senha')}
                                            onBlur={handleBlur('senha')}
                                            value={values.senha}
                                            placeholder="Digite sua senha"
                                            secureTextEntry
                                            style={styles.input}
                                        />
                                        {touched.senha && errors.senha && <Text style={styles.error}>{errors.senha}</Text>}
                                    </View>
                                    <View style={styles.inputGroup}>
                                        <Text style={styles.label}>Confirme a Senha</Text>
                                        <TextInput
                                            onChangeText={handleChange('confirmSenha')}
                                            onBlur={handleBlur('confirmSenha')}
                                            value={values.confirmSenha}
                                            placeholder="Confirme sua senha"
                                            secureTextEntry
                                            style={styles.input}
                                        />
                                        {touched.confirmSenha && errors.confirmSenha && <Text style={styles.error}>{errors.confirmSenha}</Text>}
                                    </View>
                                    <View style={styles.line} />
                                    <TouchableOpacity style={styles.button} onPress={() => handleSubmit()}>
                                        <Text style={styles.buttonEntrar}>Cadastrar</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </Formik>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'stretch',
        backgroundColor: '#006400',
        paddingTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#F4A460',
        textAlign: 'center',
        marginBottom: 20,
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
    label: {
        color: '#F4A460',
    },
    input: {
        height: 40,
        borderColor: '#F4A460',
        borderWidth: 1,
        paddingHorizontal: 10,
        color: '#006400', 
    },
    error: {
        color: 'red',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#32CD32', 
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
        borderBottomColor: '#32CD32',
        borderBottomWidth: 1,
        width: '100%',
        marginBottom: 20,
    },
});
