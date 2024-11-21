import React, { useCallback, useState } from 'react';
import { ScrollView, Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { auth, db } from '../../../../config/firebaseConfig';
import { router, useFocusEffect } from 'expo-router';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';

export default function UsuariosTotens() {
  const [usuario, setUsuario] = useState<any>(null);
  const [descartes, setDescartes] = useState<any[]>([]);

  const handleLogout = () => {
    auth.signOut();
    router.replace('/');
  };

 
  const getUsuario = async () => {
    if (auth.currentUser) {
      const snapshot = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));
      const dados = snapshot.data();
      setUsuario(dados);
    }
  };

  
  const getDescartes = async () => {
    const descartesComUsuarios: any[] = [];
    const descartesQuery = query(collection(db, 'descartes'));

    const descartesSnapshot = await getDocs(descartesQuery);
    for (const descarteDoc of descartesSnapshot.docs) {
      const descarte = descarteDoc.data();
      const usuarioDoc = await getDoc(doc(db, 'usuarios', descarte.usuario));
      const usuarioData = usuarioDoc.exists() ? usuarioDoc.data() : null;

      if (usuarioData) {
        descartesComUsuarios.push({
          ...descarte,
          nome: usuarioData.nome,
          email: usuarioData.email,
        });
      }
    }

    setDescartes(descartesComUsuarios);
  };

  useFocusEffect(
    useCallback(() => {
      getUsuario();
      getDescartes();
    }, [])
  );

  return (
    <View style={styles.container}>

        <Text style={styles.headerText}>
          Olá,{' '}
          <Text style={styles.userName}>{usuario && usuario.nome ? usuario.nome : 'Usuário'}</Text>
        </Text>
      <Text style={styles.title}>Registros de Descarte</Text>

      <ScrollView style={styles.scrollView}>
        {descartes.map((registro, index) => (
          <View key={index} style={styles.card}>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Nome:</Text> {registro.nome}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Email:</Text> {registro.email}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Horário:</Text> {registro.horario}
            </Text>
            <Text style={styles.infoText}>
              <Text style={styles.label}>Pontos:</Text> {registro.pontos}
            </Text>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#2E7D32',
    borderRadius: 10,
  },
  headerText: {
    fontSize: 20,
    color: '#333',
    marginBottom: 10,
    fontWeight: 'bold',
    borderBottomWidth: 1, 
    borderBottomColor: '#ccc', 
    paddingBottom: 5, 
  },
  userName: {
    color: '#007ACC',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderColor: '#A5D6A7',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoText: {
    fontSize: 16,
    color: '#2E7D32',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
  },
  logoutButton: {
    alignItems: 'center',
    marginVertical: 10,
  },
  logoutText: {
    color: '#D32F2F',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
  sectionTitle: {
    fontSize: 18,
    color: '#333',
    marginVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingBottom: 5,
  },
});
