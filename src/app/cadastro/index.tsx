import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Formik } from 'formik';
import * as yup from 'yup';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { setDoc, doc } from '@firebase/firestore';
import { auth, db } from '@/src/config/firebaseConfig';
import { useNavigation } from 'expo-router';

export default function CadastroScreen() {
  const navigation = useNavigation();

  const handleCadastro = async ({ email, senha, confirmSenha, nome }: any) => {
    if (senha !== confirmSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    await createUserWithEmailAndPassword(auth, email, senha)
      .then((usuario) => {
        setDoc(doc(db, 'usuarios', usuario.user.uid), {
          email,
          nome,
        });
        Alert.alert('Sucesso', 'Cadastro realizado com sucesso!');
        navigation.goBack();
      })
      .catch((erro) => {
        console.log(erro);
        Alert.alert(
          'Erro',
          'Não foi possível criar o usuário, tente novamente'
        );
      });
  };

  const validationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Digite um email válido')
      .required('O email é obrigatório'),
    nome: yup.string().required('O campo nome é obrigatório'),
    senha: yup
      .string()
      .required('A senha é obrigatória')
      .min(6, 'A senha precisa ter no mínimo 6 caracteres'),
    confirmSenha: yup
      .string()
      .oneOf([yup.ref('senha'), undefined], 'As senhas devem coincidir')
      .required('A confirmação de senha é obrigatória'),
  });

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={{ flex: 1, padding: 10 }}>
        <View style={styles.container}>
          <Image
            source={require('@/assets/images/LOGO FINAL (3).png')}
            style={{ width: 200, height: 200, alignSelf: 'center' }}
            resizeMode="cover"
          />
          <Image
            source={require('@/assets/images/LOGO FINAL (4).png')}
            style={{ width: 280, height: 70, alignSelf: 'center' }}
            resizeMode="cover"
          />
          <View style={styles.formContainer}>
            <Formik
              initialValues={{
                email: '',
                senha: '',
                confirmSenha: '',
                nome: '',
              }}
              validationSchema={validationSchema}
              onSubmit={handleCadastro}
            >
              {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
              }) => (
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
                    {touched.nome && errors.nome && (
                      <Text style={styles.error}>{errors.nome}</Text>
                    )}
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
                    {touched.email && errors.email && (
                      <Text style={styles.error}>{errors.email}</Text>
                    )}
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
                    {touched.senha && errors.senha && (
                      <Text style={styles.error}>{errors.senha}</Text>
                    )}
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
                    {touched.confirmSenha && errors.confirmSenha && (
                      <Text style={styles.error}>{errors.confirmSenha}</Text>
                    )}
                  </View>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => handleSubmit()}
                  >
                    <Text style={styles.buttonText}>Cadastrar</Text>
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
    backgroundColor: '#E3F2E5',
    paddingTop: 50,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginHorizontal: 10,
  },
  form: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#006D37',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#B8DABA',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#F3FAF4',
  },
  button: {
    backgroundColor: '#006D37',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  error: {
    color: 'red',
    fontSize: 12,
  },
});
