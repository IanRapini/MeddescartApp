import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Text,
    View,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { auth, db } from '../../../../config/firebaseConfig';
import { router } from 'expo-router';
import { collection, getDocs, updateDoc, deleteDoc, doc, getDoc } from 'firebase/firestore';

export default function UsuariosLista() {
    const [usuarios, setUsuarios] = useState<{ id: string; nome: string; status: 'admin' | 'usuario' }[]>([]);
    const [usuarioLogado, setUsuarioLogado] = useState<any>(null);

    const handleLogout = () => {
        auth.signOut();
        router.replace('/');
    };

    const getUsuarios = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'usuarios'));
            const usuariosList: { id: string; nome: string; status: 'admin' | 'usuario' }[] = [];
            snapshot.forEach((doc) => {
                usuariosList.push({
                    id: doc.id,
                    nome: doc.data().nome || 'Nome não definido',
                    status: doc.data().status || 'usuario',
                });
            });
            setUsuarios(usuariosList);
        } catch (error) {
            console.error('Erro ao carregar os usuários:', error);
        }
    };

    const getUsuarioLogado = async () => {
        if (auth.currentUser) {
            try {
                const snapshot = await getDoc(doc(db, 'usuarios', auth.currentUser.uid));
                if (snapshot.exists()) {
                    setUsuarioLogado(snapshot.data());
                } else {
                    console.warn('Usuário logado não encontrado no banco de dados');
                }
            } catch (error) {
                console.error('Erro ao carregar dados do usuário logado:', error);
            }
        }
    };

    const handleDeleteUsuario = async (id: string) => {
        Alert.alert('Excluir Usuário', `Você deseja excluir o usuário com ID: ${id}?`, [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Excluir',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const usuarioDocRef = doc(db, 'usuarios', id);
                        await deleteDoc(usuarioDocRef);
                        setUsuarios((prevUsuarios) => prevUsuarios.filter((usuario) => usuario.id !== id));
                        Alert.alert('Sucesso', 'Usuário excluído com sucesso!');
                    } catch (error) {
                        console.error('Erro ao excluir o usuário:', error);
                        Alert.alert('Erro', 'Não foi possível excluir o usuário.');
                    }
                },
            },
        ]);
    };

    const toggleAdminStatus = async (id: string, currentStatus: 'admin' | 'usuario') => {
        const newStatus = currentStatus === 'admin' ? 'usuario' : 'admin';
        try {
            const usuarioDocRef = doc(db, 'usuarios', id);
            await updateDoc(usuarioDocRef, { status: newStatus });
            setUsuarios((prevUsuarios) =>
                prevUsuarios.map((usuario) =>
                    usuario.id === id ? { ...usuario, status: newStatus } : usuario
                )
            );
            Alert.alert('Sucesso', `Usuário agora é ${newStatus}.`);
        } catch (error) {
            console.error('Erro ao atualizar o status:', error);
            Alert.alert('Erro', 'Não foi possível atualizar o status do usuário.');
        }
    };

    useEffect(() => {
        getUsuarios();
        getUsuarioLogado();
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>
                Olá, <Text style={styles.userName}>{usuarioLogado?.nome || 'Usuário'}</Text>
            </Text>
            <Text style={styles.title}>Gerenciamento de Usuários</Text>

            <FlatList
                data={usuarios}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.row}>
                            <Text style={[styles.infoText, styles.flexText]}>
                                <Text style={styles.label}>Nome:</Text> {item.nome}
                            </Text>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteUsuario(item.id)}
                            >
                                <Text style={styles.deleteButtonText}>Excluir</Text>
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.infoText}>
                            <Text style={styles.label}>ID:</Text> {item.id}
                        </Text>
                        <TouchableOpacity
                            style={styles.toggleButton}
                            onPress={() => toggleAdminStatus(item.id, item.status)}
                        >
                            <Text style={styles.toggleButtonText}>
                                {item.status === 'admin' ? 'Tornar Usuário' : 'Tornar Admin'}
                            </Text>
                        </TouchableOpacity>
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
    toggleButton: {
        backgroundColor: '#90CAF9',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    toggleButtonText: {
        color: '#1565C0',
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
