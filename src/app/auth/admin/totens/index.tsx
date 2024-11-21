import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Alert,
    TextInput,
} from 'react-native';
import { auth, db } from '../../../../config/firebaseConfig';
import { router } from 'expo-router';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';

export default function TotensLista() {
    const [totens, setTotens] = useState<{ id: string; nome: string; status: 'parado' | 'iniciado' | 'aguardo' }[]>([]);
    const [novoTotemNome, setNovoTotemNome] = useState('');

    const handleLogout = () => {
        auth.signOut();
        router.replace('/');
    };

    const getTotens = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'totens'));
            const totensList: { id: string; nome: string; status: 'parado' | 'iniciado' | 'aguardo' }[] = [];
            snapshot.forEach((doc) => {
                totensList.push({
                    id: doc.id,
                    nome: doc.data().totem || 'Nome não definido',
                    status: doc.data().status || 'parado',
                });
            });
            setTotens(totensList);
        } catch (error) {
            console.error('Erro ao carregar os totens:', error);
        }
    };

    const handleAddTotem = async () => {
        if (!novoTotemNome) {
            Alert.alert('Erro', 'Por favor, insira o nome do totem.');
            return;
        }

        try {
            await addDoc(collection(db, 'totens'), {
                totem: novoTotemNome,
                status: 'parado',
                usuario: auth.currentUser?.uid || 'admin',
            });
            Alert.alert('Sucesso', 'Totem adicionado com sucesso!');
            setNovoTotemNome('');
            getTotens();
        } catch (error) {
            console.error('Erro ao adicionar o totem:', error);
            Alert.alert('Erro', 'Não foi possível adicionar o totem.');
        }
    };

    const handleDeleteTotem = async (id: string) => {
        Alert.alert('Excluir Totem', `Você deseja excluir o totem com ID: ${id}?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const totemDocRef = doc(db, 'totens', id);
                        await deleteDoc(totemDocRef);
                        setTotens((prevTotens) => prevTotens.filter((totem) => totem.id !== id));
                        Alert.alert('Sucesso', 'Totem excluído com sucesso!');
                    } catch (error) {
                        console.error('Erro ao excluir o totem:', error);
                        Alert.alert('Erro', 'Não foi possível excluir o totem.');
                    }
                },
            },
        ]);
    };

    useEffect(() => {
        getTotens();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>
                Olá, <Text style={styles.userName}>Usuário</Text>
            </Text>
            <Text style={styles.title}>Gerenciamento de Totens</Text>

            <View style={styles.addTotemContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nome do Totem"
                    value={novoTotemNome}
                    onChangeText={setNovoTotemNome}
                />
                <TouchableOpacity style={styles.addTotemButton} onPress={handleAddTotem}>
                    <Text style={styles.addTotemText}>+ Adicionar Totem</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={totens}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={[styles.infoText, styles.flexText]}>
                                <Text style={styles.label}>Nome:</Text> {item.nome}
                            </Text>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteTotem(item.id)}
                            >
                                <Text style={styles.deleteButtonText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.infoText}>
                            <Text style={styles.label}>ID:</Text> {item.id}
                        </Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
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
        backgroundColor: '#E8F5E9',
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
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#2E7D32',
        marginBottom: 10,
        textAlign: 'center',
    },
    addTotemContainer: {
        marginBottom: 15,
    },
    input: {
        height: 40,
        borderColor: '#007ACC',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    addTotemButton: {
        backgroundColor: '#A5D6A7',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    addTotemText: {
        color: '#2E7D32',
        fontWeight: 'bold',
    },
    listContent: {
        flexGrow: 1,
        paddingBottom: 20,
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
    deleteButton: {
        backgroundColor: '#FFCDD2',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
    deleteButtonText: {
        color: '#D32F2F',
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
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    flexText: {
        flex: 1, 
        marginRight: 10, 
      },
});
