import React, { useEffect, useState } from 'react';
import { FlatList, Text, View, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { auth, db } from '../../../../config/firebaseConfig';
import { router } from 'expo-router';
import { collection, doc, getDocs, onSnapshot, query, updateDoc, where } from 'firebase/firestore';

export default function UsuariosTotens() {
  const [totens, setTotens] = useState<
    { id: string; nome: string; status: 'parado' | 'iniciado' | 'aguardo' }[]
  >([]);

  const handleLogout = () => {
    auth.signOut();
    router.replace('/');
  };

  const getTotens = async () => {
    const querySnapshot = query(
      collection(db, 'totens'),
      where('status', '==', 'iniciado')
    );

    onSnapshot(querySnapshot, async (snapshot) => {
      const totens: {
        id: string;
        nome: string;
        status: 'parado' | 'iniciado' | 'aguardo';
      }[] = [];
      snapshot.forEach((doc) => {
        totens.push({ id: doc.id, ...(doc.data() as any) });
      });
      setTotens(totens);
    });
  };

  useEffect(() => {
    getTotens();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>TOTENS</Text>
        <View style={styles.divider} />
      </View>

      <FlatList
        data={totens}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>Totem: {item.nome}</Text>
              <Text style={styles.cardSubtitle}>
                Status: {item.status === 'iniciado' ? 'Disponível' : 'Aguardando'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.actionButton}
              onPress={async () => {
                const docRef = doc(db, 'totens', item.id);
                await updateDoc(docRef, {
                  status: 'aguardo',
                  usuario: auth.currentUser?.uid,
                });
                Alert.alert(
                  'Ação Realizada',
                  'Acesse o totem agora para finalizar o processo!'
                );
              }}
            >
              <Text style={styles.actionButtonText}>Realizar Descarte</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
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

  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007ACC',
  },
  divider: {
    marginTop: 8,
    width: '50%',
    height: 3,
    backgroundColor: '#007ACC',
    borderRadius: 5,
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
