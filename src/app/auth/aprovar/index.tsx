import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

export interface AprovarProdutosProps {}

export default function AprovarProdutos(props: AprovarProdutosProps) {
  const produtosDescartados = [
    { usuario: 'carloswgama@gmail.com', produtos: 5 },
    { usuario: 'carloswgama@gmail.com', produtos: 2 },
    { usuario: 'carloswgama@gmail.com', produtos: 1 },
  ];

  const handleAprovar = (usuario: string) => {
    Alert.alert('Aprovação', `Produto do usuário ${usuario} foi aprovado.`);
  };

  const handleReprovar = (usuario: string) => {
    Alert.alert('Reprovação', `Produto do usuário ${usuario} foi reprovado.`);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Produtos para Aprovação</Text>

      {produtosDescartados.map((prod, index) => (
        <View key={index} style={styles.card}>
          <View style={styles.infoContainer}>
            <Text style={styles.usuarioText}>{prod.usuario}</Text>
            <Text style={styles.produtoText}>Produtos: {prod.produtos}</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.aprovarButton]} 
              onPress={() => handleAprovar(prod.usuario)}
            >
              <Text style={styles.buttonText}>Aprovar</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.reprovarButton]} 
              onPress={() => handleReprovar(prod.usuario)}
            >
              <Text style={styles.buttonText}>Reprovar</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#241d0d',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c29458',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderColor: '#c29458',
    borderWidth: 1,
  },
  infoContainer: {
    marginBottom: 15,
  },
  usuarioText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#241d0d',
  },
  produtoText: {
    fontSize: 14,
    color: '#241d0d',
    marginTop: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  aprovarButton: {
    backgroundColor: 'green',
  },
  reprovarButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
