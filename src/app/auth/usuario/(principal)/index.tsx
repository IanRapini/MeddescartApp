import React, { useCallback, useEffect, useState } from 'react';
import {FlatList,Text,View,StyleSheet,Alert,TouchableOpacity,} from 'react-native';
import { auth, db } from '../../../../config/firebaseConfig';
import { router, useFocusEffect } from 'expo-router';
import {collection,doc,getDoc,getDocs,onSnapshot,query,updateDoc,where,} from 'firebase/firestore';

export default function UsuariosTotens() {
  const [ usuario, setUsuario ] = useState<any>(null);
  const [ descartes, setDescartes ] = useState<any>(null);

  const handleLogout = () => {
    auth.signOut();
    router.replace('/');
  };


  // ---------------------------------------------
  const getUsuario = async () => {
    if (auth.currentUser) {
      const snapshot = await getDoc(doc(db, 'usuarios', auth.currentUser.uid))
      const dados = snapshot.data();
      setUsuario(dados);
    }
  }
  // ---------------------------------------------
  const getDescartes = async () => {
    if (auth.currentUser) {
      const condicao = query(collection(db, 'descartes'), where('usuario', '==', auth.currentUser.uid))
      const snapshots = await getDocs(condicao)
      const descartes:any = [];
      snapshots.forEach(snap => descartes.push(snap.data()))
      setDescartes(descartes)
    }
  }

  // ---------------------------------------------
  
  useFocusEffect(useCallback(() => {
    getUsuario();
    getDescartes();
  }, []))

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>
        Olá,{' '}
        <Text style={styles.userName}>
          {usuario && usuario.nome ? usuario.nome : 'Usuário'}
        </Text>
      </Text>

      <Text style={styles.sectionTitle}>Seus descartes</Text>
      <FlatList
        data={descartes}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Pontos: {item.pontos}</Text>
            <Text>Data: {item.data}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />

      <View style={styles.pointsContainer}>
        <View style={styles.pointsContent}>
          <Text style={styles.totalPointsText}>Total de Pontos:</Text>
          <Text style={styles.totalPointsValue}>{usuario && usuario.pontos ? usuario.pontos : '0'} </Text>
        </View>
      </View>
      

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e6f8e0',
    paddingHorizontal: 20,
    paddingTop: 20,
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    textAlign: 'center',
  },
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 8,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardContent: {
    justifyContent: 'center',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#007ACC',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    justifyContent: 'center',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  pointsContainer: {
    marginVertical: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  totalPointsText: {
    fontSize: 18,
    color: '#333',
    fontWeight: 'bold',
  },
  totalPointsValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007ACC',
    marginTop: 10,
  },
  pointsContent: {
    alignItems: 'center',
  },
  newDescarteButton: {
    backgroundColor: '#D32F2F',
    borderRadius: 5,
    paddingVertical: 15,
    marginVertical: 10,
    alignItems: 'center',
  },
  newDescarteText: {
    color: '#fff',
    fontSize: 16,
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
});
